import React from 'react';

class text extends React.Component {
	render(){
		return (
			<div className="center">
				{this.props.value}
			</div>
		);
	}
}

class choice extends React.Component {
	render(){
		return <div></div>;
	}
}

const start = () => <div />

export {
	text,
	choice,
	start
}