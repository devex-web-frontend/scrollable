describe('Scrollable', function() {
	var testEl;


	beforeEach(function() {
		Utils.renderTemplate(Utils.VERTICAL_SCROLL_PAGE);
		testEl = document.getElementById('test');
	});

	afterEach(function() {
		document.body.innerHTML = '';
		testEl = null;
	});


	describe('#constructor', function() {
		it('should create additional elements and provide some additional classnames', function() {
			var scrollable, wrapper, scrollableContainer, scrollableContent, contentResizeDetector, originalAreaResizeDetector,
				scrollbarVertical, scrollbarTrackVertical, scrollbarBarVertical, scrollbarButtonFwdVertical, scrollbarButtonBackVertical,
				scrollbarHorizontal, scrollbarTrackHorizontal, scrollbarBarHorizontal, scrollbarButtonFwdHorizontal, scrollbarButtonBackHorizontal,
				scrollbarButtonToEndHorizontal, scrollbarButtonToStartHorizontal;

			new Scrollable(testEl);

			try {
				scrollable =  document.querySelector('.scrollable');
				wrapper =  scrollable.querySelector('.scrollable--wrapper');
				scrollableContainer = wrapper.querySelector('.scrollable--container');
				scrollableContent = wrapper.querySelector('.scrollable--content');
				originalAreaResizeDetector = scrollable.querySelectorAll('.scrollable--resizeDetector')[1];
				contentResizeDetector = scrollableContent.querySelectorAll('.scrollable--resizeDetector')[0];

				scrollbarVertical = wrapper.querySelector('.scrollbar-vertical');
				scrollbarTrackVertical = scrollbarVertical.querySelector('.scrollbar--track');
				scrollbarBarVertical = scrollbarTrackVertical.querySelector('.scrollbar--bar');
				scrollbarButtonFwdVertical = scrollbarVertical.querySelector('.scrollbar--button-forward');
				scrollbarButtonBackVertical = scrollbarVertical.querySelector('.scrollbar--button-backward');

				scrollbarHorizontal = wrapper.querySelector('.scrollbar-horizontal');
				scrollbarTrackHorizontal = scrollbarHorizontal.querySelector('.scrollbar--track');
				scrollbarBarHorizontal = scrollbarTrackHorizontal.querySelector('.scrollbar--bar');
				scrollbarButtonFwdHorizontal = scrollbarHorizontal.querySelector('.scrollbar--button-forward');
				scrollbarButtonBackHorizontal = scrollbarHorizontal.querySelector('.scrollbar--button-backward');

				scrollbarButtonToEndHorizontal = scrollbarHorizontal.querySelector('.scrollbar--button-toEnd');
				scrollbarButtonToStartHorizontal = scrollbarHorizontal.querySelector('.scrollbar--button-toStart');

			} catch (e) {}

			expect(scrollable).toBeTruthy('.scrollable should be present');
			expect(wrapper).toBeTruthy('.scrollable--wrapper should be present');
			expect(scrollableContainer).toBeTruthy('.scrollable--container should be present');
			expect(scrollableContent).toBeTruthy('.scrollable--content should be present');
			expect(originalAreaResizeDetector).toBeTruthy('.scrollable--resizeDetector should be present as child of .scrollable');
			expect(contentResizeDetector).toBeTruthy('.scrollable--resizeDetector should be present as child of .scrollable--content');
			expect(contentResizeDetector).not.toBe(originalAreaResizeDetector, 'should be 2 different .scrollable--resizeDetectors');

			expect(scrollbarVertical).toBeTruthy('.scrollbar-vertical should be present');
			expect(scrollbarTrackVertical).toBeTruthy('.scrollbar--track should be present into .scrollbar-vertical');
			expect(scrollbarBarVertical).toBeTruthy('.scrollbar--bar should be present into .scrollbar-vertical');
			expect(scrollbarButtonFwdVertical).toBeTruthy('.scrollbar--button-up should be present into .scrollbar-vertical');
			expect(scrollbarButtonBackVertical).toBeTruthy('.scrollbar--button-down should be present into .scrollbar-vertical');

			expect(scrollbarHorizontal).toBeTruthy('.scrollbar-horizontal should be present');
			expect(scrollbarTrackHorizontal).toBeTruthy('.scrollbar--track should be present into .scrollbar-horizontal');
			expect(scrollbarBarHorizontal).toBeTruthy('.scrollbar--bar should be present into .scrollbar-horizontal');
			expect(scrollbarButtonFwdHorizontal).toBeTruthy('.scrollbar--button-up should be present into .scrollbar-horizontal');
			expect(scrollbarButtonBackHorizontal).toBeTruthy('.scrollbar--button-down should be present into .scrollbar-horizontal');

			expect(scrollbarButtonToEndHorizontal).toBeTruthy();
			expect(scrollbarButtonToStartHorizontal).toBeTruthy();
		});

		it('should save original dom elements for .scrollable--container', function() {
			new Scrollable(testEl);

			expect(document.querySelector('.scrollable--container')).toEqual(testEl);
		});

		it('should move all childrens of original element into generated .scrollable--content element', function() {
			var element = testEl.children[0],
				movedElement;

			new Scrollable(testEl);

			movedElement = document.querySelector('.scrollable--content').children[0];

			expect(element).toEqual(movedElement);
			expect(document.querySelector('.scrollable--content').children.length).toBe(5, '5 = 4 + 1; 4 - childs of original elements; 1 - generated iframe');
		});

		it('should move all classNames from original elements to generated .scrollable', function() {

			new Scrollable(testEl);

			expect(document.querySelector('.scrollable').classList.contains('test-class')).toBe(true, '.scrollable should contains class test-class');
			expect(document.querySelector('.scrollable--container').classList.contains('test-class-2')).toBe(false, '.scrollable--contains should not contains class test-class-2');
		});

		it('should hide system scrollbars', function() {
			new Scrollable(testEl);

			var scrollable = document.querySelector('.scrollable'),
				scrollableContainer = document.querySelector('.scrollable--container');

			expect(scrollable.clientWidth).toBe(scrollableContainer.clientWidth, '.scrollable--container should have same width like .scrollable reduced by system scrollbar width');
			expect(scrollableContainer.clientWidth).not.toEqual(scrollableContainer.offsetWidth, '.scrollable--container should have system vertical scrollbar');
			expect(scrollable.clientHeight).toBe(scrollableContainer.clientHeight, '.scrollable--container should have same height like .scrollable reduced by system scrollbar height');
			expect(scrollableContainer.clientHeight).not.toEqual(scrollableContainer.offsetHeight, '.scrollable--container should have system horizontal scrollbar');
		});

		it('should correctly hide system scrollbars if original scrollable area present into element width display:none', function() {
			document.body.style.display = 'none';
			new Scrollable(testEl);

			var scrollable = document.querySelector('.scrollable'),
				scrollableContainer = document.querySelector('.scrollable--container');

			Utils.waits(300);

			runs(function() {
				document.body.style.display = '';
			});

			waitsFor(function() {
				return scrollable.clientWidth === scrollableContainer.clientWidth &&
					scrollable.clientHeight === scrollableContainer.clientHeight;
			},'waits when .scrollable--content`s content area will have same sizes like .scrollable element', 100);
		});

		it('shoukd keep style tag if it already exists', function() {
			var styleElement = document.createElement('style'),
				styles = "body{background:red}";

			styleElement.appendChild(document.createTextNode(styles));
			document.getElementsByTagName("head")[0].appendChild(styleElement);


			new Scrollable(testEl);
		})
	});
	describe('Event API', function() {
		describe('Scrollable.E_CREATED', function() {
			it('should trigger "scrollable:created" once after created', function() {
				var eventHandler = jasmine.createSpy('eventHandler');

				testEl.addEventListener(Scrollable.E_CREATED, eventHandler);

				new Scrollable(testEl);

				expect(eventHandler).toHaveBeenCalled();
				expect(eventHandler.calls.length).toBe(1);
			});

			it('should pass e.detail', function() {
				var block,
						elementContent,
						eventTarget;

				testEl.addEventListener(Scrollable.E_CREATED, function(e) {
					block = e.detail.block;
					eventTarget = e.detail.eventTarget;
					elementContent = e.detail.elementContent;
				});

				new Scrollable(testEl);

				waitsFor(function() {
					return typeof elementContent !== 'undefined';
				}, 'Event should be triggered', 100);

				runs(function() {
					expect(elementContent).toBe(document.querySelector('.scrollable--content'));
					expect(block).toBe(document.querySelector('.scrollable'));
					expect(eventTarget).toBe(testEl);
				});
			});
		});
	});
});
