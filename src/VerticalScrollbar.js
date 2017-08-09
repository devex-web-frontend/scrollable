import {AbstractScrollbar, BUTTON_SCROLL_STEP, CN_SCROLLBAR} from './AbstractScrollbar';
import {modifier} from 'dx-util/src/bem/bem.js';
import {CN_WITHVERTICALSCROLLBAR} from './Scrollable.constants';
const MOD_VERTICAL = 'vertical';

/**
 * @class VerticalScrollbar
 * @extends AbstractScrollbar
 */
export class VerticalScrollbar extends AbstractScrollbar {
	////////////
	// PUBLIC //
	////////////

	/////////////
	// PRIVATE //
	/////////////

	/**
	 * @type {boolean}
	 * @private
	 */
	_isVisible = false;
	/**
	 * @type {number}
	 */
	_previousDragCoordinate;

	///////////////
	// PROTECTED //
	///////////////

	/**
	 * @protected
	 */
	_updateBar() {
		//size
		const visibleHeight = this._container.clientHeight;
		const barHeight = Math.ceil(visibleHeight * this._ratio.size);
		this._bar.style.height = `${barHeight}px`;

		//position
		const scrollTop = this._container.scrollTop;
		const barPositionTop = Math.floor(scrollTop * this._ratio.position);
		this._bar.style.top = `${barPositionTop}px`;
	}

	/**
	 * @returns {number}
	 * @protected
	 */
	_getMinBarSize() {
		return parseFloat(window.getComputedStyle(this._bar).getPropertyPriority('min-height'));
	}

	/**
	 * @returns {TScrollbarRatio}
	 * @protected
	 */
	_getRatio() {
		const scrollSize = this._container.scrollHeight;
		const containerSize = this._container.clientHeight;
		const trackSize = this._scrollbar.offsetHeight;
		const sizeRatio = trackSize / scrollSize;
		const possibleBarSize = containerSize * sizeRatio;
		const barSize = possibleBarSize < this._minBarSize ? this._minBarSize : possibleBarSize;
		const hiddenContentAreaSize = scrollSize - containerSize;
		const hiddenTrackAreaSize = trackSize - barSize;
		const posRatio = hiddenTrackAreaSize / hiddenContentAreaSize;

		return {
			size: sizeRatio,
			position: posRatio
		};
	}

	/**
	 * @param {ClientRect} bounds
	 * @protected
	 */
	_toggle(bounds) {
		const height = Math.round(bounds.height);
		const scrollHeight = this._container.scrollHeight;
		if (scrollHeight > height) {
			if (!this._isVisible) {
				this._scrollable.classList.add(CN_WITHVERTICALSCROLLBAR);
				this._isVisible = true;
			}
		} else {
			if (this._isVisible) {
				this._scrollable.classList.remove(CN_WITHVERTICALSCROLLBAR);
				this._isVisible = false;
			}
		}
	}

	/**
	 * @private
	 */
	_render() {
		super._render();
		this._scrollbar.classList.add(modifier(CN_SCROLLBAR, MOD_VERTICAL));

		//hide native scrollbar
		this._container.style.marginRight = `${-AbstractScrollbar.size.width}px`;
		this._container.style.width = `calc(100% + ${AbstractScrollbar.size.width}px)`;
	}

	////////////////////////
	// DOM EVENT HANDLERS //
	////////////////////////

	/**
	 * @param {WheelEvent} e
	 * @protected
	 */
	_onTrackMouseWheel(e) {
		this._container.scrollTop += (e.deltaY * 10 || e['detail'] * 10 || e['wheelDelta'] * -1);
	}

	/**
	 * @param {Event} e
	 * @protected
	 */
	_onButtonForwardClick(e) {
		this._container.scrollTop += BUTTON_SCROLL_STEP;
	}

	/**
	 * @param {Event} e
	 * @protected
	 */
	_onButtonBackwardClick(e) {
		this._container.scrollTop -= BUTTON_SCROLL_STEP;
	}

	/**
	 * @param {Event} e
	 * @protected
	 */
	_onButtonToStartClick(e) {
		this._container.scrollTop = 0;
	}

	/**
	 * @param {Event} e
	 * @protected
	 */
	_onButtonToEndClick(e) {
		this._container.scrollTop = this._container.scrollHeight;
	}

	/**
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onTrackClick(e) {
		const trackPosition = this._track.getBoundingClientRect().top +
			window.pageYOffset -
			document.documentElement.clientTop;
		this._container.scrollTop = Math.floor((e.clientY - trackPosition) / this._ratio.position);
	}

	/**
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onBarDragStart(e) {
		this._previousDragCoordinate = e.clientY;
	}

	/**
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onBarDrag(e) {
		const delta = this._previousDragCoordinate - e.clientY;
		this._previousDragCoordinate = e.clientY;
		this._container.scrollTop -= delta / this._ratio.position;
	}
}