import {AbstractScrollbar, BUTTON_SCROLL_STEP} from './AbstractScrollbar';
import {modifier} from 'dx-util/src/bem/bem.js';
import {CN_SCROLLBAR, IScrollbarRatio} from './AbstractScrollbar';
import {CN_WITHVERTICALSCROLLBAR} from './Scrollable.constants';
const MOD_VERTICAL = 'vertical';

export class VerticalScrollbar extends AbstractScrollbar {
	////////////
	// PUBLIC //
	////////////

	/////////////
	// PRIVATE //
	/////////////

	private _isVisible:boolean = false;
	private _previousDragCoordinate:number;

	///////////////
	// PROTECTED //
	///////////////

	protected _updateBar() {
		//size
		const visibleHeight = this._container.clientHeight;
		const barHeight = Math.ceil(visibleHeight * this._ratio.size);
		this._bar.style.height = `${barHeight}px`;

		//position
		const scrollTop = this._container.scrollTop;
		const barPositionTop = Math.floor(scrollTop * this._ratio.position);
		this._bar.style.top = `${barPositionTop}px`;
	}

	protected _getMinBarSize():number {
		return parseFloat(window.getComputedStyle(this._bar).getPropertyPriority('min-height'));
	}

	protected _getRatio():IScrollbarRatio {
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

	protected _toggle(bounds:ClientRect) {
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

	protected _render() {
		super._render();
		this._scrollbar.classList.add(modifier(CN_SCROLLBAR, [MOD_VERTICAL]));

		//hide native scrollbar
		this._container.style.marginRight = -AbstractScrollbar.size.width + 'px';
		this._container.style.width = 'calc(100% + ' + AbstractScrollbar.size.width + 'px)';
	}

	////////////////////////
	// DOM EVENT HANDLERS //
	////////////////////////

	protected _onTrackMouseWheel(e:WheelEvent) {
		this._container.scrollTop += (e.deltaY * 10 || e.detail * 10 || (e.wheelDelta * -1));
	}

	protected _onButtonForwardClick(e:Event) {
		this._container.scrollTop += BUTTON_SCROLL_STEP;
	}

	protected _onButtonBackwardClick(e:Event) {
		this._container.scrollTop -= BUTTON_SCROLL_STEP;
	}

	protected _onButtonToStartClick(e:Event) {
		this._container.scrollTop = 0;
	}

	protected _onButtonToEndClick(e:Event) {
		this._container.scrollTop = this._container.scrollHeight;
	}

	protected _onTrackClick(e:MouseEvent) {
		const trackPosition = this._track.getBoundingClientRect().top +
			window.pageYOffset -
			document.documentElement.clientTop;
		this._container.scrollTop = Math.floor((e.clientY - trackPosition) / this._ratio.position);
	}

	protected _onBarDragStart(e:MouseEvent) {
		this._previousDragCoordinate = e.clientY;
	}

	protected _onBarDrag(e:MouseEvent) {
		const delta = this._previousDragCoordinate - e.clientY;
		this._previousDragCoordinate = e.clientY;
		this._container.scrollTop -= delta / this._ratio.position;
	}
}