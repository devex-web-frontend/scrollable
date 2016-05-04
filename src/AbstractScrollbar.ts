/// <reference path="./typings/typings.d.ts"/>

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

interface IScrollbarSize {
	width:number;
	height:number;
}

export interface IScrollbarRatio {
	size: number;
	position: number;
}

export const BUTTON_SCROLL_STEP = 20;

/**
 * AbstractScrollbar
 */
export abstract class AbstractScrollbar {
	////////////
	// FIELDS //
	////////////

	protected _scrollable:HTMLElement;
	protected _container:HTMLElement;
	protected _scrollbar:HTMLElement;
	protected _bar:HTMLElement;
	protected _track:HTMLElement;
	protected _ratio:IScrollbarRatio;
	protected _minBarSize:number;

	private _wrapper:HTMLElement;
	private _buttonToEnd:HTMLButtonElement;
	private _buttonToStart:HTMLButtonElement;
	private _buttonForward:HTMLButtonElement;
	private _buttonBackward:HTMLButtonElement;

	////////////////
	// CONTRUCTOR //
	////////////////

	/**
	 * @param scrollable - main scrollable element (usually .scrollable)
	 * @param wrapper - container for scrollbars (usually .scrollable--wrapper)
	 * @param container - element that should be scrolled actually (usually .scrollable--container)
	 */
	public constructor(scrollable:HTMLElement, wrapper:HTMLElement, container:HTMLElement) {
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
	public update() {
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

	protected abstract _toggle(bounds:ClientRect):void;

	protected abstract _getMinBarSize():number;

	protected abstract _getRatio():IScrollbarRatio;

	protected abstract _updateBar():void;

	protected _render() {
		//bar
		this._bar = dom.createElement('div', {
			className: CN_SCROLLBAR__BAR
		}) as HTMLElement;
		this._bar.addEventListener('mousedown', this._onBarMouseDown);
		this._bar.addEventListener('click', this._onBarClick);

		//track
		this._track = dom.createElement('div', {
			className: CN_SCROLLBAR__TRACK
		}) as HTMLElement;
		this._track.appendChild(this._bar);
		this._track.addEventListener(getMouseWheelEventName(), e => this._onTrackMouseWheel(e as WheelEvent), true);
		this._track.addEventListener('click', e => this._onTrackClick(e));

		//button to start
		this._buttonToStart = dom.createElement('button', {
			className: CN_SCROLLBAR__BUTTON_TOSTART
		})  as HTMLButtonElement;
		this._buttonToStart.addEventListener('click', e => this._onButtonToStartClick(e));

		//button to end
		this._buttonToEnd = dom.createElement('button', {
			className: CN_SCROLLBAR__BUTTON_TOEND
		}) as HTMLButtonElement;
		this._buttonToEnd.addEventListener('click', e => this._onButtonToEndClick(e));

		//button forward
		this._buttonForward = dom.createElement('button', {
			className: CN_SCROLLBAR__BUTTON_FORWARD
		}) as HTMLButtonElement;
		this._buttonForward.addEventListener('click', e => this._onButtonForwardClick(e));

		//button backward
		this._buttonBackward = dom.createElement('button', {
			className: CN_SCROLLBAR__BUTTON_BACKWARD
		}) as HTMLButtonElement;
		this._buttonBackward.addEventListener('click', e => this._onButtonBackwardClick(e));

		//scrollbar
		this._scrollbar = dom.createElement('div', {
			className: CN_SCROLLBAR
		})  as HTMLElement;
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

	protected abstract _onTrackMouseWheel(e:WheelEvent):void;

	protected abstract _onTrackClick(e:MouseEvent):void;

	protected abstract _onButtonForwardClick(e:Event):void;

	protected abstract _onButtonBackwardClick(e:Event):void;

	protected abstract _onButtonToStartClick(e:Event):void;

	protected abstract _onButtonToEndClick(e:Event):void;

	protected abstract _onBarDragStart(e:MouseEvent):void;

	protected abstract _onBarDrag(e:MouseEvent):void;

	////////////////////////
	// DOM EVENT HANDLERS //
	////////////////////////

	private _onContainerScroll:EventListener = e => {
		this._updateBar();
	}

	protected _onBarClick = (e:MouseEvent) => {
		e.stopPropagation();
	}

	protected _onBarMouseDown = (e:MouseEvent) => {
		this._onBarDragStart(e);

		document.addEventListener('mousemove', this._onDocumentMouseMove);
		document.addEventListener('mouseup', this._onDocumentMouseUp);
		document.addEventListener('selectstart', this._onDocumentSelectStart);
	}

	private _onDocumentMouseMove = (e:MouseEvent) => {
		this._onBarDrag(e);
	}

	private _onDocumentMouseUp = (e:MouseEvent) => {
		document.removeEventListener('selectstart', this._onDocumentSelectStart);
		document.removeEventListener('mouseup', this._onDocumentMouseUp);
		document.removeEventListener('mousemove', this._onDocumentMouseMove);
		this._onBarDrag(e);
	}

	private _onDocumentSelectStart = (e:Event) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	////////////
	// STATIC //
	////////////

	private static _size:IScrollbarSize;
	public static get size():IScrollbarSize {
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
function getMouseWheelEventName():string {
	if ('onmousewheel' in document.documentElement) {
		return 'mousewheel';
	} else if ('DOMMouseScroll' in document.documentElement) {
		return 'DOMMouseScroll';
	} else if ('onwheel' in document.documentElement) {
		return 'wheel';
	}
}