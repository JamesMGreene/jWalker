describe('jWalker', function() {
	/* Basic structure tests */
	it('should be a defined object', function() {
		expect(jWalker).to.be.an('object');
	});

	describe('.NodeType', function() {
		it('should be a defined object', function() {
			expect(jWalker.NodeType).to.be.an('object');
		});
		it('should only contain the expected set of 12 keys', function() {
			expect(jWalker.NodeType).to.only.have.keys([
				"ELEMENT_NODE", "ATTRIBUTE_NODE", "TEXT_NODE", "CDATA_SECTION_NODE",
				"ENTITY_REFERENCE_NODE", "ENTITY_NODE", "PROCESSING_INSTRUCTION_NODE", "COMMENT_NODE",
				"DOCUMENT_NODE", "DOCUMENT_TYPE_NODE", "DOCUMENT_FRAGMENT_NODE", "NOTATION_NODE"
			]);
		});
		it("should be an enumeration equivalent to the type enumeration in the DOM's Node data type", function() {
			expect(jWalker.NodeType).to.eql({
				"ELEMENT_NODE": 1,
				"ATTRIBUTE_NODE": 2,
				"TEXT_NODE": 3,
				"CDATA_SECTION_NODE": 4,
				"ENTITY_REFERENCE_NODE": 5,
				"ENTITY_NODE": 6,
				"PROCESSING_INSTRUCTION_NODE": 7,
				"COMMENT_NODE": 8,
				"DOCUMENT_NODE": 9,
				"DOCUMENT_TYPE_NODE": 10,
				"DOCUMENT_FRAGMENT_NODE": 11,
				"NOTATION_NODE": 12
			});
		});
	});
	
	describe('.NodeTypeFilter', function() {
		it('should be a defined object', function() {
			expect(jWalker.NodeTypeFilter).to.be.an('object');
		});
		it('should only contain the expected set of 13 keys', function() {
			expect(jWalker.NodeTypeFilter).to.only.have.keys([
				"SHOW_ALL", "SHOW_ELEMENT", "SHOW_ATTRIBUTE", "SHOW_TEXT", "SHOW_CDATA_SECTION",
				"SHOW_ENTITY_REFERENCE", "SHOW_ENTITY", "SHOW_PROCESSING_INSTRUCTION", "SHOW_COMMENT",
				"SHOW_DOCUMENT", "SHOW_DOCUMENT_TYPE", "SHOW_DOCUMENT_FRAGMENT", "SHOW_NOTATION"
			]);
		});
		it("should be an enumeration equivalent to the type filtering enumeration portion of the DOM's NodeFilter data type", function() {
			expect(jWalker.NodeTypeFilter).to.eql({
				"SHOW_ALL": -1,
				"SHOW_ELEMENT": 1,
				"SHOW_ATTRIBUTE": 2,
				"SHOW_TEXT": 4,
				"SHOW_CDATA_SECTION": 8,
				"SHOW_ENTITY_REFERENCE": 16,
				"SHOW_ENTITY": 32,
				"SHOW_PROCESSING_INSTRUCTION": 64,
				"SHOW_COMMENT": 128,
				"SHOW_DOCUMENT": 256,
				"SHOW_DOCUMENT_TYPE": 512,
				"SHOW_DOCUMENT_FRAGMENT": 1024,
				"SHOW_NOTATION": 2048
			});
		});
	});
	
	describe('.NodeFilter', function() {
		it('should be a defined object', function() {
			expect(jWalker.NodeFilter).to.be.an('object');
		});
		it('should only contain the expected set of 3 keys', function() {
			expect(jWalker.NodeFilter).to.only.have.keys(["FILTER_ACCEPT", "FILTER_REJECT", "FILTER_SKIP"]);
		});
		it("should be an enumeration equivalent to the filtering action enumeration portion of the DOM's NodeFilter data type", function() {
			expect(jWalker.NodeFilter).to.eql({
				"FILTER_ACCEPT": 1,
				"FILTER_REJECT": 2,
				"FILTER_SKIP": 3
			});
		});
	});

	describe('.TreeWalker', function() {
		it('should be a defined class (function)', function() {
			expect(jWalker.TreeWalker).to.be.a('function');
		});
		// TODO: More tests
		it('should have more tests', function() {
			throw 'Fail';
		});
	});

	describe('#isTreeWalkerSupportedNatively', function() {
		it('should be defined', function() {
			expect(jWalker.isTreeWalkerSupportedNatively).to.be.a('function');
		});
		it('should [typically] return true when the DOM Traversal 2.0 feature is implemented', function() {
			// Not strictly true but it SHOULD be true if browsers are not misbehaving
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(document.implementation.hasFeature('Traversal', '2.0'));
		});
		it('should return true when both the Document#createTreeWalker function and NodeFilter object are available', function() {
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(document.createTreeWalker && typeof(NodeFilter) !== 'undefined');
		});
		it('can be overridden for testing purposes', function() {
			var originalFuncImpl = jWalker.isTreeWalkerSupportedNatively;

			jWalker.isTreeWalkerSupportedNatively = function() { return false; };
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(false);

			jWalker.isTreeWalkerSupportedNatively = function() { return true; };
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(true);

			jWalker.isTreeWalkerSupportedNatively = function() { return "X"; };
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal("X");

			// Teardown: Revert and verify
			jWalker.isTreeWalkerSupportedNatively = originalFuncImpl;
			expect(jWalker.isTreeWalkerSupportedNatively()).to.not.equal("X");
			expect(jWalker.isTreeWalkerSupportedNatively()).to.equal(originalFuncImpl());
		});
	});

	describe('#createMissingNativeApi', function() {
		it('should be defined', function() {
			expect(jWalker.createMissingNativeApi).to.be.a('function');
		});
		// TODO: More tests
		it('should have more tests', function() {
			throw 'Fail';
		});
	});
});