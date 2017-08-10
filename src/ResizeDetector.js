// http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
const attachEvent = document['attachEvent'];
const isIe = navigator.userAgent.match(/Trident/);

const RESIZE_LISTENERS_KEY = '__RESIZE_LISTENERS__';
const RESIZE_TRIGGER_KEY = '__RESIZE_TRIGGER__';
const RESIZE_ELEMENT_KEY = '__RESIZE_ELEMENT__';

const resizeListener = event => {
	const win = event.target || event.srcElement;
	if (win.__resizeRAF__) {
		cancelAnimationFrame(win.__resizeRAF__);
	}
	win.__resizeRAF__ = requestAnimationFrame(() => {
		const trigger = win.__resizeTrigger__;
		trigger[RESIZE_LISTENERS_KEY].forEach(fn => fn.call(trigger, event));
	});
};

/**
 * Remove resize listiner from elements.
 * @param {HTMLElement} element
 * @param {Function} fn
 */
function removeResizeListener(element, fn) {
	element[RESIZE_LISTENERS_KEY].splice(element[RESIZE_LISTENERS_KEY].indexOf(fn), 1);
	if (!element[RESIZE_LISTENERS_KEY].length) {
		if (attachEvent) {
			element['detachEvent']('onresize', resizeListener);
		} else {
			if (element[RESIZE_LISTENERS_KEY].contentDocument) {
				element[RESIZE_LISTENERS_KEY].contentDocument.defaultView.removeEventListener('resize', resizeListener);
				element[RESIZE_LISTENERS_KEY] = !element.removeChild(element[RESIZE_TRIGGER_KEY]);
			}
		}
	}
}

/**
 * Add listening to resize events on the elements. Calls the event callback for each event for each element.
 * @param {HTMLElement} element
 * @param {Function} fn
 * @returns {Function} clearer function, removing resize listiner
 */
export function addResizeListener(element, fn) {
	if (!element[RESIZE_LISTENERS_KEY]) {
		element[RESIZE_LISTENERS_KEY] = [];
		if (attachEvent) {
			element[RESIZE_TRIGGER_KEY] = element;
			element['attachEvent']('onresize', resizeListener);
		} else {
			if (getComputedStyle(element).position === 'static') {
				element.style.position = 'relative';
			}
			const obj = element[RESIZE_TRIGGER_KEY] = document.createElement('object');
			obj.setAttribute('style', `display: block;
				position: absolute; 
				top: 0; 
				left: 0; 
				height: 100%; 
				width: 100%; 
				overflow: hidden; 
				pointer-events: none; 
				z-index: -1;`
			);
			obj[RESIZE_ELEMENT_KEY] = element;
			obj.onload = (event) => {
				const {target} = event;
				target.contentDocument.defaultView.__resizeTrigger__ = target[RESIZE_ELEMENT_KEY];
				target.contentDocument.defaultView.addEventListener('resize', resizeListener);
			};
			obj.type = 'text/html';
			if (isIe) {
				element.appendChild(obj);
			}
			obj.data = 'about:blank';
			if (!isIe) {
				element.appendChild(obj);
			}
		}
	}
	element[RESIZE_LISTENERS_KEY].push(fn);

	return () => removeResizeListener(element, fn);
}
