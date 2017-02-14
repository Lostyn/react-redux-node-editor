import React from 'react';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode} from 'react-dom';

export default class RenderToLayer extends React.Component {
	static propTypes = {
	    componentClickAway: React.PropTypes.func,
	    open: React.PropTypes.bool.isRequired,
	    render: React.PropTypes.func.isRequired,
	    useLayerForClickAway: React.PropTypes.bool,
	};
	
	static defaultProps = {
	    useLayerForClickAway: true,
	};

	componentDidMount() {
		this.renderLayer();
	}

	componentDidUpdate(prevProps, prevState) {
		this.renderLayer();
	}

	componentWillUpdate(nextProps, nextState) {
		this.unrenderLayer();
	}

	onClickAway = (event) => {
		if (event.defaultPrevented)
			return;

		if (typeof this.props.componentClickAway != "undefined")
			return;

		if (!this.props.open)
			return;
		
		const el = this.layer;
		if (event.target !== el && event.target === window){
			this.props.componentClickAway(event);
		}
	};

	getLayer(){
		return this.layer;
	}

	unrenderLayer(){
		if (!this.layer) return;

		if (this.props.useLayerForClickAway){
			this.layer.style.position = 'relative';
			this.layer.removeEventListener('touchstart', this.onClickAway);
			this.layer.removeEventListener('click', this.onClickAway);
		} else {
			window.removeEventListener('touchstart', this.onClickAway);
			window.removeEventListener('click', this.onClickAway);
		}

		unmountComponentAtNode(this.layer);
		document.body.removeChild(this.layer);
		this.layer = null;
	}

	/**
	* By calling this method in componentDidMount() and
	* componentDidUpdate(), you're effectively creating a "wormhole" that
	* funnels React's hierarchical updates through to a DOM node on an
	* entirely different part of the page.
	*/
	renderLayer(){
		const {
			open,
			render,
		} = this.props;
		
		if (open){
			if (!this.layer) {
				this.layer = document.createElement('div');
				document.body.appendChild(this.layer);

				if (this.props.useLayerForClickAway){
					this.layer.addEventListener('touchstart', this.onClickAway);
					this.layer.addEventListener('click', this.onClickAway);
					this.layer.style.position = 'fixed';
					this.layer.style.top = 0;
					this.layer.style.bottom = 0;
					this.layer.style.left = 0;
					this.layer.style.right = 0;
					this.layer.style.zIndex = 1500;
					this.layer.style.transition = "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms";
				} else {
					setTimeout(() => {
						window.addEventListener('touchstart', this.onClickAway);
						window.addEventListener('click', this.onClickAway);
					}, 0);
				}
			}

			const layerElement = render();
			this.layerElement = unstable_renderSubtreeIntoContainer(this, layerElement, this.layer);
		} else {
			this.unrenderLayer();
		}
	}

	render() {
		return null;
	}
}
