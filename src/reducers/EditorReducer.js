import * as types from '../constants/ActionTypes'
import isEqual from 'lodash/isEqual';
import randomUuid from 'random-uuid'

const initialState = {
	nodes: [],
	connections: [],
	path: undefined
}

export default function some(state = initialState, action) {
	switch (action.type) {
		case types.SET_WORKING_FILE:
			return Object.assign({}, state, {
				nodes: typeof action.file == "undefined" ? [] : action.file.nodes ,
				connections: typeof action.file == "undefined" ? [] : action.file.connections,
				path:action.path
			})

		case types.ADD_NODE:
			let a = state.nodes;
			let nextId = 1;
			a.map( o => nextId = Math.max(nextId, o.nid + 1));
			
			return Object.assign({}, state, {
				nodes: [
					...a,
					 Object.assign({}, action.node, {
						nid:nextId,
						fields:{
							in: action.node.fields.in.map( o => {
								return {
									...o,
									id:randomUuid({ prefix: 'r-' })
								}
							}),
							out:action.node.fields.out.map( o => {
								return {
									...o,
									id:randomUuid({ prefix: 'r-' })
								}
							}),
						}
					})
				]
			});

		case types.DELETE_NODE:
			if (action.nid <= 1) return state;
			
			return Object.assign({}, state, {
				nodes: state.nodes.filter( o => o.nid !== action.nid),
				connections: state.connections.filter( o => o.from_node !== action.nid && o.to_node !== action.nid)
			})

		case types.ADD_CONNECTION:
			var a = [];
			if (action.conn.from != null && action.conn.to != null)
				a = state.connections.filter( o => o.from != action.conn.from)
			else a = state.connections;

			return Object.assign({}, state, {
				connections: [
					...a,
					action.conn
				]
			})

		case types.CLEAN_CONNECTIONS:
			return Object.assign({}, state, {
				connections: state.connections.filter( o => o.from != null && o.to != null)
			})

		case types.MOVE_NODE:
			return Object.assign({}, state, {
				nodes: state.nodes.map( (n) => n.nid == action.nodeId ? {
					...n,
					x: action.x,
					y: action.y
				}: n)
			})

		case types.CUT_CONNECTIONS:
			return Object.assign({}, state, {
				connections: state.connections.filter( (c) => action.aConn.indexOf(c) == -1)
			})

		case types.UPDATE_NODE:
			return Object.assign({}, state, {
				nodes: state.nodes.map( (n) => 
					n.nid == action.nid ? Object.assign({}, n, action.update) : n
				)
			})

		default:
			return state;
	}
}