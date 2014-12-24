describe('Scrollable', function() {
	beforeEach(function() {
		browser().navigateTo('/test/js/html/scrollable.vertical.case.html');
	});
	afterEach(function() {
		browser().navigateTo('');
	});

	describe('Vertical scrollbar', function() {
		it('should scroll content when mouse wheel spinning on it', function() {
			mousewheel('.scrollbar-vertical .scrollbar--track', {
				x: 0,
				y: -1
			});
			sleep(0.05);
			expect(element('.scrollable--container').scrollTop()).not().toBe(0);
		});

		it('should scroll when clicked on scrollbar--track', function() {
			element('.scrollable--container').scrollTop(100);
			sleep(0.05);
			element('.scrollbar-vertical .scrollbar--track').click();
			sleep(0.05);
			expect(element('.scrollable--container').scrollTop()).toBe(0);
		});

		it('should not scroll when user click on scrollbar--bar', function() {
			element('.scrollable--container').scrollTop(100);
			sleep(0.05);
			element('.scrollbar-vertical .scrollbar--bar').click();
			sleep(0.05);
			expect(element('.scrollable--container').scrollTop()).toBe(100);
		});

		it('should scroll when bar dragged', function() {
			mouseDown('.scrollbar-vertical .scrollbar--bar', {
				clientY: 50,
				bubbles: true
			});
			mouseMove('body', {
				clientY: 92,
				bubbles: true
			});
			sleep(0.05);

			expect(element('.scrollable--container').scrollTop()).toBe(112);

			mouseUp('body', {
				clientY: 1000,
				bubbles: true
			});
			sleep(0.05);

			expect(element('.scrollable--container').scrollTop()).toBeGreaterThan(118);
			expect(element('.scrollable--container').scrollTop()).toBeLessThan(122);
		});

		it('should scroll down when user clicks on scrollbar--button-forward', function() {
			element('.scrollbar-vertical .scrollbar--button-forward').click();

			expect(element('.scrollable--container').scrollTop()).toBe(20);
		});

		it('should scroll up when user clicks on .scrollbar--button-backward', function() {
			element('.scrollbar-vertical .scrollbar--button-forward').click();
			element('.scrollbar-vertical .scrollbar--button-backward').click();

			expect(element('.scrollable--container').scrollTop()).toBe(0);
		});


		it('should not appear until max-height is achieved', function() {
			element('.wrapper').css({
				height: 'auto',
				lineHeight: '1.1'
			});
			element('.scrollable--container').css({
				maxHeight: '250px'
			});
			element('ul:first').css({
				display: 'none'
			});

			expect(element('.wrapper').outerHeight()).toBeLessThan(150);

			element('ul:first').css({
				display: 'block'
			});
			expect(element('.wrapper').outerHeight()).toBeGreaterThan(200);


		});

		it('should add max-width to .scrollable--container', function() {
			browser().navigateTo('/test/js/html/scrollable.vertical.maxHeight.case.html');

			expect(element('.scrollable--container').outerHeight()).toBeGreaterThan(199);
			expect(element('.scrollable--container').outerHeight()).toBeLessThan(220);
		});

		it('should scroll to top when user click on button-toStart', function() {
			element('.scrollable--container').scrollTop(100);

			element('.scrollbar-vertical .scrollbar--button-toStart').click();

			expect(element('.scrollable--container').scrollTop()).toBe(0);
		});

		it('should scroll to bottom when user click on button-toEnd', function() {
			element('.scrollable--container').scrollTop(50);

			element('.scrollbar-vertical .scrollbar--button-toEnd').click();

			expect(element('.scrollable--container').scrollTop()).toBeGreaterThan(118);
			expect(element('.scrollable--container').scrollTop()).toBeLessThan(122);
		});
	});
});
