const getCuts = (from, to, lx, ly) => {
    if (from.pt.x < to.pt.x)
    {
        let px = [from.pt.x, from.ctrl.x, to.ctrl.x, to.pt.x];
        let py = [from.pt.y, from.ctrl.y, to.ctrl.y, to.pt.y];

        return computeBezierIntersections(px, py, lx, ly);
    } else {
        const interY = (from.pt.y + to.pt.y) / 2;
        let px = [from.pt.x, from.ctrl.x, from.ctrl.x, from.pt.x];
        let py = [from.pt.y, from.ctrl.y, interY, interY];

        let cross = computeBezierIntersections(px, py, lx, ly);

        px = [from.pt.x, to.pt.x];
        py = [interY, interY];

        cross = [
            ...cross,
            ...computeLineIntersections(from.pt.x, interY, to.pt.y, interY, lx[0], ly[0], lx[1], ly[1])
        ]

        px = [to.pt.x, to.ctrl.x, to.ctrl.x, to.pt.x];
        py = [interY, interY, to.ctrl.y, to.pt.y];
        cross = [
            ...cross,
            ...computeBezierIntersections(px, py, lx, ly)
        ]
        
        return cross;
    }
}

const computeLineIntersections = (x1,y1,x2,y2,x3,y3,x4,y4) => {
    const eps = 0.0000001;
    const between = (a,b,c) => a-eps <= b && b <= c+eps;

    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));

    if (isNaN(x)||isNaN(y)) {
        return [];
    } else {
        if (x1>=x2) {
            if (!between(x2, x, x1)) {return [];}
        } else {
            if (!between(x1, x, x2)) {return [];}
        }
        if (y1>=y2) {
            if (!between(y2, y, y1)) {return [];}
        } else {
            if (!between(y1, y, y2)) {return [];}
        }
        if (x3>=x4) {
            if (!between(x4, x, x3)) {return [];}
        } else {
            if (!between(x3, x, x4)) {return [];}
        }
        if (y3>=y4) {
            if (!between(y4, y, y3)) {return [];}
        } else {
            if (!between(y3, y, y4)) {return [];}
        }
    }
    return [{x, y}];
}

const computeBezierIntersections = (px, py, lx, ly) => {
	var X=Array();
 
    var A=ly[1]-ly[0];      //A=y2-y1
    var B=lx[0]-lx[1];      //B=x1-x2
    var C=lx[0]*(ly[0]-ly[1]) + 
          ly[0]*(lx[1]-lx[0]);  //C=x1*(y1-y2)+y1*(x2-x1)
 
    var bx = bezierCoeffs(px[0],px[1],px[2],px[3]);
    var by = bezierCoeffs(py[0],py[1],py[2],py[3]);
 
    var P = Array();
    P[0] = A*bx[0]+B*by[0];     /*t^3*/
    P[1] = A*bx[1]+B*by[1];     /*t^2*/
    P[2] = A*bx[2]+B*by[2];     /*t*/
    P[3] = A*bx[3]+B*by[3] + C; /*1*/
 
    var r=cubicRoots(P);
    
    let R = [];
    /*verify the roots are in bounds of the linear segment*/    
    for (var i=0;i<3;i++)
    {
        let t=r[i];
 
        X[0]=bx[0]*t*t*t+bx[1]*t*t+bx[2]*t+bx[3];
        X[1]=by[0]*t*t*t+by[1]*t*t+by[2]*t+by[3];            
 
        /*above is intersection point assuming infinitely long line segment,
          make sure we are also in bounds of the line*/
        var s;
        if ((lx[1]-lx[0])!=0)           /*if not vertical line*/
            s=(X[0]-lx[0])/(lx[1]-lx[0]);
        else
            s=(X[1]-ly[0])/(ly[1]-ly[0]);
 
        /*in bounds?*/
        if (t<0 || t>1.0 || s<0 || s>1.0 || isNaN(t))
        {
            X[0]=-100;  /*move off screen*/
            X[1]=-100;
        }
        
        if (X[0] != -100) R.push({
            x: X[0],
            y: X[1]
        })
    }   
    return R;
}

const cubicRoots = (P) => {
	var a=P[0];
	var b=P[1];
	var c=P[2];
	var d=P[3];
	
	var A=b/a;
	var B=c/a;
	var C=d/a;

	var Q, R, D, S, T, Im;

    var Q = (3*B - Math.pow(A, 2))/9;
    var R = (9*A*B - 27*C - 2*Math.pow(A, 3))/54;
    var D = Math.pow(Q, 3) + Math.pow(R, 2);    // polynomial discriminant

    var t=Array();

    if (D >= 0)                                 // complex or duplicate roots
    {
        var S = sgn(R + Math.sqrt(D))*Math.pow(Math.abs(R + Math.sqrt(D)),(1/3));
        var T = sgn(R - Math.sqrt(D))*Math.pow(Math.abs(R - Math.sqrt(D)),(1/3));

        t[0] = -A/3 + (S + T);                    // real root
        t[1] = -A/3 - (S + T)/2;                  // real part of complex root
        t[2] = -A/3 - (S + T)/2;                  // real part of complex root
        Im = Math.abs(Math.sqrt(3)*(S - T)/2);    // complex part of root pair   
        
        /*discard complex roots*/
        if (Im!=0)
        {
            t[1]=-1;
            t[2]=-1;
        }
    
    }
    else                                          // distinct real roots
    {
        var th = Math.acos(R/Math.sqrt(-Math.pow(Q, 3)));
        
        t[0] = 2*Math.sqrt(-Q)*Math.cos(th/3) - A/3;
        t[1] = 2*Math.sqrt(-Q)*Math.cos((th + 2*Math.PI)/3) - A/3;
        t[2] = 2*Math.sqrt(-Q)*Math.cos((th + 4*Math.PI)/3) - A/3;
        Im = 0.0;
    }
    
    /*discard out of spec roots*/
	for (var i=0;i<3;i++) 
        if (t[i]<0 || t[i]>1.0) t[i]=-1;

    /*sort but place -1 at the end*/
    t=sortSpecial(t);
    
    return t;
}

const sortSpecial = (a) => {
    var flip;
    var temp;
    
    do {
        flip=false;
        for (var i=0;i<a.length-1;i++)
        {
            if ((a[i+1]>=0 && a[i]>a[i+1]) ||
                (a[i]<0 && a[i+1]>=0))
            {
                flip=true;
                temp=a[i];
                a[i]=a[i+1];
                a[i+1]=temp;
                
            }
        }
    } while (flip);
	return a;
}

const bezierCoeffs = (P0,P1,P2,P3) => {
	var Z = Array();
	Z[0] = -P0 + 3*P1 + -3*P2 + P3; 
    Z[1] = 3*P0 - 6*P1 + 3*P2;
    Z[2] = -3*P0 + 3*P1;
    Z[3] = P0;
	return Z;
}

const sgn = ( x ) => {
    if (x < 0.0) return -1;
    return 1;
}

export {
    getCuts
}