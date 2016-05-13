import {AbstractScrollbar, BUTTON_SCROLL_STEP} from './AbstractScrollbar';
import {CN_SCROLLBAR} from './AbstractScrollbar';
import {modifier} from 'dx-util/src/bem/bem.js';
import {CN_WITHHORIZONTALSCROLLBAR} from './Scrollable.constants';

const MOD_HORIZONTAL = 'horizontal';

/**
 * @class HorizontalScrollbar
 * @extends AbstractScrollbar
 */
export class HorizontalScrollbar extends AbstractScrollbar {
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
	 * @private
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
		const visibleWidth = this._container.clientWidth;
		const barWidth = Math.ceil(visibleWidth * this._ratio.size);
		this._bar.style.width = `${barWidth}px`;

		//position
		const scrollLeft = this._container.scrollLeft;
		const barPositionLeft = Math.floor(scrollLeft * this._ratio.position);
		this._bar.style.left = `${barPositionLeft}px`;
	}

	/**
	 * @returns {Number}
	 * @protected
	 */
	_getMinBarSize() {
		return parseFloat(window.getComputedStyle(this._bar).getPropertyPriority('min-width'));
	}

	/**
	 * @returns {TScrollbarRatio}
	 * @protected
	 */
	_getRatio() {
		const scrollSize = this._container.scrollWidth;
		const containerSize = this._container.clientWidth;
		const trackSize = this._scrollbar.offsetWidth;
		const sizeRatio = trackSize / scrollSize;
		const possibleBarSize = containerSize * sizeRatio;
		const barSize = (possibleBarSize < this._minBarSize) ? this._minBarSize : possibleBarSize;
		const hiddenContentAreaSize = scrollSize - containerSize;
		const hiddenTrackAreaSize = trackSize - barSize;
		const positionRatio = hiddenTrackAreaSize / hiddenContentAreaSize;

		return {
			size: sizeRatio,
			position: positionRatio
		};
	}

	/**
	 * @param {ClientRect} bounds
	 * @protected
	 */
	_toggle(bounds) {
		const visibleWidth = Math.round(bounds.width);
		const scrollWidth = this._container.scrollWidth;
		if (scrollWidth > visibleWidth) {
			if (!this._isVisible) {
				this._scrollable.classList.add(CN_WITHHORIZONTALSCROLLBAR);
				this._isVisible = true;
			}
		} else {
			if (this._isVisible) {
				this._scrollable.classList.remove(CN_WITHHORIZONTALSCROLLBAR);
				this._isVisible = false;
			}
		}
	}

	/**
	 * @protected
	 */
	_render() {
		super._render();
		this._scrollbar.classList.add(modifier(CN_SCROLLBAR, MOD_HORIZONTAL));

		//hide native scrollbar
		this._container.style.marginBottom = -AbstractScrollbar.size.height + 'px';
		this._container.style.height = 'calc(100% + ' + AbstractScrollbar.size.height + 'px)';
	}

	////////////////////////
	// DOM EVENT HANDLERS //
	////////////////////////

	/**
	 * @param {WheelEvent} e
	 * @protected
	 */
	_onTrackMouseWheel(e) {
		this._container.scrollLeft += (e.deltaX * 10 || e.detail * 10 || (e)['wheelDeltaX'] * -1);
	}

	/**
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onTrackClick(e) {
		const trackPosition = this._track.getBoundingClientRect().left +
			window.pageXOffset -
			document.documentElement.clientLeft;
		this._container.scrollLeft = Math.floor((e.clientX - trackPosition) / this._ratio.position);
	}

	/**
	 * @param {Event} e
	 * @protected
	 */
	_onButtonForwardClick(e) {
		this._container.scrollLeft += BUTTON_SCROLL_STEP;
	}

	/**
	 * @param {Event} e
	 * @protected
	 */
	_onButtonBackwardClick(e) {
		this._container.scrollLeft -= BUTTON_SCROLL_STEP;
	}

	/**
	 * @param {Event} e
	 * @protected
	 */
	_onButtonToStartClick(e) {
		this._container.scrollLeft = 0;
	}

	/**
	 * @param {Event} e
	 * @protected
	 */
	_onButtonToEndClick(e) {
		this._container.scrollLeft = this._container.scrollWidth;
	}

	/**
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onBarDragStart(e) {
		this._previousDragCoordinate = e.clientX;
	}

	/**
	 * @param {MouseEvent} e
	 * @protected
	 */
	_onBarDrag(e) {
		const delta = this._previousDragCoordinate - e.clientX;
		this._previousDragCoordinate = e.clientX;
		this._container.scrollLeft -= delta / this._ratio.position;
	}
}