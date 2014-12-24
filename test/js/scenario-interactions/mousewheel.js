angular.scenario.dsl('mousewheel', function() {
	return function(selector, delta) {
		return this.addFutureAction('mouse wheel spinning', function($window, $document, done) {
			var E_WHEEL_EVENT = 'mousewheel',
				element = $document.find(selector).get(0),
				event = new WheelEvent(E_WHEEL_EVENT);

			event.initWebKitWheelEvent(delta.x || false, delta.y || false);

			function wheelHandler() {
				element.removeEventListener(E_WHEEL_EVENT, wheelHandler);
				done();
			}
			element.addEventListener(E_WHEEL_EVENT, wheelHandler);
			element.dispatchEvent(event);
		});
	};
});