describe('Scrollable behavior', function() {
	describe('in horizotal scrolling case', function() {
		beforeEach(function() {
			Utils.renderTemplate(Utils.HORIZONTAL_SCROLL_PAGE);
			testEl = document.getElementById('test');
		});

		afterEach(function() {
			document.body.innerHTML = '';
			testEl = null;
		});

		it('should show/hide horizontal scrollbar when it necessary', function() {
			var header = document.querySelector('h2[style]');

			new Scrollable(testEl);

			expect(document.querySelector('.scrollable-withHorizontalScrollbar')).not.toBeNull('horizontal scrolling should disappear');

			header.style.width = 'auto';

			waitsFor(function() {
				return document.querySelector('.scrollable-withHorizontalScrollbar') === null;
			},'waits when horizontal scrolling appear', 300);

		});

		it('should correctly calculate .scrollbar-horizontal .scrollbar--bar width', function() {
			new Scrollable(testEl);

			expect(document.querySelector('.scrollbar-horizontal .scrollbar--bar').offsetWidth).toBeWithinRange(70, 80);
		});

		it('should move .scrollbar--bar when scrollbar scrollLeft changed on original element', function() {
			var scrollHandler = jasmine.createSpy('scrollHandler');

			testEl.addEventListener('scroll', scrollHandler);
			new Scrollable(testEl);

			testEl.scrollLeft = 20;

			waitsFor(function() {
				return scrollHandler.calls.length !== 0 ;
			}, 'scroll event firing', 300);

			runs(function() {
				expect(document.querySelector('.scrollbar-horizontal .scrollbar--bar').offsetLeft).toBeWithinRange(5, 9);
			});
		});

		it('should fit .scrollbar--bar in .scrollbar--track', function() {
			var track,
				bar,
				scrollHandler = jasmine.createSpy('scrollHandler');

			new Scrollable(testEl);
			track = document.querySelector('.scrollbar-horizontal .scrollbar--track');
			bar = document.querySelector('.scrollbar-horizontal .scrollbar--bar');
			testEl.addEventListener('scroll', scrollHandler);

			testEl.scrollLeft = 1000;


			waitsFor(function() {
				return scrollHandler.calls.length === 1;
			}, 'scrolling happened', 100);

			runs (function() {
				expect(track.offsetWidth - bar.offsetLeft - bar.offsetWidth).toBeWithinRange(0, 1);
			})
		});
		it('should correctly work when .scrollbar--bar width less than min-width', function() {
			var scrollHandler = jasmine.createSpy('scrollHandler'),
				bar,
				track;

			new Scrollable(testEl);
			bar = document.querySelector('.scrollbar-horizontal .scrollbar--bar');
			track = document.querySelector('.scrollbar-horizontal .scrollbar--track');
			document.querySelector('h2').style.width = '4000px';

			testEl.addEventListener('scroll', scrollHandler);
			testEl.scrollLeft = 20000;

			waitsFor(function() {
				return scrollHandler.calls.length !== 0 ;
			}, 'scroll event firing', 100);

			runs(function() {
				expect(bar.offsetWidth).not.toBeLessThan('10', 'min-width should works');
				expect(track.offsetWidth - bar.offsetWidth - bar.offsetLeft).toBeWithinRange(0, 1);
			});
		});
	})
})
