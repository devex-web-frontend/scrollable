var Utils = (function() {
	var stylesheet = 'test/js/css/test.css';

	function waits(msecs) {
		var isReady = false;

		waitsFor(function() {
			return isReady;
		}, 'waits for something', msecs + 100);

		setTimeout(function() {
			isReady = true
		}, msecs);
	}

	function renderTemplate(tplName) {
		var pageHtml = window.__html__[tplName],
			startBodyPos = pageHtml.indexOf('<body>'),
			endBodyPos = pageHtml.indexOf('</body>'),
			pageContent = pageHtml.substring(startBodyPos + 6, endBodyPos);

		document.body.innerHTML = ['<style>', window.__html__[stylesheet],'</style>', pageContent].join('');
	}

	return {
		VERTICAL_SCROLL_PAGE: 'test/js/html/scrollable.vertical.case.html',
		HORIZONTAL_SCROLL_PAGE: 'test/js/html/scrollable.horizontal.case.html',
		waits: waits,
		renderTemplate: renderTemplate
	}
})();
