angular.scenario.dsl('mouseMove', function() {
	return function(selector, params) {
		return this.addFutureAction('mouse move', function($window, $document, done) {
			var element = $document.find(selector).get(0),
				event = new MouseEvent('mousemove', params);

			function mouseMoveHandler() {
				element.removeEventListener('mousemove', mouseMoveHandler);
				done();
			}
			element.addEventListener('mousemove', mouseMoveHandler);
			element.dispatchEvent(event);
		});
	};
});