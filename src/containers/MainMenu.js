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
			"nodes": []
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
			<ul>
				<li onTouchTap={this.newFileHandler}>New file</li>
				<li onTouchTap={this.openFileHandler}>Load file</li>
			</ul>
		);
	}
}