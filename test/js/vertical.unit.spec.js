describe('Scrollable behavior', function() {
	describe('in vertical scrolling case', function() {
		beforeEach(function() {
			Utils.renderTemplate(Utils.VERTICAL_SCROLL_PAGE);
			testEl = document.getElementById('test');
		});

		afterEach(function() {
			document.body.innerHTML = '';
			testEl = null;
		});

		it('should show/hide vertical scrollbar when it necessary', function() {
			var someContent;

			new Scrollable(testEl);

			expect(document.querySelector('.scrollable-withVerticalScrollbar')).not.toBeNull('vertical scrolling should appear');

			someContent = document.querySelectorAll('.scrollable--content ul');
			someContent[0].innerHTML = '';
			someContent[1].innerHTML = '';

			waitsFor(function() {
				return document.querySelector('.scrollable-withVerticalScrollbar') === null;
			}, 'vertical scrolling should disappear', 300);
		});

		it('should correctly calculate .scrollbar-vertical .scrollbar--bar height', function() {
			new Scrollable(testEl);

			expect(document.querySelector('.scrollbar-vertical .scrollbar--bar').offsetHeight).toBeWithinRange(70, 80);
		});

		it('should move .scrollbar--bar when scrollbar scrollTop changed on original element', function() {
			var scrollHandler = jasmine.createSpy('scrollHandler');

			testEl.addEventListener('scroll', scrollHandler);
			new Scrollable(testEl);

			testEl.scrollTop = 20;


			waitsFor(function() {
				return scrollHandler.calls.length !== 0 ;
			}, 'scroll event firing', 100);

			runs(function() {
				expect(document.querySelector('.scrollbar-vertical .scrollbar--bar').offsetTop).toBeWithinRange(5, 9);
			});
		});

		it('should fit .scrollbar--bar in .scrollbar--track', function() {
			var track,
				bar,
				scrollHandler = jasmine.createSpy('scrollHandler');

			new Scrollable(testEl);
			track = document.querySelector('.scrollbar-vertical .scrollbar--track');
			bar = document.querySelector('.scrollbar-vertical .scrollbar--bar');
			testEl.addEventListener('scroll', scrollHandler);

			testEl.scrollTop = 1000;


			waitsFor(function() {
				return scrollHandler.calls.length === 1;
			}, 'scrolling happened', 100);

			runs (function() {
				expect(track.offsetHeight - bar.offsetTop - bar.offsetHeight).toEqual(0);
			})
		});

		it('should correctly work when .scrollbar--bar height less than min-height', function() {
			var someLi,
				fragment = document.createDocumentFragment(),
				scrollHandler = jasmine.createSpy('scrollHandler'),
				bar,
				track;

			for (var i = 0; i < 300; i++) {
				someLi = document.createElement('li');
				someLi.textContent = i;
				fragment.appendChild(someLi);
			}
			document.querySelector('ul').appendChild(fragment);


			new Scrollable(testEl);
			bar = document.querySelector('.scrollbar-vertical .scrollbar--bar');
			track = document.querySelector('.scrollbar-vertical .scrollbar--track');

			testEl.addEventListener('scroll', scrollHandler);
			testEl.scrollTop = 20000;

			waitsFor(function() {
				return scrollHandler.calls.length !== 0 ;
			}, 'scroll event firing', 100);

			runs(function() {
				expect(bar.offsetHeight).not.toBeLessThan('10', 'min-height should works');
				expect(track.offsetHeight - bar.offsetHeight - bar.offsetTop).toBeWithinRange(0, 1);
			});
		});
	});
});
