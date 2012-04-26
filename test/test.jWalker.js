describe('jWalker', function() {
	/* Basic structure tests */
	it('should be defined', function() {
		(typeof(jWalker)).should.equal('object');
	});
	it('should have a NodeType enumeration property defined', function() {
		(typeof(jWalker.NodeType)).should.equal('object');
	});
	it('should have a NodeTypeFilter enumeration property defined', function() {
		(typeof(jWalker.NodeTypeFilter)).should.equal('object');
	});
	it('should have a NodeFilter enumeration property defined', function() {
		(typeof(jWalker.NodeFilter)).should.equal('object');
	});

	describe("#isTreeWalkerSupportedNatively", function() {
		it('should be defined', function() {
			(typeof(jWalker.isTreeWalkerSupportedNatively)).should.equal('function');
		});
		it('should return true when the DOM Traversal 2.0 feature is implemented', function() {
			// Not strictly true but it SHOULD be true if browsers are not misbehaving
			jWalker.isTreeWalkerSupportedNatively().should.equal(document.implementation.hasFeature("Traversal", "2.0"));
		});
		it('should return true when both the Document#createTreeWalker function and NodeFilter object are available', function() {
			jWalker.isTreeWalkerSupportedNatively().should.equal(document.createTreeWalker && typeof(NodeFilter) !== "undefined");
		});
		it('can be overridden for testing purposes', function() {
			var originalFuncImpl= jWalker.isTreeWalkerSupportedNatively;

			jWalker.isTreeWalkerSupportedNatively = function() { return false; };
			jWalker.isTreeWalkerSupportedNatively().should.equal(false);

			jWalker.isTreeWalkerSupportedNatively = function() { return true; };
			jWalker.isTreeWalkerSupportedNatively().should.equal(true);

			jWalker.isTreeWalkerSupportedNatively = function() { return "X"; };
			jWalker.isTreeWalkerSupportedNatively().should.equal("X");

			jWalker.isTreeWalkerSupportedNatively = originalFuncImpl;
			jWalker.isTreeWalkerSupportedNatively().should.not.equal("X");
			jWalker.isTreeWalkerSupportedNatively().should.equal(originalFuncImpl());
		});
	});
	
	describe('TreeWalker class', function() {
		it('should be defined', function() {
			(typeof(jWalker.TreeWalker)).should.equal('function');
		});
		// TODO: More tests
		it('should have more tests', function() {
			throw "Fail";
		});
	});

	describe("#useAsNativeApis", function() {
		it('should be defined', function() {
			(typeof(jWalker.useAsNativeApis)).should.equal('function');
		});
		// TODO: More tests
		it('should have more tests', function() {
			throw "Fail";
		});
	});
});