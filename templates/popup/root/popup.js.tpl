import AbstractCutePopup from 'cutejs/layers/abstract-popup';
import {render, Out} from 'generated/cutejs/<%= componentName %>/popups/<%= slug %>/<%= slug %>.jst';


/**
 */
export default class <%= name %> extends AbstractCutePopup {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {Out}
		 * @protected
		 */
		this._exported;

		this._addContainerClass('p-<%= slug %>');
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return render(this._getTemplateData(), this._getTemplateOptions());
	}
};
