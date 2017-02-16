import React from 'react';
import Config from '../core/Config';

export default class ListBar extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
	};

	constructor(props) {
		super(props);
		
		this.state = {
			dragging: false,
			rel: null,
			pos: {
				x: 0,
				y: 0,
			}
		}

		this.mouseUpHandler = ::this.mouseUpHandler;
		this.onMoveHandler = ::this.onMoveHandler;
	}

	onDragHandler(type, e) {
		document.addEventListener('mouseup', this.mouseUpHandler);
		document.addEventListener('mousemove', this.onMoveHandler);

		this.setState({
			dragging: true,
			rel: {
				type,
				x: e.pageX - e.target.offsetLeft,
				y: e.pageY - e.target.offsetTop,
			},
			pos: {
				x: e.target.offsetLeft,
				y: e.target.offsetTop,
			}
		});
		e.stopPropagation();
		e.preventDefault();
		
	}

	mouseUpHandler(e) {
		document.removeEventListener('mouseup', this.mouseUpHandler);
		document.removeEventListener('mousemove', this.onMoveHandler);
		
		const node = Config.nodes.find( o => o.type == this.state.rel.type)
		this.props.onAddNode(node, e);

		this.setState({
			dragging: false,
			rel: null,
		})
	}

	onMoveHandler(e) {
		this.setState({
			pos: {
				x: e.pageX - this.state.rel.x,
				y: e.pageY - this.state.rel.y,
			}
		})
	}

	getDrag() {
		if( this.state.dragging ) {
			const style = {
				left: this.state.pos.x,
				top: this.state.pos.y,
			}

			return (
				<div className="list-menu-dragged-node" style={style}>
					<span>{this.state.rel.type}</span>
				</div>
			);
		}
	}

	render() {
		return (
			<div className="list-menu-bar">
				<ul>
				{
					Config.nodes.map( (item, index) => {
						return (
							<li key={index} 
								className="list-menu-item ui-button" 
								onMouseDown={this.onDragHandler.bind(this, item.type)}
								style={{
									backgroundColor: ( this.state.rel && this.state.rel.type == item.type ) ? "rgba(255,255,255,.3)" : "transparent"
								}}
							>{item.type}</li>
						)
					})
				}
				</ul>
				{ this.getDrag() }
			</div>
		);
	}
}
