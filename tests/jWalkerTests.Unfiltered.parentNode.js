module("jWalker: Unfiltered parentNode Tests", {
	setup: function () {
		var doc = document,
			containerId = jWalkerTester.containerId;
		this.testData = null;
		this.executionContainer = doc.getElementById(containerId);

		// Only assert these if they fail, otherwise they'll clutter up the results page unnecessarily
		if (!this.executionContainer) {
			ok(false, "executionContainer for test must be available for testing.");
		}
		if (this.executionContainer.innerHTML) {
			ok(false, "executionContainer for test must not contain content before the test begins.");
		}
	},
	teardown: function () {
		// This is unnecessary as it should be handled by QUnit.reset()
		//this.executionContainer.innerHTML = "";
	}
});

QUnitHelper.test("No children, only showing text nodes", {
		container: function () { return QUnit.current_testEnvironment.executionContainer; },
		html: function () { return "<div></div>"; },
		// Set TreeWalker constructor arguments
		root: function () { return this.container().firstChild; }, // div
		whatToShow: function () { return [jWalker.NodeTypeFilter.SHOW_TEXT]; },
		filter: function () { return null; },
		expandEntityReferences: function () { return false; },
		// Set walk-related properties
		startNode: function () { return this.root(); }, // div
		walk: function () {
			return [{
				type: jWalkerTester.StepType.parentNode,
				expected_root: this.root(),
				expected_currentNode: this.root(),
				expectedResultNode: null
			}];
		}
	},
	function () {
		var currentTest = this.testData;
		// Setup the DOM
		currentTest.container().innerHTML = currentTest.html();

		// Setup the tester
		var nativeTreeWalker = new jWalker.TreeWalker(currentTest.root(), currentTest.whatToShow(), currentTest.filter(), currentTest.expandEntityReferences()),
			nonNativeTreeWalker = jWalkerTester.createNonNativeTreeWalker(currentTest.root(), currentTest.whatToShow(), currentTest.filter(), currentTest.expandEntityReferences()),
			twTester = new jWalkerTester.crossBrowserTreeWalkerTester(nativeTreeWalker, nonNativeTreeWalker);

		// Prep for walk
		nativeTreeWalker.currentNode = currentTest.startNode();
		nonNativeTreeWalker.currentNode = currentTest.startNode();

		// Walk and verify
		twTester.verifyWalk(currentTest.walk());
	}
);