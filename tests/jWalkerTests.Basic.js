module("jWalker: Basic Tests", {
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

QUnitHelper.test("Verify namespace, objects, and classes are all defined", null, function () {
	strictEqual((typeof(jWalker)).toLowerCase(), "object", "The 'jWalker' namespace should be defined.");
	strictEqual((typeof(jWalker.NodeType)).toLowerCase(), "object", "The 'jWalker.NodeType' object should be defined.");
	strictEqual((typeof(jWalker.NodeTypeFilter)).toLowerCase(), "object", "The 'jWalker.NodeTypeFilter' object should be defined.");
	strictEqual((typeof(jWalker.NodeFilter)).toLowerCase(), "object", "The 'jWalker.NodeFilter' object should be defined.");
	strictEqual((typeof(jWalker.TreeWalker)).toLowerCase(), "function", "The 'jWalker.TreeWalker' class should be defined.");
});

QUnitHelper.test("Verify passing bad input parameters throws exceptions", null, function () {
	var root = this.executionContainer,
		whatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
		filter = { acceptNode: function (node) { return Cobalt.Document.Dom.NodeFilter.FILTER_ACCEPT; } },
		expandEntityReferences = true;

	// Invalid value for root
	raises(function() { return new jWalker.TreeWalker(null, whatToShow, filter, expandEntityReferences); },
		function (ex) { return (ex === "ArgumentException: root is not a valid Node object"); },
		"Native TreeWalker's root should be a valid Node object");
	raises(function() { return jWalkerTester.createNonNativeTreeWalker(null, whatToShow, filter, expandEntityReferences); },
		function (ex) { return (ex === "ArgumentException: root is not a valid Node object"); },
		"Non-Native TreeWalker's root should be a valid Node object");

	// Invalid array for whatToShow
	raises(function () { return new jWalker.TreeWalker(root, null, filter, expandEntityReferences); },
		function (ex) { return (ex === "ArgumentException: Invalid array provided as value for whatToShow"); },
		"Native TreeWalker's whatToShow should be a valid array");
	raises(function () { return jWalkerTester.createNonNativeTreeWalker(root, null, filter, expandEntityReferences); },
		function (ex) { return (ex === "ArgumentException: Invalid array provided as value for whatToShow"); },
		"Non-Native TreeWalker's whatToShow should be a valid array");

	// Empty array for whatToShow
	raises(function () { return new jWalker.TreeWalker(root, [], filter, expandEntityReferences); },
		function (ex) { return (ex === "ArgumentException: Empty array provided as value for whatToShow"); },
		"Native TreeWalker's whatToShow should be a non-empty array");
	raises(function () { return jWalkerTester.createNonNativeTreeWalker(root, [], filter, expandEntityReferences); },
		function (ex) { return (ex === "ArgumentException: Empty array provided as value for whatToShow"); },
		"Non-Native TreeWalker's whatToShow should be a non-empty array");

	// Invalid value in array for whatToShow
	raises(function () { return new jWalker.TreeWalker(root, [-5], filter, expandEntityReferences); },
		function (ex) { return (ex === "ArgumentException: Invalid value in whatToShow[0] = -5"); },
		"Native TreeWalker's whatToShow array must contain all valid values");
	raises(function () { return jWalkerTester.createNonNativeTreeWalker(root, [-5], filter, expandEntityReferences); },
		function (ex) { return (ex === "ArgumentException: Invalid value in whatToShow[0] = -5"); },
		"Non-Native TreeWalker's whatToShow array must contain all valid values");
});

QUnitHelper.test("Verify filter defaults to null if no valid value is passed as input", null, function () {
	var root = this.executionContainer,
		whatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
		filter = undefined,
		expandEntityReferences = true,
		nativeTreeWalker = new jWalker.TreeWalker(root, whatToShow, filter, expandEntityReferences),
		nonNativeTreeWalker = jWalkerTester.createNonNativeTreeWalker(root, whatToShow, filter, expandEntityReferences);

	strictEqual(nativeTreeWalker.filter, null, "Native TreeWalker's filter property should default to null");
	strictEqual(nonNativeTreeWalker.filter, null, "Non-Native TreeWalker's filter property should default to null");
});

QUnitHelper.test("Verify expandEntityReferences defaults to false if no valid value is passed as input", null, function() {
	var root = this.executionContainer,
		whatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
		filter = { acceptNode: function (node) { return Cobalt.Document.Dom.NodeFilter.FILTER_ACCEPT; } },
		expandEntityReferences = undefined,
		nativeTreeWalker = new jWalker.TreeWalker(root, whatToShow, filter, expandEntityReferences),
		nonNativeTreeWalker = jWalkerTester.createNonNativeTreeWalker(root, whatToShow, filter, expandEntityReferences);

	strictEqual(nativeTreeWalker.expandEntityReferences, false, "Native TreeWalker's expandEntityReferences property should default to false");
	strictEqual(nonNativeTreeWalker.expandEntityReferences, false, "Non-Native TreeWalker's expandEntityReferences property should default to false");	
});

QUnitHelper.test("Verify core properties are set on TreeWalker after calling constructor", null, function () {
	var root = this.executionContainer,
		whatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
		filter = { acceptNode: function (node) { return Cobalt.Document.Dom.NodeFilter.FILTER_ACCEPT; } },
		expandEntityReferences = true,
		nativeTreeWalker = new jWalker.TreeWalker(root, whatToShow, filter, expandEntityReferences),
		nonNativeTreeWalker = jWalkerTester.createNonNativeTreeWalker(root, whatToShow, filter, expandEntityReferences),
		twTester = new jWalkerTester.crossBrowserTreeWalkerTester(nativeTreeWalker, nonNativeTreeWalker),
		expectedCurrentNode = root;
	twTester.verifyObjectInstance(root, whatToShow, filter, expandEntityReferences, expectedCurrentNode);
});
