import AbstractCuteWidget from 'cutejs/widgets/abstract-cute-widget';
import {render, Out} from 'generated/cutejs/<%= componentName %>/widgets/<%= slug %>/<%= slug %>.jst';


/**
 */
export default class <%= name %> extends AbstractCuteWidget {
	/**
	 * @param {Object} params
	 */
	constructor(params) {
		super();

		/**
		 * @type {Out}
		 * @protected
		 */
		this._exported;
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return render(this._getTemplateData(), this._getTemplateOptions());
	}
};
