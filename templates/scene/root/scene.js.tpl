import AbstractCuteScene from 'cutejs/layers/abstract-cute-scene';
import {render, Out} from 'generated/cutejs/<%= componentName %>/scenes/<%= slug %>/<%= slug %>.jst';


/**
 */
export default class <%= name %> extends AbstractCuteScene {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {Out}
		 * @protected
		 */
		this._exported;

		this._addContainerClass('s-<%= slug %>');
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return render(this._getTemplateData(), this._getTemplateOptions());
	}
};
