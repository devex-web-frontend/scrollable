angular.scenario.dsl('mouseUp', function() {
	return function(selector, params) {
		return this.addFutureAction('mouseup', function($window, $document, done) {
			var element = $document.find(selector).get(0),
				event = new MouseEvent('mouseup', params);

			function mouseUpHandler() {
				element.removeEventListener('mouseup', mouseUpHandler);
				done();
			}
			element.addEventListener('mouseup', mouseUpHandler);
			element.dispatchEvent(event);
		});
	};
});