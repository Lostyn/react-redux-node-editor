import React from 'react';
import {findDOMNode}from 'react-dom'
import {remote} from 'electron';

import Node from '../components/Node';
import EditorView from '../components/EditorView';
import Menu from '../components/Menu';
import ListBar from '../components/ListBar';
import NodeEdition from '../components/NodeEdition';

import {arraySetUniqueElem} from '../utils'
import {computeIntersections} from '../utils/lineUtils'

import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';
import storage from '../utils/storage';

export default class Editor extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
	};

	static contextTypes = {
		store: React.PropTypes.object
	}

	constructor(props, context) {
		super(props);

		this.state = {
			mouseX: 0,
			mouseY: 0,
			cut: {
				enable: false,
				startX: 0,
				startY: 0
			},
			selected: -1,
			edit: -1
		}

		this.cuts = [];
		
		this.throttledMouseMove = throttle( this.throttledMouseMove.bind(this), 10);
		this.nodeMoved = throttle(this.nodeMoved.bind(this), 20);
		this.onAddNode = this.onAddNode.bind(this);
		this.startConnection = this.startConnection.bind(this);
		this.onCloseConnection = this.onCloseConnection.bind(this);
		this.save = this.save.bind(this);
		this.onUpHandler = this.onUpHandler.bind(this);
		this.onDownhandler = this.onDownhandler.bind(this);
		this.mouseMove = this.mouseMove.bind(this);

		document.onkeydown = this.onKeyDownHandler.bind(this);
	}

	componentWillUnmount() {
		document.onkeydown = undefined;
	}

	onKeyDownHandler(evt) {
		switch(evt.key){
			case "Delete":
				if (this.state.selected != -1){
					const {deleteNode} = this.props.actions;
					deleteNode(this.state.selected);

					this.setState({
						selected: -1
					});
				}
				break;
		}
	}

	selectNode = (nid) => {
		this.setState({
			selected: nid
		});
	}

	getCutLine(){
		if (this.state.cut.enable)
		{
			let items = [
				<line 
					key="cut" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeDasharray="5, 5"
					x1={this.state.cut.startX} 
					y1={this.state.cut.startY} 
					x2={this.state.mouseX} 
					y2={this.state.mouseY}/>
			];

			const lx = [this.state.cut.startX, this.state.mouseX];
			const ly = [this.state.cut.startY, this.state.mouseY];
			this.props.connections.map( (item, index) => {
				const from = this.getPos(item.from_node, item.from, "out");
				const to = this.getPos(item.to_node, item.to, "in");
				let px = [from.pt.x, from.ctrl.x, to.ctrl.x, to.pt.x];
				let py = [from.pt.y, from.ctrl.y, to.ctrl.y, to.pt.y];

				const inter = computeIntersections(px, py, lx, ly);
				if (inter != null){
					this.cuts = arraySetUniqueElem(this.cuts, item);
					items.push(
						<circle 
							key={`cut_${index}`}
							r="5"
							cx={inter[0]}
							cy={inter[1]}
							fill="red"
						/>
					);
				} else{
					const index = this.cuts.indexOf(item);
					if (index != -1)
						this.cuts.splice(index, 1);
				}
			});

			return items;
		}
	}

	getPos(nodeId, pId, side) {
		const isSideIn = () => side == "in";

		if (nodeId != null)
		{
			const e = document.querySelector(".editor-view");
			const conn = document.querySelector(`#${pId}`);
			
			if (conn != null)
			{
				const x = conn.getBoundingClientRect().left - e.offsetLeft;
				const y = conn.getBoundingClientRect().top - e.offsetTop;

				let o = {
					pt:{
						x, y
					},
					ctrl:{
						x : x + (isSideIn() ? -50 : 50),
						y,
					}
				}

				return o;
			}
		}

		return {
			pt:{
					x : this.state.mouseX,
					y : this.state.mouseY,
				},
				ctrl:{
					x : this.state.mouseX + (isSideIn() ? -50 : 50),
					y : this.state.mouseY,
				}
		}
	}

	getNode(nodeId) {
		return this.props.nodes.find( (o) => o.nid == nodeId);
	}

	nodeMoved(nid, pos){
		const {moveNode} = this.props.actions;
		moveNode(nid, pos.x, pos.y);
	}

	cleanConnection(){
		const {cleanConnections} = this.props.actions;
		cleanConnections();

		this.setState({
			cut:{
				enable: false,
				startX: 0,
				startY: 0
			}
		});
	}

	startConnection(conn){
		const {addConnection} = this.props.actions;
		addConnection(conn);
	}

	onCloseConnection(item, side, nodeId){
		let conn = this.props.connections.find( (o) => o.from == null | o.to == null);
		this.cleanConnection();

		if (typeof conn != "undefined"){
			if ((conn.from_node != nodeId && conn.to_node != nodeId)){
				conn.from_node = conn.from_node || nodeId;
				conn.from = conn.from || item.id;
				conn.to_node = conn.to_node || nodeId;
				conn.to = conn.to || item.id;
				const {addConnection} = this.props.actions;
				addConnection(conn);
			}
		}
	}

	throttledMouseMove(e){
		const pos = this.getMousePosInView(e);
		this.setState({
			mouseX: pos.x,
			mouseY: pos.y
		});
	}

	getMousePosInView(evt){
		const graphOffset = findDOMNode(this.graph).getBoundingClientRect();

		return {
			x: evt.clientX - graphOffset.left,
			y: evt.clientY - graphOffset.top
		}
	}

	mouseMove(evt){
		evt.persist();
		this.throttledMouseMove(evt);
	}

	onUpHandler(e){
		if(e.target.className.baseVal == "graph"){
			this.setState({
				selected: -1
			})
		}

		if (this.state.cut.enable)
			this.processCut();

		this.cleanConnection();
	}

	processCut(){
		if(this.cuts.length > 0)
		{
			const {cutConnections} = this.props.actions;
			cutConnections(this.cuts);

			this.cuts = [];
		}
	}

	onDownhandler(evt){
		evt.stopPropagation();

		if(evt.altKey){
			const pos = this.getMousePosInView(evt);
			this.setState({
				cut:{
					enable: true,
					startX: pos.x,
					startY: pos.y
				}
			})
		}
	}

	onAddNode(node, e){
		const pos = this.getMousePosInView(e);
		if (pos.x > 0 && pos.y > 0)
		{
			const {addNode} = this.props.actions;
			addNode(node, pos.x, pos.y);
		}
	}

	save(){
		let path = this.props.path;
		if (typeof path == "undefined")
			path = remote.dialog.showSaveDialog({properties: ['SaveFile']});

		const datas = {
			nodes:this.props.nodes,
			connections: this.props.connections
		}
		storage.set(path, datas)
			.then( () => {
				console.log("file saved");
			})
			.catch( err => {
				console.log("save file error", err);
			})
	}

	editHandler = (nid) => {
		this.setState({
			edit:nid
		})
	}

	onCloseEditionHandler = () => {
		this.setState({
			edit:-1
		})
	}

	drawNodes(){
		return this.props.nodes.map( (item, index) => {
			return <Node 
						{...item} 
						key={`node_${item.nid}`}
						id={`node_${item.nid}`}
						onMoved={this.nodeMoved}
						onStartConnection={this.startConnection}
						onCloseConnection={this.onCloseConnection}
						onClick={this.selectNode}
						editHandler={this.editHandler}
						selected={this.state.selected == item.nid}/>
		});
	}

	drawGraph() {
		return (
			<svg className="graph" height="4000" width="4000" version="1.1">
			{
				this.props.connections.map( (item, index) => {
					const from = this.getPos(item.from_node, item.from, "out");
					const to = this.getPos(item.to_node, item.to, "in");
					
					return <path key={index} fill="none" stroke={this.cuts.indexOf(item) == -1 ? "#555" : "#F00"}
						d={`M${from.pt.x},${from.pt.y} C${from.ctrl.x},${from.ctrl.y} ${to.ctrl.x},${to.ctrl.y} ${to.pt.x},${to.pt.y}`} 
					/>			
				})
			}
			{
				this.getCutLine()
			}
			</svg>
		);
	}

	render() {
		const nodeEdit = this.props.nodes.find( o => o.nid == this.state.edit);

		return (
			<div onMouseUp={this.onUpHandler} onMouseDown={this.onDownhandler}>
				<ListBar onAddNode={this.onAddNode}/>
				<EditorView onMouseMove={this.mouseMove}>
					<div className="help">
						<p>Alt + drag : Start cut line</p>
						<p>Select to edit node</p>
					</div>
					<div className="graph" ref={ref => this.graph = ref}>
						{this.drawGraph()}
					</div>
					<div className="nodes-containers">
						{this.drawNodes()}
					</div>
				</EditorView>
				<NodeEdition 
					node={nodeEdit}
					onCloseHandler={this.onCloseEditionHandler}
					updateAction={this.props.actions.updateNode}
				/>
				<Menu backToMenu={this.props.backToMenu}
					save={this.save}/>
			</div>
		);
	}
}