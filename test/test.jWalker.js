describe('jWalker', function() {
	/* Basic structure tests */
	it('should be defined', function() {
		expect(jWalker).to.be.an('object');
	});
	it('should have a NodeType enumeration property defined', function() {
		expect(jWalker.NodeType).to.be.an('object');
	});
	it('should have a NodeTypeFilter enumeration property defined', function() {
		expect(jWalker.NodeTypeFilter).to.be.an('object');
	});
	it('should have a NodeFilter enumeration property defined', function() {
		expect(jWalker.NodeFilter).to.be.an('object');
	});

	describe("#isTreeWalkerSupportedNatively", function() {
		it('should be defined', function() {
			expect(jWalker.isTreeWalkerSupportedNatively).to.be.a('function');
		});
		it('should [typically] return true when the DOM Traversal 2.0 feature is implemented', function() {
			// Not strictly true but it SHOULD be true if browsers are not misbehaving
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(document.implementation.hasFeature("Traversal", "2.0"));
		});
		it('should return true when both the Document#createTreeWalker function and NodeFilter object are available', function() {
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(document.createTreeWalker && typeof(NodeFilter) !== "undefined");
		});
		it('can be overridden for testing purposes', function() {
			var originalFuncImpl = jWalker.isTreeWalkerSupportedNatively;

			jWalker.isTreeWalkerSupportedNatively = function() { return false; };
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(false);

			jWalker.isTreeWalkerSupportedNatively = function() { return true; };
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(true);

			jWalker.isTreeWalkerSupportedNatively = function() { return "X"; };
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal("X");

			jWalker.isTreeWalkerSupportedNatively = originalFuncImpl;
			expect(jWalker.isTreeWalkerSupportedNatively()).to.not.equal("X");
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(originalFuncImpl());
		});
	});
	
	describe('TreeWalker class', function() {
		it('should be defined', function() {
			expect(jWalker.TreeWalker).to.be.a('function');
		});
		// TODO: More tests
		it('should have more tests', function() {
			throw "Fail";
		});
	});

	describe("#createMissingNativeApi", function() {
		it('should be defined', function() {
			expect(jWalker.createMissingNativeApi).to.be.a('function');
		});
		// TODO: More tests
		it('should have more tests', function() {
			throw "Fail";
		});
	});
});