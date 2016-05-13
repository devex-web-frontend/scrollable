import bem from 'dx-util/src/bem/bem.js';
import dom from 'dxjs/src/dx.dom.js';
import Emitter from 'dx-util/src/emitter/Emitter.ts';

import {HorizontalScrollbar} from './HorizontalScrollbar';
import {VerticalScrollbar} from './VerticalScrollbar';
import {AbstractScrollbar} from './AbstractScrollbar';

import {
	CN_SCROLLABLE,
	CN_SCROLLABLE__WRAPPER,
	CN_SCROLLABLE__CONTAINER,
	CN_SCROLLABLE__CONTENT,
	CN_SCROLLABLE_RESIZEDETECTOR
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
	_isInitialized = false;

	////////////////
	// CONTRUCTOR //
	////////////////

	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		super();
		this._container = container;
	}

	////////////
	// PUBLIC //
	////////////

	/**
	 * @returns {Promise<TScrollableInitPayload|Error>}
	 */
	init() {
		if (this._isInitialized) {
			return Promise.reject(new Error('Cannot initialize Scrollable twice'));
		}
		this._isInitialized = true;
		return this._render().then(() => {
			this._verticalScrollbar.update();
			this._horizontalScrollbar.update();
			return {
				detail: {
					block: this._scrollable,
					eventTarget: this._container,
					elementContent: this._content
				}
			};
		});
	}

	notifyDetaching() {
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
		if (this._isDetached) {
			this._isDetached = false;
			return this._renderResizeDetectors().then(() => {
				this._verticalScrollbar.update();
				this._horizontalScrollbar.update();
			});
		} else {
			return Promise.resolve();
		}
	}

	/////////////
	// PRIVATE //
	/////////////
	/**
	 * @returns {Promise.<any>}
	 * @private
	 */
	_render() {
		this._wrapper = dom.createElement('div', {
			className: CN_SCROLLABLE__WRAPPER
		});

		this._scrollable = dom.createElement('div', {
			className: [CN_SCROLLABLE, this._container.className]
		});

		this._content = dom.createElement('div', {
			className: CN_SCROLLABLE__CONTENT
		});

		//inline max height
		const scrollableMaxHeight = window.getComputedStyle(this._scrollable).getPropertyValue('max-height');
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
		return this._renderResizeDetectors();
	}

	/**
	 * @private
	 */
	_renderScrollbars() {
		this._verticalScrollbar = new VerticalScrollbar(this._scrollable, this._wrapper, this._container);
		this._horizontalScrollbar = new HorizontalScrollbar(this._scrollable, this._wrapper, this._container);
	}

	/**
	 * @returns {Promise<any>}
	 * @private
	 */
	_renderResizeDetectors() {
		return Promise.all([
			//the point here is to wait for initial resize event of created iframe and then continue initialization
			new Promise((resolve, reject) => {
				this._contentResizeDetector = dom.createElement('iframe', {
					className: CN_SCROLLABLE_RESIZEDETECTOR,
					src: 'about:blank'
				});
				/**
				 * @param {Event} e
				 */
				const onFirstResize = e => {
					this._contentResizeDetector.contentWindow.removeEventListener('resize', onFirstResize);
					this._contentResizeDetector.contentWindow.addEventListener('resize', this._onResize);
					resolve();
				};
				this._scrollable.appendChild(this._contentResizeDetector);
				if (!this._contentResizeDetector.contentWindow) {
					throw new Error('' +
						'Cannot find contentWindow!' +
						'Probably Scrollable#init is called before attaching to DOM'
					);
				}
				this._contentResizeDetector.contentWindow.addEventListener('resize', onFirstResize);
			}),

			new Promise((resolve, reject) => {
				this._scrollableResizeDetector = dom.createElement('iframe', {
					className: CN_SCROLLABLE_RESIZEDETECTOR,
					src: 'about:blank'
				});
				/**
				 * @param {Event} e
				 */
				const onFirstResize = e => {
					this._scrollableResizeDetector.contentWindow.removeEventListener('resize', onFirstResize);
					this._scrollableResizeDetector.contentWindow.addEventListener('resize', this._onResize);
					resolve();
				};
				this._content.appendChild(this._scrollableResizeDetector);
				if (!this._scrollableResizeDetector.contentWindow) {
					throw new Error('' +
						'Cannot find contentWindow!' +
						'Probably Scrollable#init is called before attaching to DOM'
					);
				}
				this._scrollableResizeDetector.contentWindow.addEventListener('resize', onFirstResize);
			})
		]);
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