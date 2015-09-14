describe('Scrollable', function() {
	beforeEach(function() {
		browser().navigateTo('/test/js/html/scrollable.horizontal.case.html');
	});
	afterEach(function() {
		browser().navigateTo('');
	});

	describe('Horizontal scrollbar', function() {

		//TODO: fild other way to use mouse wheel.
		//initWenkitEvent is deprecated. https://groups.google.com/a/chromium.org/forum/#!searchin/blink-dev/initWebkitWheelEvent$20/blink-dev/h_GoezQ4MQ4/Q5abFkhA76sJ
		//it('should scroll content when mouse wheel spinning on it', function() {
		//	mousewheel('.scrollbar-horizontal .scrollbar--track', {
		//		x: -1,
		//		y: 0
		//	});
		//	sleep(0.05);
		//	expect(element('.scrollable--container').scrollLeft()).not().toBe(0);
		//});

		it('should scroll when clicked on scrollbar--track', function() {
			element('.scrollable--container').scrollLeft(100);
			sleep(0.05);
			element('.scrollbar-horizontal .scrollbar--track').click();
			sleep(0.05);
			expect(element('.scrollable--container').scrollLeft()).toBe(0);
		});

		it('should not scroll when user click on scrollbar--bar', function() {
			element('.scrollable--container').scrollLeft(100);
			sleep(0.05);
			element('.scrollbar-horizontal .scrollbar--bar').click();
			sleep(0.05);
			expect(element('.scrollable--container').scrollLeft()).toBe(100);
		});

		it('should scroll when bar dragged', function() {
			mouseDown('.scrollbar-horizontal .scrollbar--bar', {
				clientX: 50,
				bubbles: true
			});
			mouseMove('body', {
				clientX: 92,
				bubbles: true
			});
			sleep(0.05);

			expect(element('.scrollable--container').scrollLeft()).toBe(112);

			mouseUp('body', {
				clientX: 1000,
				bubbles: true
			});
			sleep(0.05);

			expect(element('.scrollable--container').scrollLeft()).toBe(120);
		});

		it('should scroll left when user clicks on scrollbar--button-forward', function() {
			element('.scrollbar-horizontal .scrollbar--button-forward').click();

			expect(element('.scrollable--container').scrollLeft()).toBe(20);
		});

		it('should scroll right when user clicks on .scrollbar--button-backward', function() {
			element('.scrollbar-horizontal .scrollbar--button-forward').click();
			element('.scrollbar-horizontal .scrollbar--button-backward').click();

			expect(element('.scrollable--container').scrollLeft()).toBe(0);
		});

		it('should scroll to left when user click on button-toStart', function() {
			element('.scrollable--container').scrollLeft(100);

			element('.scrollbar-horizontal .scrollbar--button-toStart').click();

			expect(element('.scrollable--container').scrollLeft()).toBe(0);
		});

		it('should scroll to right when user click on button-toEnd', function() {
			element('.scrollable--container').scrollLeft(50);

			element('.scrollbar-horizontal .scrollbar--button-toEnd').click();

			expect(element('.scrollable--container').scrollLeft()).toBeGreaterThan(118);
			expect(element('.scrollable--container').scrollLeft()).toBeLessThan(122);
		});
	});
});
