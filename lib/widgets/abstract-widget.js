import {TemplateOptions, ComponentInterface} from 'cutejs-lib/cute-library';
import Widget from 'zb/widgets/widget';
import {findFirstElementNode} from 'zb/html';


/**
 * @abstract
 * @implements {ComponentInterface}
 */
export default class AbstractWidget extends Widget {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {Object}
		 * @protected
		 */
		this._exported = this._renderTemplate();

		this.setContainer(findFirstElementNode(this._exported.root));
	}

	/**
	 * @abstract
	 * @return {Object}
	 * @protected
	 */
	_renderTemplate() {}

	/**
	 * @return {Object}
	 * @protected
	 */
	_getTemplateData() {
		return {};
	}

	/**
	 * @return {TemplateOptions}
	 * @protected
	 */
	_getTemplateOptions() {
		return {
			afterAppendComponent: (widget, exportName) => {
				// Ignore name for widgets exported into array
				this.appendWidget(widget, /\[]$/.test(exportName) ? '' : exportName);
			}
		};
	}
}
