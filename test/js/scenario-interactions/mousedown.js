angular.scenario.dsl('mouseDown', function() {
	return function(selector, params) {
		return this.addFutureAction('mouse down', function($window, $document, done) {
			var element = $document.find(selector).get(0),
				event = new MouseEvent('mousedown', params);

			function mouseDownHandler() {
				element.removeEventListener('mousedown', mouseDownHandler);
				done();
			}
			element.addEventListener('mousedown', mouseDownHandler);
			element.dispatchEvent(event);
		});
	};
});