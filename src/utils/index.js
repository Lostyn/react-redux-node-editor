const getArcPoint = (px, py, angle, dist) => {
	const nX = px + Math.cos(angle) * dist;
	const nY = py + Math.sin(angle) * dist;

	return {
		left: nX, 
		top: nY
	};
}

const arraySetUniqueElem = (array, elem) => {
	var a = array.slice(0);
	if (a.indexOf(elem) == -1) 
		a.push(elem);

	return a;
}

export {
	getArcPoint,
	arraySetUniqueElem
}