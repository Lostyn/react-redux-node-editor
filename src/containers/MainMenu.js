import '../styles/mainmenu.css';

import React from 'react';
import {remote} from 'electron';
import storage from '../utils/storage';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

export default class MainMenu extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
	};

	static contextTypes = {
		store: React.PropTypes.object
	}

	constructor(props) {
		super(props);

		this.newFileHandler = this.newFileHandler.bind(this);
		this.openFileHandler = this.openFileHandler.bind(this);
	}

	newFileHandler() {
		this.props.startEdit({
			"connections": [],
			"nodes": [{
				nid: 1,
				type: "start",
				name: "Entry",
				fields: {
					in: [],
					out: [{
						name: "to"
					}]
				},
				x: 200,
				y: 200
			}]
		});
	}

	openFileHandler() {
		const paths = remote.dialog.showOpenDialog({properties: ['openFile']});
		if (typeof paths != "undefined")
		{
			const path = paths[0];
			
			storage.get(path)
				.then( data => {
					this.props.startEdit(data, path);
				})
				.catch( err => {
					console.log("err", err);
				});
		}
	}

	render() {
		return (
			<div className="mainmenu">
				<div className="mainmenu_body">
					<div className="mainmenu_logo"/>
					<div className="mainmenu_baseline"><span>Kaeps</span> dialog node base editor</div>
					<div className="mainmenu_option">
						<div onClick={this.newFileHandler}>New file</div>
						<div onClick={this.openFileHandler}>Load file</div>
					</div>
				</div>
			</div>
			
		);
	}
}