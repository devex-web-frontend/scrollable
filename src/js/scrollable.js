import DX from 'dxjs/src/index';

var dom = DX.Dom,
	measure = DX.Measure,
	CN_SCROLLABLE = 'scrollable',
	CN_WRAPPER = CN_SCROLLABLE + '--wrapper',
	CN_CONTAINER = CN_SCROLLABLE + '--container',
	CN_CONTENT = CN_SCROLLABLE + '--content',
	CN_WITH_VERTICAL_SCROLLBAR = CN_SCROLLABLE + '-withVerticalScrollbar',
	CN_WITH_HORIZONTAL_SCROLLBAR = CN_SCROLLABLE + '-withHorizontalScrollbar',
	CN_SCROLLBAR = 'scrollbar',
	CN_SCROLLBAR_VERTICAL = CN_SCROLLBAR + '-vertical',
	CN_SCROLLBAR_HORIZONTAL = CN_SCROLLBAR + '-horizontal',
	CN_BAR = CN_SCROLLBAR + '--bar',
	CN_BUTTON = CN_SCROLLBAR + '--button',
	CN_TRACK = CN_SCROLLBAR + '--track',
	CN_BUTTON_EXTREME = CN_BUTTON + '-extreme',
	CN_BUTTON_FWD = CN_BUTTON + '-forward',
	CN_BUTTON_BACK = CN_BUTTON + '-backward',
	CN_BUTTON_TO_END = CN_BUTTON + '-toEnd',
	CN_BUTTON_TO_START = CN_BUTTON + '-toStart',
	CN_RESIZE_DETECTOR = CN_SCROLLABLE + '--resizeDetector',
	SCROLL_STEP = 20,
	E_MOUSEWHEEL = (function getMouseWheelEventName() {
		var event = ('onmousewheel' in document.documentElement) ? 'mousewheel' : 'DOMMouseScroll';

		try {
			WheelEvent('wheel');
			event = 'wheel';
		} catch (e) {}

		return event;
	})(),
	ipad = /(iPad|iPhone|iPod)/g.test(navigator.userAgent),
	scrollBarsSize = (function() {
		var testElement = dom.createElement('div', {
				className: CN_CONTAINER
			}),
			verticalScrollSize,
			horizontalScrollSize,
			head = document.getElementsByTagName('head')[0];

		testElement.style.width = '100px';
		testElement.style.height = '100px';
		testElement.style.overflow = 'scroll';
		testElement.style.opacity = 0;

		document.body.appendChild(testElement);
		horizontalScrollSize = testElement.offsetHeight - testElement.clientHeight;
		verticalScrollSize = testElement.offsetWidth - testElement.clientWidth;
		document.body.removeChild(testElement);

		return {
			vertical: verticalScrollSize,
			horizontal: horizontalScrollSize
		};
	})();

export default function Scrollable(scrollableContainer) {
	var elements,
		dragStartY,
		dragStartX,
		dragMove,
		ratio,
		minBarSize = {};

	function init() {
		elements = initElements(scrollableContainer);

		initAppearance(elements);

		if (!ipad) {
			hideSystemScrollbars();
			initListeners();
			updateScrollbars();

			minBarSize = {
				x: parseFloat(getStyle(elements.scrollbarHorizontal.bar, 'min-width')),
				y: parseFloat(getStyle(elements.scrollbarVertical.bar, 'min-height'))
			};
		}
	}

	function hideSystemScrollbars() {
		var container = elements.container;

		container.style.marginRight = -scrollBarsSize.vertical + 'px';
		container.style.marginBottom = -scrollBarsSize.horizontal + 'px';
		container.style.width = 'calc(100% + ' + scrollBarsSize.vertical + 'px)';
		container.style.height = 'calc(100% + ' + scrollBarsSize.horizontal + 'px)';
	}

	function initListeners() {
		initDetectors();
		initUserInteractionListeners();
		fireCreatedEvent();
	}

	function initDetectors() {
		elements.contentResizeDetector.contentWindow.addEventListener(DX.Event.RESIZE, updateScrollbars);
		elements.scrollableResizeDetector.contentWindow.addEventListener(DX.Event.RESIZE, updateScrollbars);
		elements.container.addEventListener(DX.Event.SCROLL, updateBars);
	}

	function initUserInteractionListeners() {
		[elements.scrollbarHorizontal, elements.scrollbarVertical].forEach(function(scrollbar) {
			var track = scrollbar.track;

			track.addEventListener(E_MOUSEWHEEL, scrollbarWheelSpinningHandler, true);
			track.addEventListener(DX.Event.CLICK, scrollbarClickHandler, true);
			scrollbar.buttonFwd.addEventListener(DX.Event.CLICK, btnClickHandler, true);
			scrollbar.buttonBack.addEventListener(DX.Event.CLICK, btnClickHandler, true);
			scrollbar.buttonToEnd.addEventListener(DX.Event.CLICK, extremeBtnClickHandler, true);
			scrollbar.buttonToStart.addEventListener(DX.Event.CLICK, extremeBtnClickHandler, true);
			scrollbar.bar.addEventListener(DX.Event.MOUSE_DOWN, dragStart, true);
		});
	}

	function updateScrollbars() {
		toggleScrollbars();
		updateRatio();
		updateBars();
		fireUpdatedEvent();
	}

	function toggleScrollbars() {
		var scrollable = elements.scrollable,
			container = elements.container,
			scrollHeight = container.scrollHeight,
			scrollWidth = container.scrollWidth;
		var bounds = container.getBoundingClientRect();
		var visibleHeight = Math.round(bounds.height);
		var visibleWidth = Math.round(bounds.width);

		scrollable.classList[(scrollHeight > visibleHeight) ? 'add' : 'remove'](CN_WITH_VERTICAL_SCROLLBAR);
		scrollable.classList[(scrollWidth > visibleWidth) ? 'add' : 'remove'](CN_WITH_HORIZONTAL_SCROLLBAR);
	}

	function updateRatio() {
		ratio = {
			x: getAxisRatio('x'),
			y: getAxisRatio('y')
		};
	}

	function updateBars() {
		updateBarsSize();
		updateBarsPosition();
	}

	function fireUpdatedEvent() {
		DX.Event.trigger(elements.container, Scrollable.E_UPDATED, {});
	}

	function getAxisRatio(axis) {
		var container = elements.container,
			isHorizontal = (axis === 'x'),
			property = isHorizontal ? 'Width' : 'Height',
			scrollbar = isHorizontal ? elements.scrollbarHorizontal : elements.scrollbarVertical,
			scrollSize = container['scroll' + property],
			containerSize = container['client' + property],
			trackSize = scrollbar.track['offset' + property],
			sizeRatio = trackSize / scrollSize,
			possibleBarSize = containerSize * sizeRatio,
			barSize = (possibleBarSize < minBarSize[axis]) ? minBarSize[axis] : possibleBarSize,
			hiddenContentAreaSize = scrollSize - containerSize,
			hiddenTrackAreaSize = trackSize - barSize,
			posRatio = hiddenTrackAreaSize / hiddenContentAreaSize;

		return {
			size: sizeRatio,
			position: posRatio
		};
	}

	function updateBarsSize() {
		var container = elements.container,
			visibleHeight = container.clientHeight,
			visibleWidth = container.clientWidth,
			barHeight = Math.ceil(visibleHeight * ratio.y.size),
			barWidth = Math.ceil(visibleWidth * ratio.x.size);

		elements.scrollbarVertical.bar.style.height = barHeight + 'px';
		elements.scrollbarHorizontal.bar.style.width = barWidth + 'px';
	}

	function updateBarsPosition() {
		var container = elements.container,
			scrollTop = container.scrollTop,
			scrollLeft = container.scrollLeft,
			barPositionTop = Math.floor(scrollTop * ratio.y.position),
			barPositionWidth = Math.floor(scrollLeft * ratio.x.position);

		elements.scrollbarVertical.bar.style.top = barPositionTop + 'px';
		elements.scrollbarHorizontal.bar.style.left = barPositionWidth + 'px';
	}

	function scrollbarWheelSpinningHandler(e) {
		var scrollbar = dom.getAscendantByClassName(e.target, CN_SCROLLBAR),
			container = elements.container,
			scrollLength = isPartOfVerticalScrollbar(scrollbar) ? container.scrollTop : container.scrollLeft;

		if (isPartOfVerticalScrollbar(scrollbar)) {
			container.scrollTop = scrollLength + (e.deltaY * 10 || e.detail * 10 || (e.wheelDelta * -1));
		} else {
			container.scrollLeft = scrollLength + (e.deltaX * 10 || e.detail * 10 || (e.wheelDeltaX * -1));
		}
	}

	function scrollbarClickHandler(e) {
		var isBar = !!dom.getAscendantByClassName(e.target, CN_BAR),
			container = elements.container,
			cursorPosition,
			trackPosition,
			newScrollPosition,
			axis,
			property;

		if (!isBar) {

			if (isPartOfVerticalScrollbar(e.target)) {
				axis = 'y';
				cursorPosition = e.clientY;
				property = 'Top';
			} else {
				axis = 'x';
				cursorPosition = e.clientX;
				property = 'Left';
			}

			trackPosition = measure.getPosition(e.target)[axis];
			newScrollPosition = (cursorPosition - trackPosition) / ratio[axis].position;
			container['scroll' + property] = Math.floor(newScrollPosition);
		}
	}

	function btnClickHandler(e) {
		var direction = e.target.classList.contains(CN_BUTTON_FWD) ? 1 : -1,
			container = elements.container,
			property = isPartOfVerticalScrollbar(e.target) ? 'Top' : 'Left';

		container['scroll' + property] += SCROLL_STEP * direction;
	}

	function extremeBtnClickHandler(e) {
		var isToEnd = e.target.classList.contains(CN_BUTTON_TO_END),
			container = elements.container,
			property = isPartOfVerticalScrollbar(e.target) ? 'Top' : 'Left',
			maxValueProperty = isPartOfVerticalScrollbar(e.target) ? 'Height' : 'Width';

		if (isToEnd) {
			container['scroll' + property] = container['scroll' + maxValueProperty];
		} else {
			container['scroll' + property] = 0;
		}

	}

	function dragStart(e) {
		if (isPartOfVerticalScrollbar(e.target)) {
			dragStartY = e.clientY;
			dragStartX = null;
			dragMove = dragMoveY;
		} else {
			dragStartY = null;
			dragStartX = e.clientX;
			dragMove = dragMoveX;
		}

		document.addEventListener(DX.Event.MOUSE_MOVE, dragMove, true);
		document.addEventListener(DX.Event.MOUSE_UP, dragEnd, true);
		document.addEventListener(DX.Event.SELECT_START, preventSelection, true);
	}

	function dragMoveY(e) {
		var container = elements.container,
			dragDelta = dragStartY - e.clientY,
			scrollTop = container.scrollTop,
			delta = dragDelta / ratio.y.position;

		dragStartY = e.clientY;
		container.scrollTop = scrollTop - delta;
	}

	function dragMoveX(e) {
		var dragDelta = dragStartX - e.clientX,
			scrollLeft = elements.container.scrollLeft,
			delta = dragDelta / ratio.x.position;

		dragStartX = e.clientX;
		elements.container.scrollLeft = scrollLeft - delta;
	}

	function dragEnd(e) {
		dragMove(e);

		document.removeEventListener(DX.Event.MOUSE_MOVE, dragMove, true);
		document.removeEventListener(DX.Event.MOUSE_UP, dragEnd, true);
		document.removeEventListener(DX.Event.SELECT_START, preventSelection, true);
	}

	function preventSelection(e) {
		e.preventDefault();
		return false;
	}

	function getElementContent() {
		return elements.content;
	}

	function fireCreatedEvent() {
		DX.Event.trigger(elements.container, Scrollable.E_CREATED, {
			detail: {
				block: elements.scrollable,
				eventTarget: elements.container,
				elementContent: elements.content
			}
		});
	}

	init();

	this.getElementContent = getElementContent;
};


function initElements(scrollableContainer) {
	return {
		scrollable: dom.createElement('div', {
			className: CN_SCROLLABLE
		}),
		wrapper: dom.createElement('div', {
			className: CN_WRAPPER
		}),
		container: scrollableContainer,
		content: dom.createElement('div', {
			className: CN_CONTENT
		}),
		contentResizeDetector: dom.createElement('iframe', {
			className: CN_RESIZE_DETECTOR,
			src: 'about:blank'
		}),
		scrollableResizeDetector: dom.createElement('iframe', {
			className: CN_RESIZE_DETECTOR,
			src: 'about:blank'
		}),
		scrollbarVertical: ipad ? null : initScrollBarElements(CN_SCROLLBAR_VERTICAL),
		scrollbarHorizontal: ipad ? null : initScrollBarElements(CN_SCROLLBAR_HORIZONTAL)
	};
}

function initAppearance(elements) {
	fillContentElement(elements);
	makeDefaultStructure(elements);
	addMaxHeight(elements);

	if (!ipad) {
		initScrollbarAppearance(elements.scrollbarVertical, elements.wrapper);
		initScrollbarAppearance(elements.scrollbarHorizontal, elements.wrapper);
		injectResizeDetectors(elements);
	}
}

function fillContentElement(elements) {
	var container = elements.container;

	for (var i = 0, total = container.children.length; i < total; i++) {
		elements.content.appendChild(container.children[0]);
	}
}

function makeDefaultStructure(elements) {
	var parent = dom.getParent(elements.container);

	parent.insertBefore(elements.scrollable, elements.container);
	elements.wrapper.appendChild(elements.container);
	elements.scrollable.appendChild(elements.wrapper);
	elements.container.appendChild(elements.content);

	transferClassNames(elements);
}

function addMaxHeight(elements) {
	var style = window.getComputedStyle(elements.scrollable),
		scrollableMaxHeight = style.getPropertyValue('max-height'),
		containerMaxHeight;

	if (scrollableMaxHeight !== 'none') {
		scrollableMaxHeight = parseFloat(scrollableMaxHeight);
		containerMaxHeight = scrollableMaxHeight + scrollBarsSize.vertical;

		elements.container.style.maxHeight = containerMaxHeight + 'px';
	}

}

function initScrollBarElements(type) {
	return {
		scrollbar: dom.createElement('div', {
			className: [CN_SCROLLBAR, type]
		}),
		track: dom.createElement('div', {
			className: CN_TRACK
		}),
		bar: dom.createElement('div', {
			className: CN_BAR
		}),
		buttonToEnd: dom.createElement('button', {
			type: 'button',
			className: [CN_BUTTON, CN_BUTTON_EXTREME, CN_BUTTON_TO_END]
		}),
		buttonToStart: dom.createElement('button', {
			type: 'button',
			className: [CN_BUTTON, CN_BUTTON_EXTREME, CN_BUTTON_TO_START]
		}),
		buttonFwd: dom.createElement('button', {
			type: 'button',
			className: [CN_BUTTON, CN_BUTTON_FWD]
		}),
		buttonBack: dom.createElement('button', {
			type: 'button',
			className: [CN_BUTTON, CN_BUTTON_BACK]
		})
	};
}

function initScrollbarAppearance(elements, wrapper) {
	var scrollbar = elements.scrollbar;

	scrollbar.appendChild(elements.buttonToStart);
	scrollbar.appendChild(elements.buttonBack);
	scrollbar.appendChild(elements.track);
	scrollbar.appendChild(elements.buttonFwd);
	scrollbar.appendChild(elements.buttonToEnd);
	elements.track.appendChild(elements.bar);

	wrapper.appendChild(scrollbar);
}

function injectResizeDetectors(elements) {
	elements.scrollable.appendChild(elements.scrollableResizeDetector);
	elements.content.appendChild(elements.contentResizeDetector);
}

function transferClassNames(elements) {
	var scrollable = elements.scrollable,
		container = elements.container;

	scrollable.className = scrollable.className + ' ' + container.className;
	container.className = CN_CONTAINER;
}

function isPartOfVerticalScrollbar(element) {
	return dom.getAscendantByClassName(element, CN_SCROLLBAR).classList.contains(CN_SCROLLBAR_VERTICAL);
}

function getStyle(element, property) {
	return window.getComputedStyle(element, null).getPropertyValue(property);
}


Scrollable.E_CREATED = 'scrollable:created';
Scrollable.E_UPDATED = 'scrollable:updated';