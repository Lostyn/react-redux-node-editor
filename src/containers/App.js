import React from 'react';
import { connect } 				from 'react-redux';
import Routing from './Routing';
import { bindActionCreators } 	from 'redux';
import * as RoutingActions 		from '../actions/RoutingActionCreators';
import * as EditorActionCreators from '../actions/EditorActionCreators'

import MainMenu from '../containers/MainMenu'
import Editor from '../containers/Editor'

class App extends React.Component { 

	constructor(props) {
		super(props);
	}

	getRoutes(){
		return [
			{ src: "", container: MainMenu, props:{
				startEdit: this.startEdit
			}},
			{ src: "/editor", container: Editor, props: {
				backToMenu: this.backToMenu,
				export: this.export,
				nodes: this.props.editor.nodes,
				connections: this.props.editor.connections,
				path: this.props.editor.path,
				actions: this.props.editorActions
			}}
		];
	}

	startEdit = (datas, path = undefined) => {
		const {setWorkingFile} = this.props.editorActions;
		const {push} = this.props.routingActions;
		
		setWorkingFile(datas, path);
		push("/editor");
	};

	backToMenu = () => {
		const {setWorkingFile} = this.props.editorActions;
		const {push} = this.props.routingActions;

		setWorkingFile(undefined, undefined);
		push("");
	};

	export = () => {
		console.log("[App] export");
	}

	render() {
		const { location } = this.props.routing;
		
		return (
			<Routing routes={this.getRoutes()} location={location}/>
		);
	}
}

export default connect(state => state, dispatch => ({
	editorActions: bindActionCreators(EditorActionCreators, dispatch),
	routingActions: bindActionCreators(RoutingActions, dispatch)
}))(App);