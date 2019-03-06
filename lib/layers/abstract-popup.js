import {TemplateOptions} from 'cutejs-lib/cute-library';
import Popup from 'zb/layers/popup';


/**
 * @abstract
 */
export default class AbstractPopup extends Popup {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {Object}
		 * @protected
		 */
		this._exported = this._renderTemplate();

		this._container.appendChild(this._exported.root);
	}

	/**
	 * @abstract
	 * @return {Object}
	 * @protected
	 */
	_renderTemplate() {}

	/**
	 *
	 * @return {Object}
	 * @protected
	 */
	_getTemplateData() {
		return {};
	}

	/**
	 *
	 * @return {TemplateOptions}
	 * @protected
	 */
	_getTemplateOptions() {
		return {
			afterAppendComponent: (widget, exportName) => this.appendWidget(widget, exportName)
		};
	}
}
