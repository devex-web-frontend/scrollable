import bem from 'dx-util/src/bem/bem.js';
import dom from 'dxjs/src/dx.dom.js';
import Emitter from 'dx-util/src/emitter/Emitter';

import {HorizontalScrollbar} from './HorizontalScrollbar';
import {VerticalScrollbar} from './VerticalScrollbar';
import {AbstractScrollbar} from './AbstractScrollbar';

import {
	CN_SCROLLABLE,
	CN_SCROLLABLE__WRAPPER,
	CN_SCROLLABLE__CONTAINER,
	CN_SCROLLABLE__CONTENT,
	CN_SCROLLABLE_RESIZEDETECTOR,
	CN_WITHVERTICALSCROLLBAR,
	CN_WITHHORIZONTALSCROLLBAR
} from './Scrollable.constants';

/**
 * @enum {String} EVENT_SCROLLABLE
 */
export const EVENT_SCROLLABLE = {
	UPDATE: 'UPDATE'
};

/**
 * @typedef {Object} TScrollableInitPayloadDetail
 * @property {HTMLElement} block
 * @property {HTMLElement} eventTarget
 * @property {HTMLElement} elementContent
 */

/**
 * @typedef {Object} TScrollableInitPayload
 * @property {TScrollableInitPayload} detail
 */

import './Scrollable.styl';

/**
 * Scrollable control
 * @class Scrollable
 * @extends Emitter
 */
export class Scrollable extends Emitter {
	////////////
	// FIELDS //
	////////////
	/**
	 * @type {HTMLElement}
	 * @private
	 */
	_container;
	/**
	 * @type {HTMLElement}
	 * @private
	 */
	_scrollable;
	/**
	 * @type {HTMLElement}
	 * @private
	 */
	_wrapper;
	/**
	 * @type {HTMLElement}
	 * @private
	 */
	_content;
	/**
	 * @type {HTMLIFrameElement}
	 * @private
	 */
	_contentResizeDetector;
	/**
	 * @type {HTMLIFrameElement}
	 * @private
	 */
	_scrollableResizeDetector;
	/**
	 * @type {AbstractScrollbar}
	 * @private
	 */
	_verticalScrollbar;
	/**
	 * @type {AbstractScrollbar}
	 * @private
	 */
	_horizontalScrollbar;
	/**
	 * @type {boolean}
	 * @private
	 */
	_isDetached = false;
	/**
	 * @type {boolean}
	 * @private
	 */
	_isClosed = false;

	/**
	 * @type {String}
	 * @private
	 */
	_originalClassName = '';

	/**
	 * @private
	 * @type {Object}
	 */
	_result;

	/**
	 * @returns {Object}
	 */
	get result() {
		return this._result;
	}

	////////////////
	// CONTRUCTOR //
	////////////////

	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		super();
		this._container = container;

		this._render();
		this._verticalScrollbar.update();
		this._horizontalScrollbar.update();

		this._result = {
			detail: {
				block: this._scrollable,
				eventTarget: this._container,
				elementContent: this._content
			}
		};
	}

	////////////
	// PUBLIC //
	////////////

	/**
	 * @returns {Promise<TScrollableInitPayload|Error>}
	 */
	init() {
		console.warn(
			'DEPRECATION: ' +
			'Scrollable initialization is not async anymore. Use scrollable.result instance value instead of ' +
			'Scrollable.create and Scrollable#init methods.'
		);
		return Promise.resolve(this.result);
	}

	notifyDetaching() {
		if (this._isClosed) {
			throw new Error('Scrollable is closed');
		}
		if (!this._isDetached) {
			if (!this._contentResizeDetector.contentWindow || !this._scrollableResizeDetector.contentWindow) {
				throw new Error(
					'Cannot find contentWindows! ' +
					'Probably Scrollable#notifyDetaching is called after detaching from DOM'
				);
			}
			this._contentResizeDetector.contentWindow.removeEventListener('resize', this._onResize);
			this._scrollable.removeChild(this._contentResizeDetector);
			delete this['_contentResizeDetector'];
			this._scrollableResizeDetector.contentDocument.removeEventListener('resize', this._onResize);
			this._content.removeChild(this._scrollableResizeDetector);
			delete this['_scrollableResizeDetector'];
			this._isDetached = true;
		}
	}

	/**
	 * @returns {Promise<void>}
	 */
	notifyAttached() {
		if (this._isClosed) {
			throw new Error('Scrollable is closed');
		}
		if (this._isDetached) {
			this._isDetached = false;
			this._renderResizeDetectors();
			this._verticalScrollbar.update();
			this._horizontalScrollbar.update();
		}
		return Object.assign(Promise.resolve(), {
			then: function(cb) {
				console.warn('DEPRECATION: Scrollable#notifyAttached is sync. Do not use it as Promise.');
				cb();
			}
		});
	}

	/**
	 * Completely closes view and cleans DOM
	 */
	close() {
		if (this._isClosed) {
			throw new Error('Scrollable is already closed');
		}
		if (this._isDetached) {
			throw new Error('Cannot close detached scrollable because parentElement is not accessible to restore ' +
				'default dom structure');
		}
		//dispose resize detectors
		this._contentResizeDetector.contentWindow.removeEventListener('resize', this._onResize);
		this._scrollableResizeDetector.contentWindow.removeEventListener('resize', this._onResize);
		this._scrollable.removeChild(this._contentResizeDetector);
		this._content.removeChild(this._scrollableResizeDetector);

		//dispose scrollbars
		this._horizontalScrollbar.close();
		this._verticalScrollbar.close();

		//clear default structure
		this._container.className = this._originalClassName;
		this._container.removeChild(this._content);
		this._scrollable.removeChild(this._wrapper);
		this._wrapper.removeChild(this._container);
		this._scrollable.parentElement.insertBefore(this._container, this._scrollable);
		this._scrollable.parentElement.removeChild(this._scrollable);

		//move nodes from content to container
		Array.from(this._content.children).forEach(child => this._container.appendChild(child));

		//remove inlined styles
		this._container.style.maxHeight = null;
		this._container.style.marginRight = null;
		this._container.style.marginBottom = null;
		this._container.style.width = null;
		this._container.style.height = null;

		delete this['_contentResizeDetector'];
		delete this['_scrollableResizeDetector'];
		delete this['_verticalScrollbar'];
		delete this['_horizontalScrollbar'];
		delete this['_container'];
		delete this['_scrollable'];
		delete this['_wrapper'];
		delete this['_content'];

		this._isClosed = true;
	}

	/////////////
	// PRIVATE //
	/////////////
	/**
	 * @private
	 */
	_render() {
		this._wrapper = dom.createElement('div', {
			className: CN_SCROLLABLE__WRAPPER
		});

		this._originalClassName = this._container.className || '';

		this._scrollable = dom.createElement('div', {
			className: [CN_SCROLLABLE, this._originalClassName]
		});

		this._content = dom.createElement('div', {
			className: CN_SCROLLABLE__CONTENT
		});

		//inline max height
		const scrollableMaxHeight = window.getComputedStyle(this._container).getPropertyValue('max-height');
		if (scrollableMaxHeight !== 'none') {
			this._container.style.maxHeight = `${parseFloat(scrollableMaxHeight) + AbstractScrollbar.size.height}px`;
		}

		//move nodes from container to content
		Array.from(this._container.children).forEach(child => this._content.appendChild(child));

		//render default structure
		this._container.parentElement.insertBefore(this._scrollable, this._container);
		this._wrapper.appendChild(this._container);
		this._scrollable.appendChild(this._wrapper);
		this._container.appendChild(this._content);
		this._container.className = CN_SCROLLABLE__CONTAINER;

		//finally render scrollbars
		this._renderScrollbars();

		//render resize detectors
		this._renderResizeDetectors();
	}

	/**
	 * @private
	 */
	_renderScrollbars() {
		this._verticalScrollbar = new VerticalScrollbar(this._scrollable, this._wrapper, this._container);
		this._horizontalScrollbar = new HorizontalScrollbar(this._scrollable, this._wrapper, this._container);
	}

	/**
	 * @private
	 */
	_renderResizeDetectors() {
		this._contentResizeDetector = dom.createElement('iframe', {
			className: CN_SCROLLABLE_RESIZEDETECTOR,
			src: generateIframeSource()
		});
		this._scrollable.appendChild(this._contentResizeDetector);
		this._contentResizeDetector.contentWindow.addEventListener('resize', this._onResize);

		this._scrollableResizeDetector = dom.createElement('iframe', {
			className: CN_SCROLLABLE_RESIZEDETECTOR,
			src: generateIframeSource()
		});
		this._content.appendChild(this._scrollableResizeDetector);
		this._scrollableResizeDetector.contentWindow.addEventListener('resize', this._onResize);
	}

	////////////////////////
	// DOM EVENT HANDLERS //
	////////////////////////

	/**
	 * @param {Event} e
	 * @protected
	 */
	_onResize = e => {
		this._verticalScrollbar.update();
		this._horizontalScrollbar.update();
		this._emit(EVENT_SCROLLABLE.UPDATE);
	}

	////////////
	// STATIC //
	////////////

	/**
	 * @param {HTMLElement} container
	 * @returns {Promise.<TScrollableInitPayload|Error>}
	 */
	static create(container) {
		return new Scrollable(container).init();
	}
}

//http://stackoverflow.com/a/2487023/1961479
function generateIframeSource() {
	return `javascript:(function(){document.open();document.domain='${document.domain}';document.close();})()`;
}