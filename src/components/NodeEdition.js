import '../styles/edition.css';

import React from 'react';
import Dialog from './dialog/Dialog';
import * as editors from './editors';

export default class NodeEdition extends React.Component {
	constructor(props) {
		super(props);
	}

	validHandler = (obj) => {
		const {
			updateAction
		} = this.props;

		updateAction(this.props.node.nid, obj);
		this.props.onCloseHandler();
	};

	getEditor() {
		const {
			node
		} = this.props;

		if (typeof node != "undefined")
		{
			return React.createElement(editors[node.type], {
				onValid: this.validHandler,
				onClose: this.props.onCloseHandler,
				node
			})
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return typeof this.props.node != "undefined";
	}

	render() {
		const {
			node
		} = this.props;
		
		return (
			<Dialog 
				open={typeof node != "undefined"}
				onClose={this.props.onCloseHandler}
			>
				{this.getEditor()}
			</Dialog>
		);
	}
}
