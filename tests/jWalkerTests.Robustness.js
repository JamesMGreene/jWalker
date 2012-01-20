module("jWalker: Robustness Tests", {
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


// View the following page to get test ideas:
// http: //www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#TreeWalker-Robustness
