/* JSHint options: */
/*global jWalker:false, expect:false, describe:false, it:false */

describe('jWalker', function() {
	"use strict";

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

		describe('#constructor', function() {
			it('should require a Node object as its first argument ("root" parameter)', function() {
				var validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validFilter = null,
					validEER = null,
					callbackToVerifyError = function (e) {
						expect(e).to.be.a(TypeError);
						expect(e.message).to.equal("root is not a valid Node object");
					};

				// Negative tests
				expect(function() { return new jWalker.TreeWalker(); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(undefined, validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(null, validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(false, validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(true, validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker("", validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker("X", validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker([], validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(["X"], validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker({}, validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker({"X": "Y"}, validWhatToShow, validFilter, validEER); }).to.throwError(callbackToVerifyError);

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(document.createElement("a"), validWhatToShow, validFilter, validEER); }).to.not.throwError();
				expect(function() { return new jWalker.TreeWalker(document.createTextNode("X"), validWhatToShow, validFilter, validEER); }).to.not.throwError();
			});

			it('should require an Array object as its second argument ("whatToShow" parameter)', function() {
				var validNode = document.createElement("div"),
					validFilter = null,
					validEER = null,
					callbackToVerifyError = function (e) {
						expect(e).to.be.a(TypeError);
						expect(e.message).to.equal("whatToShow is not an array");
					},
					callbackToVerifyOtherError = function (e) {
						expect(e).to.be.a(TypeError);
						expect(e.message).to.not.equal("whatToShow is not an array");
					};

				// Negative tests
				expect(function() { return new jWalker.TreeWalker(validNode); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, undefined, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, null, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, false, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, true, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, "", validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, "X", validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, {}, validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, {"X": "Y"}, validFilter, validEER); }).to.throwError(callbackToVerifyError);

				// Affirmative-but-still-Negative tests
				expect(function() { return new jWalker.TreeWalker(validNode, [], validFilter, validEER); }).to.throwError(callbackToVerifyOtherError);

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, [jWalker.NodeTypeFilter.SHOW_ALL], validFilter, validEER); }).to.not.throwError();
			});
			it('should require a non-empty Array as its second argument ("whatToShow" parameter)', function() {
				var validNode = document.createElement("div"),
					validFilter = null,
					validEER = null,
					callbackToVerifyError = function (e) {
						expect(e).to.be.a(TypeError);
						expect(e.message).to.equal("whatToShow is an empty array");
					},
					callbackToVerifyOtherError = function (e) {
						expect(e).to.be.a(TypeError);
						expect(e.message).to.not.equal("whatToShow is an empty array");
					};

				// Negative tests
				expect(function() { return new jWalker.TreeWalker(validNode, [], validFilter, validEER); }).to.throwError(callbackToVerifyError);

				// Affirmative-but-still-Negative tests
				expect(function() { return new jWalker.TreeWalker(validNode, ["X"], validFilter, validEER); }).to.throwError(callbackToVerifyOtherError);

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, [jWalker.NodeTypeFilter.SHOW_ALL], validFilter, validEER); }).to.not.throwError();
			});
			it('should require that all items in the Array provided as its second argument ("whatToShow" parameter) are valid values', function() {
				var validNode = document.createElement("div"),
					validFilter = null,
					validEER = null,
					callbackToVerifyError = function (e) {
						expect(e).to.be.a(TypeError);
						expect(e.message).to.contain("whatToShow contains invalid value at index ");
					};

				// Negative tests
				expect(function() { return new jWalker.TreeWalker(validNode, ["X"], validFilter, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, [jWalker.NodeTypeFilter.SHOW_ALL, "X"], validFilter, validEER); }).to.throwError(callbackToVerifyError);

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, [jWalker.NodeTypeFilter.SHOW_ALL], validFilter, validEER); }).to.not.throwError();
				expect(function() { return new jWalker.TreeWalker(validNode, [jWalker.NodeTypeFilter.SHOW_ELEMENT], validFilter, validEER); }).to.not.throwError();
				expect(function() { return new jWalker.TreeWalker(validNode, [jWalker.NodeTypeFilter.SHOW_TEXT], validFilter, validEER); }).to.not.throwError();
				expect(function() { return new jWalker.TreeWalker(validNode, [jWalker.NodeTypeFilter.SHOW_ELEMENT, jWalker.NodeTypeFilter.SHOW_TEXT], validFilter, validEER); }).to.not.throwError();
			});

			it('should allow null as its [optional] third argument ("filter" parameter)', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validEER = null,
					filterIn = null,
					filterOut = null;

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).filter).to.equal(filterOut);
			});
			it('should allow undefined as its [optional] third argument ("filter" parameter) but default to null', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validEER = null,
					filterIn = undefined,
					filterOut = null;

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).filter).to.equal(filterOut);
			});
			it('should allow a function as its [optional] third argument ("filter" parameter)', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validEER = null,
					filterIn = function() { return "AnyFunction"; },
					filterOut = filterIn;

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).filter).to.equal(filterOut);

				// Update with a realistic filter function
				filterIn = function() { return jWalker.NodeFilter.FILTER_ACCEPT; };
				filterOut = filterIn;
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).filter).to.equal(filterOut);
			});
			it('should allow an object with an "acceptNode" function as its [optional] third argument ("filter" parameter)', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validEER = null,
					filterIn = { acceptNode: function() { return jWalker.NodeFilter.FILTER_ACCEPT; } },
					filterOut = filterIn;

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).filter).to.equal(filterOut);

				// Add other properties to the filter object; should still work as long as "acceptNode" is present
				filterIn = { acceptNode: function() { return jWalker.NodeFilter.FILTER_ACCEPT; }, sayHi: function() { return "Hi"; } };
				filterOut = filterIn;
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, filterIn, validEER)).filter).to.equal(filterOut);
			});
			it('should not allow any other types as its [optional] third argument ("filter" parameter)', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validEER = null,
					callbackToVerifyError = function (e) {
						expect(e).to.be.a(TypeError);
						expect(e.message).to.equal("filter is not a valid NodeFilter function or object");
					};

				// Negative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, false, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, true, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, "", validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, "X", validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, [], validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, ["X"], validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, {}, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, {"X": "Y"}, validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, document.createElement("a"), validEER); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, document.createTextNode("X"), validEER); }).to.throwError(callbackToVerifyError);
			});

			it('should allow null as its [optional] fourth argument ("expandEntityReferences" parameter) but default to false', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validFilter = null,
					eerIn = null,
					eerOut = false;

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn)).expandEntityReferences).to.equal(eerOut);
			});
			it('should allow undefined as its [optional] fourth argument ("expandEntityReferences" parameter) but default to false', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validFilter = null,
					eerIn = undefined,
					eerOut = false;

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn)).expandEntityReferences).to.equal(eerOut);
			});
			it('should allow a Boolean primitive of true as its [optional] fourth argument ("expandEntityReferences" parameter)', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validFilter = null,
					eerIn = true,
					eerOut = true;

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn)).expandEntityReferences).to.equal(eerOut);
			});
			it('should allow a Boolean primitive of false as its [optional] fourth argument ("expandEntityReferences" parameter)', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validFilter = null,
					eerIn = false,
					eerOut = false;

				// Affirmative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn); }).to.not.throwError();
				expect(new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn)).to.be.a(jWalker.TreeWalker);
				expect((new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, eerIn)).expandEntityReferences).to.equal(eerOut);
			});
			it('should not allow any other types as its [optional] fourth argument ("expandEntityReferences" parameter)', function() {
				var validNode = document.createElement("div"),
					validWhatToShow = [jWalker.NodeTypeFilter.SHOW_ALL],
					validFilter = null,
					callbackToVerifyError = function (e) {
						expect(e).to.be.a(TypeError);
						expect(e.message).to.equal("expandEntityReferences is not a Boolean primitive");
					};

				// Negative tests
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, new Boolean(false)); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, new Boolean(true)); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, "X"); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, ""); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, "X"); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, []); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, ["X"]); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, {}); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, {"X": "Y"}); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, function() {}); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, function() { return false; }); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, function() { return true; }); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, document.createElement("a")); }).to.throwError(callbackToVerifyError);
				expect(function() { return new jWalker.TreeWalker(validNode, validWhatToShow, validFilter, document.createTextNode("X")); }).to.throwError(callbackToVerifyError);
			});
		});

		describe('#parentNode', function() {
			it('should have more tests', function() {
				throw 'NotImplementedYetException';
			});
		});

		describe('#firstChild', function() {
			it('should have more tests', function() {
				throw 'NotImplementedYetException';
			});
		});

		describe('#lastChild', function() {
			it('should have more tests', function() {
				throw 'NotImplementedYetException';
			});
		});

		describe('#previousSibling', function() {
			it('should have more tests', function() {
				throw 'NotImplementedYetException';
			});
		});

		describe('#nextSibling', function() {
			it('should have more tests', function() {
				throw 'NotImplementedYetException';
			});
		});

		describe('#previousNode', function() {
			it('should have more tests', function() {
				throw 'NotImplementedYetException';
			});
		});

		describe('#nextNode', function() {
			it('should have more tests', function() {
				throw 'NotImplementedYetException';
			});
		});
	});

	describe('#isTreeWalkerSupportedNatively', function() {
		it('should be a defined function', function() {
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
		it('should be a defined function', function() {
			expect(jWalker.createMissingNativeApi).to.be.a('function');
		});
		// TODO: More tests
		it('should have more tests', function() {
			throw 'NotImplementedYetException';
		});
	});
});