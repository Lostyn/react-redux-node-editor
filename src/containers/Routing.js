import React from 'react';

export default class Routing extends React.Component {
	static propTypes = {
		location: React.PropTypes.string.isRequired
	};
	static contextTypes = {
		store: React.PropTypes.object
	}

	constructor(props) {
		super(props);
	}

	getContent(){
		const {location} = this.props;
		const o = this.props.routes.find( o => o.src == location);
		if (o != null) {
			return React.createElement(o.container, o.props);
		} else {
			<div className="routing">404 not found</div>
			console.error("Route \"" + location + "\" not registered");
		}
	}

	render() {
		return this.getContent();
	}
}
