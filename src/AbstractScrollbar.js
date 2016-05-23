import dom from 'dxjs/src/dx.dom.js';
import bem from 'dx-util/src/bem/bem.js';

export const CN_SCROLLBAR = 'scrollbar';
const CN_SCROLLBAR__BAR = bem(CN_SCROLLBAR, 'bar');
const CN_SCROLLBAR__TRACK = bem(CN_SCROLLBAR, 'track');
const CN_SCROLLBAR__BUTTON = bem(CN_SCROLLBAR, 'button');
const CN_SCROLLBAR__BUTTON_FORWARD = bem(CN_SCROLLBAR__BUTTON, ['forward']);
const CN_SCROLLBAR__BUTTON_BACKWARD = bem(CN_SCROLLBAR__BUTTON, ['backward']);
const CN_SCROLLBAR__BUTTON_TOEND = bem(CN_SCROLLBAR__BUTTON, ['extreme', 'toEnd']);
const CN_SCROLLBAR__BUTTON_TOSTART = bem(CN_SCROLLBAR__BUTTON, ['extreme', 'toStart']);

/**
 * @typedef {Object} TScrollbarSize
 * @property {Number} width
 * @property {Number} height
 */

/**
 * @typedef {Object} TScrollbarRatio
 * @property {number} size
 * @property {number} position
 */

export const BUTTON_SCROLL_STEP = 20;

import './Scrollbar.styl';

/**
 * @class AbstractScrollbar
 * @abstract
 */
export class AbstractScrollbar {
	////////////
	// FIELDS //
	////////////

	/**
	 * @protected
	 * @type {HTMLElement}
	 */
	_scrollable;
	/**
	 * @protected
	 * @type {HTMLElement}
	 */
	_container;
	/**
	 * @protected
	 * @type {HTMLElement}
	 */
	_scrollbar;
	/**
	 * @protected
	 * @type {HTMLElement}
	 */
	_bar;
	/**
	 * @protected
	 * @type {HTMLElement}
	 */
	_track;
	/**
	 * @protected
	 * @type {TScrollbarRatio}
	 */
	_ratio;
	/**
	 * @protected
	 * @type {number}
	 */
	_minBarSize;

	/**
	 * @protected
	 * @type {HTMLElement}
	 */
	_wrapper;
	/**
	 * @protected
	 * @type {HTMLButtonElement}
	 */
	_buttonToEnd;
	/**
	 * @protected
	 * @type {HTMLButtonElement}
	 */
	_buttonToStart;
	/**
	 * @protected
	 * @type {HTMLButtonElement}
	 */
	_buttonForward;
	/**
	 * @protected
	 * @type {HTMLButtonElement}
	 */
	_buttonBackward;

	////////////////
	// CONTRUCTOR //
	////////////////

	/**
	 * @param {HTMLElement} scrollable - main scrollable element (usually .scrollable)
	 * @param {HTMLElement} wrapper - container for scrollbars (usually .scrollable--wrapper)
	 * @param {HTMLElement} container - element that should be scrolled actually (usually .scrollable--container)
	 */
	constructor(scrollable, wrapper, container) {
		this._scrollable = scrollable;
		this._container = container;
		this._wrapper = wrapper;
		this._render();
		this._wrapper.appendChild(this._scrollbar);
	}

	////////////
	// PUBLIC //
	////////////

	/**
	 * Updates scrollbar: visibility, ratio, size, position etc.
	 */
	update() {
		this._toggle(this._container.getBoundingClientRect());
		this._ratio = this._getRatio();
		this._updateBar();
	}

	/////////////
	// PRIVATE //
	/////////////

	///////////////
	// PROTECTED //
	///////////////

	/**
	 * @abstract
	 * @param {ClientRect} bounds
	 * @protected
	 */
	_toggle(bounds) {
	}

	//noinspection Eslint
	/**
	 * @abstract
	 * @protected
	 * @returns {number}
	 */
	_getMinBarSize() {
	}

	//noinspection Eslint
	/**
	 * @abstract
	 * @protected
	 * @returns {TScrollbarRatio}
	 */
	_getRatio() {
	}

	/**
	 * @abstract
	 * @protected
	 */
	_updateBar() {
	}

	/**
	 * @protected
	 */
	_render() {
		//bar
		this._bar = dom.createElement('div', {
			className: CN_SCROLLBAR__BAR
		});
		this._bar.addEventListener('mousedown', this._onBarMouseDown);
		this._bar.addEventListener('click', this._onBarClick);

		//track
		this._track = dom.createElement('div', {
			className: CN_SCROLLBAR__TRACK
		});
		this._track.appendChild(this._bar);
		this._track.addEventListener(getMouseWheelEventName(), e => this._onTrackMouseWheel(e), true);
		this._track.addEventListener('click', e => this._onTrackClick(e));

		//button to start
		this._buttonToStart = dom.createElement('button', {
			className: CN_SCROLLBAR__BUTTON_TOSTART
		});
		this._buttonToStart.addEventListener('click', e => this._onButtonToStartClick(e));

		//button to end
		this._buttonToEnd = dom.createElement('button', {
			className: CN_SCROLLBAR__BUTTON_TOEND
		});
		this._buttonToEnd.addEventListener('click', e => this._onButtonToEndClick(e));

		//button forward
		this._buttonForward = dom.createElement('button', {
			className: CN_SCROLLBAR__BUTTON_FORWARD
		});
		this._buttonForward.addEventListener('click', e => this._onButtonForwardClick(e));

		//button backward
		this._buttonBackward = dom.createElement('button', {
			className: CN_SCROLLBAR__BUTTON_BACKWARD
		});
		this._buttonBackward.addEventListener('click', e => this._onButtonBackwardClick(e));

		//scrollbar
		this._scrollbar = dom.createElement('div', {
			className: CN_SCROLLBAR
		});
		this._scrollbar.appendChild(this._buttonToStart);
		this._scrollbar.appendChild(this._buttonBackward);
		this._scrollbar.appendChild(this._track);
		this._scrollbar.appendChild(this._buttonForward);
		this._scrollbar.appendChild(this._buttonToEnd);

		this._container.addEventListener('scroll', this._onContainerScroll);
	}

	/////////////////////////////////
	// ABSTRACT DOM EVENT HANDLERS //
	/////////////////////////////////

	/**
	 * @abstract
	 * @param {WheelEvent} e
	 * @protected
	 */
	_onTrackMouseWheel(e) {
	};

	/**
	 * @abstract
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onTrackClick(e) {
	};

	/**
	 * @abstract
	 * @param {Event} e
	 * @protected
	 */
	_onButtonForwardClick(e) {
	};

	/**
	 * @abstract
	 * @param {Event} e
	 * @protected
	 */
	_onButtonBackwardClick(e) {
	};

	/**
	 * @abstract
	 * @param {Event} e
	 * @protected
	 */
	_onButtonToStartClick(e) {
	};

	/**
	 * @abstract
	 * @param {Event} e
	 * @protected
	 */
	_onButtonToEndClick(e) {
	};

	/**
	 * @abstract
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onBarDragStart(e) {
	};

	/**
	 * @abstract
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onBarDrag(e) {
	};

	////////////////////////
	// DOM EVENT HANDLERS //
	////////////////////////

	/**
	 * @param {Event} e
	 * @private
	 */
	_onContainerScroll = e => {
		this._updateBar();
	}

	/**
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onBarClick = (e) => {
		e.stopPropagation();
	}

	/**
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onBarMouseDown = (e) => {
		this._onBarDragStart(e);

		document.addEventListener('mousemove', this._onDocumentMouseMove);
		document.addEventListener('mouseup', this._onDocumentMouseUp);
		document.addEventListener('selectstart', this._onDocumentSelectStart);
	}

	/**
	 * @param {MouseEvent} e
	 * @private
	 */
	_onDocumentMouseMove = (e) => {
		this._onBarDrag(e);
	}

	/**
	 * @param {MouseEvent} e
	 * @private
	 */
	_onDocumentMouseUp = (e) => {
		document.removeEventListener('selectstart', this._onDocumentSelectStart);
		document.removeEventListener('mouseup', this._onDocumentMouseUp);
		document.removeEventListener('mousemove', this._onDocumentMouseMove);
		this._onBarDrag(e);
	}

	/**
	 * @param {Event} e
	 * @returns {boolean}
	 * @private
	 */
	_onDocumentSelectStart = (e) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	////////////
	// STATIC //
	////////////

	/**
	 * @type {TScrollbarSize}
	 * @private
	 */
	static _size;
	/**
	 * size
	 * @returns {TScrollbarSize}
	 */
	static get size() {
		if (!AbstractScrollbar._size) {
			const dummy = document.createElement('div');
			dummy.style.width = '100px';
			dummy.style.height = '100px';
			dummy.style.position = 'absolute';
			dummy.style.top = '-200%';
			dummy.style.left = '-200%';
			dummy.style.overflow = 'scroll';
			dummy.style.opacity = '0';

			document.body.appendChild(dummy);
			AbstractScrollbar._size = {
				width: dummy.offsetWidth - dummy.clientWidth,
				height: dummy.offsetHeight - dummy.clientHeight
			};
			document.body.removeChild(dummy);
		}
		return AbstractScrollbar._size;
	}
}

/**
 * Gets supported mouse wheel event name
 * @returns {string}
 */
function getMouseWheelEventName() {
	if ('onmousewheel' in document.documentElement) {
		return 'mousewheel';
	} else if ('DOMMouseScroll' in document.documentElement) {
		return 'DOMMouseScroll';
	} else if ('onwheel' in document.documentElement) {
		return 'wheel';
	}
}