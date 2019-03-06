# zombiebox-extension-cutejs

[ZombieBox](https://zombiebox.tv) extension provides ability for using CuteJS template engine in zb projects.

## Usage

All compiled components may be accessed trough `generated/cutejs/*` import path.
Also extension provides two additional namespaces:

* `cutejs-lib` - CuteJS's client-library
* `cutejs` - Contains abstract/base implementation of CuteJS's interfaces, includes: `abstract-pupup`, `abstract-scene`,
`inline-widget`, `abstract-widget`

### Example

**app/widgets/container/container.jst**

```js
<div class="w-container" data-export-id="{{@container}}">Hello</div>
```

**app/widgets/container/container.js**

```js
// Compiled template
import {render, Out} from 'generated/cutejs/<app>/widgets/container/container.jst';
// CuteJS's client-library
import {ComponentContainerInterface, ComponentInterface} from 'cutejs-lib/cute-library';
// Extension's library
import AbstractPopup from 'cutejs/layers/abstract-popup';
import AbstractScene from 'cutejs/layers/abstract-scene';
import InlineWidget from 'cutejs/widgets/inline-widget';
import AbstractWidget from 'cutejs/widgets/abstract-widget';

class Container extends AbstractWidget {
	constructor() {
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
	_renderTemplate(){
		return render(this._getTemplateData(), this._getTemplateOptions());
	}
}
```
