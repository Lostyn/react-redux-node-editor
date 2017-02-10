import '../styles/menu.css';

import React from 'react';

export default class Menu extends React.Component {
	constructor(props) {
		super(props); 
	}

	render() {
		return (
			<ul className="main-menu-bar">
				<li>
					<span className="ui-button-text">Menu</span>
					<ul className="sub-menu">
						<li onTouchTap={this.props.backToMenu}>Close</li>
						<li onClick={this.props.save}>Save</li>
					</ul>
				</li>
				<li>
					<span className="ui-button-text">Edition</span>
				</li>
			</ul>
		);
	}
}
