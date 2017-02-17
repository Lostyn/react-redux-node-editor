import React from 'react';

const Connection = (props) => {	
	const {
		from,
		to,
		color
	} = props;

	if (from.pt.x < to.pt.x)
	{
		return <path fill="none" stroke={color}
			d={`M${from.pt.x},${from.pt.y} C${from.ctrl.x},${from.ctrl.y} ${to.ctrl.x},${to.ctrl.y} ${to.pt.x},${to.pt.y}`} 
		/>	
	} else {
		const interY = (from.pt.y + to.pt.y) / 2;
		return <path fill="none" stroke={color}
			d={
				`M${from.pt.x} ${from.pt.y} C${from.ctrl.x} ${from.ctrl.y} 
				${from.pt.x + 50} ${interY} ${from.pt.x} ${interY}
				L${to.pt.x} ${interY} 
				M${to.pt.x} ${interY} C${to.pt.x - 50} ${interY} 
				${to.ctrl.x} ${to.ctrl.y} ${to.pt.x} ${to.pt.y}`
			} 
		/>
	}
}

export default Connection;