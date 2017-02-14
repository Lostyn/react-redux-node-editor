import * as Types from '../constants/ActionTypes';

export function setWorkingFile(file, path) {
	return {
		type: Types.SET_WORKING_FILE,
		file,
		path
	}
}

export function addNode(node, x, y){
	let n = Object.assign({}, node, {
		x,
		y
	});

	return {
		type: Types.ADD_NODE,
		node: n
	}
}

export function deleteNode(nid) {
	return {
		type: Types.DELETE_NODE,
		nid
	}
}

export function addConnection(conn){
	return {
		type: Types.ADD_CONNECTION,
		conn
	}
}

export function cleanConnections(){
	return {
		type: Types.CLEAN_CONNECTIONS
	}
}

export function moveNode(nodeId, x, y) {
	return {
		type:Types.MOVE_NODE,
		nodeId,
		x,
		y
	}
}

export function cutConnections(aConn){
	return {
		type:Types.CUT_CONNECTIONS,
		aConn
	}
}

export function updateNode(nid, update) {
	return {
		type: Types.UPDATE_NODE,
		nid, 
		update
	}
}