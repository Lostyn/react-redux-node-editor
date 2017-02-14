import React from 'react';

const getSubmit = (cancelHandler) => {
	return (
		<div className="edition_submit">
			<button id="submit" type="submit" className="edition_button turquoise">Save</button>
			<a className="edition_button gray cancel"  onClick={cancelHandler}>Cancel</a>
    	</div>
    );
}



const getHeader = (label) => {
	return (
		<div className="header">
			<span>Node type: {label}</span>
		</div>
	);
}

const Encaps = (props) => {
	return (
		<div className="edition">
			{getHeader(props.type)}
				<div className="edition_body">
					<form onSubmit={props.onValid}>
						<div className="wrapper">
						{props.children}
						</div>
						{getSubmit(props.onCancel)}
					</form>
			</div>
		</div>
	);
}

const ValueField = (props) => {
	const baseline = props.info ? `(${props.info})` : "";
	return (
		<div className="edition_field">
			<p>{props.label} <span>{baseline}</span></p>
			<textarea name={`value_${props.label}`} cols="35" wrap="soft" style={props.style} defaultValue={props.value}></textarea>
		</div>
	);
}

const PropField = (props) => {

	return (
		<div className="edition_field_prop">
			<input type="text" name={`value_${props.label}`} onChange={props.onChange} value={props.value}/>
			<a className="field_props gray cancel" onClick={props.removeEntry}>-</a>
			<a className="field_props turquoise" onClick={props.addEntry}>+</a>
		</div>
	);
}

class text extends React.Component {
	validHandler = (e) => {
		e.preventDefault();

		let adds = e.target.value_Adds.value;
		let datas = {
			value: e.target.value_Sentence.value,
			adds: JSON.parse(`{${adds}}`) 
		}

		this.props.onValid(datas);
	};
  	
  	render() {
  		let adds = JSON.stringify(this.props.node.adds);

		return (
			<Encaps type="Texte" onValid={this.validHandler} onCancel={this.props.onClose}>
				<ValueField label="Sentence" style={{height: "50px"}} value={this.props.node.value}/>
				<ValueField label="Adds" style={{height: "150px"}} value={adds.slice(1, -1)}/>
			</Encaps>
		);
  	}
}

class choice extends React.Component {

	constructor(props){
		super(props)

		this.state = {
			outs: props.node.fields.out.slice(0)
		}
	}

	validHandler = (e) => {
		e.preventDefault();


		let adds = e.target.value_Adds.value;
		let datas = {
			fields: {
				in: this.props.node.fields.in,
				out: this.state.outs
			},
			value: e.target.value_Sentence.value,
			adds: JSON.parse(`{${adds}}`),
		}

		this.props.onValid(datas);
	};

	addEntry = () => {
		this.setState({
			outs: [
				...this.state.outs,
				{
					name: "new entry"
				}
			]
		});
	};

	removeEntry = (index) => {
		this.setState({
			outs: this.state.outs.filter( (o, i) => i != index)
		});
	};

	onChange = (index, e) => {
		this.setState({
			outs: this.state.outs.map( (o, i) => 
				i == index ? {name: e.target.value} : o
			)
		});
	}
	
	render() {
		let adds = JSON.stringify(this.props.node.adds);
		
		return (
			<Encaps type="Choix" onValid={this.validHandler} onCancel={this.props.onClose}>
				<ValueField label="Sentence" info="optionnel" value={this.props.node.value}/>
				{
					this.state.outs.map( (o, index) => {
						return <PropField key={index} 
											label="outProps" 
											value={o.name}
											addEntry={this.addEntry}
											removeEntry={this.removeEntry.bind(this, index)}
											onChange={this.onChange.bind(this, index)}/>
					})
				}
				<ValueField label="Adds" style={{height: "150px"}} value={adds.slice(1, -1)}/>
			</Encaps>
		);
	}
}

export {
	text,
	choice
}