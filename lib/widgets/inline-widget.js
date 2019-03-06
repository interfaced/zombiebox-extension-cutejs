import {ComponentInterface, ComponentContainerInterface} from 'cutejs-lib/cute-library';
import IWidget from 'zb/widgets/interfaces/i-widget';
import Widget from 'zb/widgets/widget';


/**
 * @implements {ComponentContainerInterface}
 */
export default class InlineWidget extends Widget {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		super();

		this.setContainer(container);
	}

	/**
	 * Append widget to the layer
	 * @param {ComponentInterface} widget
	 * @param {string} exportName
	 * @return {boolean}
	 */
	appendComponent(widget, exportName) {
		return this.appendWidget(/** @type {IWidget} */ (widget), exportName);
	}
}
