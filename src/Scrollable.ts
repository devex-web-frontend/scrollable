/// <reference path="./typings/typings.d.ts"/>

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

export enum EVENT_SCROLLABLE {
	UPDATE = <any>'UPDATE'
}

interface IScrollableInitPayload {
	detail: {
		block: HTMLElement;
		eventTarget: HTMLElement;
		elementContent: HTMLElement;
	};
}

import './Scrollable.styl';

/**
 * Scrollable control
 */
export class Scrollable extends Emitter {
	////////////
	// FIELDS //
	////////////
	private _container:HTMLElement;
	private _scrollable:HTMLElement;
	private _wrapper:HTMLElement;
	private _content:HTMLElement;
	private _contentResizeDetector:HTMLIFrameElement;
	private _scrollableResizeDetector:HTMLIFrameElement;
	private _verticalScrollbar:AbstractScrollbar;
	private _horizontalScrollbar:AbstractScrollbar;
	private _isDetached:boolean = false;
	private _isInitialized:boolean = false;

	////////////////
	// CONTRUCTOR //
	////////////////

	constructor(container:HTMLElement) {
		super();
		this._container = container;
	}

	////////////
	// PUBLIC //
	////////////

	public init():Promise<IScrollableInitPayload|Error> {
		if (this._isInitialized) {
			return Promise.reject<Error>(new Error('Cannot initialize Scrollable twice'));
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

	public notifyDetaching():void {
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

	public notifyAttached():Promise<void> {
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
	private _render():Promise<any> {
		this._wrapper = dom.createElement('div', {
			className: CN_SCROLLABLE__WRAPPER
		}) as HTMLElement;

		this._scrollable = dom.createElement('div', {
			className: [CN_SCROLLABLE, this._container.className]
		}) as HTMLElement;

		this._content = dom.createElement('div', {
			className: CN_SCROLLABLE__CONTENT
		}) as HTMLElement;

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

	private _renderScrollbars() {
		this._verticalScrollbar = new VerticalScrollbar(this._scrollable, this._wrapper, this._container);
		this._horizontalScrollbar = new HorizontalScrollbar(this._scrollable, this._wrapper, this._container);
	}

	private _renderResizeDetectors():Promise<any> {
		return Promise.all([
			//the point here is to wait for initial resize event of created iframe and then continue initialization
			new Promise((resolve, reject) => {
				this._contentResizeDetector = dom.createElement('iframe', {
					className: CN_SCROLLABLE_RESIZEDETECTOR,
					src: 'about:blank'
				}) as HTMLIFrameElement;
				const onFirstResize:EventListener = e => {
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
				}) as HTMLIFrameElement;
				const onFirstResize:EventListener = e => {
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

	protected _onResize:EventListener = e => {
		this._verticalScrollbar.update();
		this._horizontalScrollbar.update();
		this._emit(EVENT_SCROLLABLE.UPDATE);
	}

	////////////
	// STATIC //
	////////////

	public static create(container:HTMLElement):Promise<IScrollableInitPayload> {
		return new Scrollable(container).init();
	}
}