import React from 'react';
import {findDOMNode}from 'react-dom'
import RenderToLayer from './RenderToLayer';
import EventListener from 'react-event-listener';
import keycode from 'keycode';

const getStyles = (props) => {
	const {
		open
	} = props;

	return {
		root: {
			position: 'fixed',
			boxSizing: 'border-box',
			zIndex: 1500,
			top: 0,
			left: open ? 0 : -10000,
			width: '100%',
			height: '100%',
			transition: open ?
				"left 0ms easeOut 0ms" : 
				"left 0mx easeOut 450ms",
		},
		overlay: {
			position: 'fixed',
			height: '100%',
			width: '100%',
			top: 0,
			left: open ? '0' : '-100%',
			opacity: open ? 1 : 0,
			backgroundColor: 'rgba(0,0,0,0.5)',
			
			willChange: 'opacity',
			transform: 'translateZ(0)',

			transition: 'left 0ms easeOut 400ms, opacity 400ms easeOut',
		},
		body: {
			boxSizing: 'border-box',
			overflowY: 'hidden'
		}
	}
};

class DialogInline extends React.Component {
	static propTypes = {
		autoDetectWindowHeight: React.PropTypes.bool,
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		modal: React.PropTypes.bool,
		open: React.PropTypes.bool.isRequired,
		style: React.PropTypes.object,
		onClose: React.PropTypes.func,
	};

	componentDidMount() {
		this.positionDialog();
	}

	componentDidUpdate() {
		this.positionDialog();
	}

	positionDialog() {
		const {
			open,
			autoDetectWindowHeight
		} = this.props;

		if (!open) return;

		const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		const container = findDOMNode(this);
		const dialogWindow = this.dialogWindow;
		const dialogContent = this.dialogContent;
		const minPaddingTop = 16;

		dialogContent.style.height = '';

		const dialogWindowHeight = dialogWindow.offsetHeight;
		let paddingTop = ((clientHeight - dialogWindowHeight) / 2) - 64;
		
		if (paddingTop < minPaddingTop) paddingTop = minPaddingTop;
		if (!container.style.paddingTop) {
		    container.style.paddingTop = `${paddingTop}px`;
		}

		if (autoDetectWindowHeight) {
			let maxDialogContentHeight = clientHeight - 2 * 64;

			dialogContent.style.maxHeight = `${maxDialogContentHeight}px`;
		}
	}

	requestClose(){
		if (typeof this.props.onClose != "undefined")
			this.props.onClose();
	}

	handleKeyUp = (event) => {
		if (keycode(event) === 'esc')
			this.requestClose();
	};

	handleResize = () => {
		this.positionDialog();
	}

	render() {
		const {
			children, 
			className,
			open,
			style
		} = this.props;

		const styles = getStyles(this.props);

		return (
			<div className={className} style={styles.root}>
				<div className="nodeEdition" ref={ref => this.dialogWindow = ref} >
					{ open && 
						<EventListener
							target="window"
							onKeyUp={this.handleKeyUp}
							onResize={this.handleResize}
						/>
					}
					{ open &&
						<div ref={ref => this.dialogContent = ref} style={styles.body}>
							{children}
						</div>
					}
				</div>
				<div className="overlay" style={styles.overlay}/>
			</div>
		);
	}
}

class Dialog extends React.Component {
	static propTypes = {
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		open: React.PropTypes.bool.isRequired,
		autoDetectWindowHeight: React.PropTypes.bool,
		repositionOnUpdate: React.PropTypes.bool,
	};

	static defaultProps = {
	    autoDetectWindowHeight: true,
	    modal: false,
	    repositionOnUpdate: true,
	};

	renderLayer = () => {
		return (
			<DialogInline {...this.props} />
		);
	}

	render() {
		return (
			<RenderToLayer render={this.renderLayer} open={this.props.open} userLayerForClickAway={false} />
		);
	}
}


export default Dialog;