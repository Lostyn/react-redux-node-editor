import React from 'react';
import ReactDOM from 'react-dom';
import isEqual from 'lodash/isEqual';
import {Edit} from '../utils/icons';
import * as nodes from './nodes';

export default class Node extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
	};

	constructor(props) {
		super(props);

		this.onMouseMove = ::this.onMouseMove;
		this.onMouseUp = ::this.onMouseUp;

		this.state = {
			dragging: false,
			rel: null,
			pos: {
				x: this.props.x,
				y: this.props.y,
			}
		}
	}

	getStyles() {
		return {
			node: {
				top: this.props.y,
				left: this.props.x,
			}
		}
	}

	onPressFieldHandler(item, side, evt){
		evt.stopPropagation();
		let o = {
            "from": side == "out" ? item.id : null,
            "from_node": side == "out" ? this.props.nid : null,
            "to": side == "in" ? item.id : null,
            "to_node": side == "in" ? this.props.nid : null,
        };
		this.props.onStartConnection(o);
	}

	onUpHandler(item, side, evt){
		evt.stopPropagation();
		this.props.onCloseConnection(item, side, this.props.nid);
	}

	getInputs() {
		return this.props.fields.in.map( (item, index) => {
			return (
				<div key={index} className="field" 
					onMouseDown={this.onPressFieldHandler.bind(this, item, "in")}
					onMouseUp={this.onUpHandler.bind(this, item, "in")}
				>
					<span className="inner-field">
					<span id={item.id}></span> {item.name}
					</span>
				</div>
			);
		});
	}

	getOutputs() {
		return this.props.fields.out.map( (item, index) => {
			return (
				<div key={index} className="field" 
					onMouseDown={this.onPressFieldHandler.bind(this, item, "out")}
					onMouseUp={this.onUpHandler.bind(this, item, "out")}
				>
					<span className="inner-field">
					{item.name} <span id={item.id}></span>
					</span>
				</div>	
			);
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.dragging && !prevState.dragging) {
			document.addEventListener('mousemove', this.onMouseMove);
			document.addEventListener('mouseup', this.onMouseUp);
		} else if (!this.state.dragging && prevState.dragging) {
			document.removeEventListener('mousemove', this.onMouseMove);
			document.removeEventListener('mouseup', this.onMouseUp);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (isEqual(nextProps, this.props) &&
			isEqual(nextState, this.state))
		{
			return false;
		}
		
		return true;
	}

	onMouseDownHandler(e) {
		if (e.button !== 0) return;
		const domNode = ReactDOM.findDOMNode(this._elem);
		
		this.setState({
			dragging: true,
			rel: {
				x: e.pageX - domNode.offsetLeft,
				y: e.pageY - domNode.offsetTop,
			}
		});
		e.stopPropagation();
		e.preventDefault();

		this.props.onClick(this.props.nid);
	}

	onMouseMove(e) {
		if (!this.state.dragging) return;
		const pos = {
			x: e.pageX - this.state.rel.x,
			y: e.pageY - this.state.rel.y,
		}
		this.setState({
			pos,
		});
		this.props.onMoved(this.props.nid, pos);
	}

	onMouseUp(e) {
		this.setState({
			dragging: false,
		});
		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		const styles = this.getStyles();
		
		return (
			<div 
				className={`node${this.props.selected ? " active" : ""} ${this.props.type}`}
				style={styles.node}
				ref={ ref => this._elem = ref}
				id={this.props.id}
			>
				<div className="node_body">
					<div className="head" onMouseDown={::this.onMouseDownHandler}>{this.props.name}</div>
					<div className="options">
						<div className="inputs">
							{this.getInputs()}
						</div>
						{
							React.createElement(nodes[this.props.type], {
								value:this.props.value
							})
						}
						<div className="outputs">
							{this.getOutputs()}
						</div>
					</div>
				</div>
				{ this.props.nid > 1 &&
				<div className="node_options">
					<Edit onClick={ () => this.props.editHandler(this.props.nid)}/>
					<p>Edit</p>
				</div>
				}
			</div>
		);
	}
}
