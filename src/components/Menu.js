import '../styles/menu.css';

import React from 'react';
import EventListener from 'react-event-listener';
import {findDOMNode}from 'react-dom'
import {isDescendant} from '../utils'

export default class Menu extends React.Component {
	constructor(props) {
		super(props); 

		this.state = {
			canOpen: false
		};
	}

	open = (e) => {
		this.setState({
			canOpen: true
		})
	};

	clicHandle = (e) => {
		const base = findDOMNode(this.base);
		if( !isDescendant(base, e.target))
		{
			this.setState({
				canOpen: false
			})
		}
	};

	

	render() {
		return (
			<ul ref={ref => this.base = ref} className={`main-menu-bar${this.state.canOpen ? ' canOpen' : ''}`} onClick={this.open}>
				{ this.state.canOpen &&
					<EventListener
			          target="window"
			          onClick={this.clicHandle}
			        />
				}
				<li>
					<span className="ui-button-text">Menu</span>
					<ul className="sub-menu">
						<li onClick={this.props.backToMenu}>Close</li>
						<li onClick={this.props.save}>Save</li>
					</ul>
				</li>
				<li>
					<span className="ui-button-text">Edition</span>
					<ul className="sub-menu">
						<li>Exporter</li>
					</ul>
				</li>
			</ul>
		);
	}
}
