/* JSHint options: */
/*global jWalker:false, Node:true, NodeFilter:true */

(function(window, undefined) {
	"use strict";

	var jWalker$Lang = {
			/**
			* @see jWalker.Lang#hasOwn
			*/
			hasOwn: function jWalker$Lang$hasOwn(obj, prop) {
				return Object.prototype.hasOwnProperty.call(obj, prop);
			},

			/**
			* @see jWalker.Lang#getEnumName
			*/
			getEnumName: function jWalker$Lang$getEnumName(enumObject, enumValue) {
				var hasOwn = jWalker$Lang.hasOwn;
				// Verify the enumObject is a valid object and the enumValue is a valid integer
				if (enumObject && typeof(enumObject) === "object" &&
					typeof(enumValue) === "number" && enumValue.toString().indexOf(".") === -1) {
					for (var propName in enumObject) {
						if (hasOwn(enumObject, propName) && enumObject[propName] === enumValue) {
							return propName;
						}
					}
				}
				return null;
			}
		},

		/**
		* TWWalker provides some testing utilities necessary to reduce the verbosity of properly testing the traversal
		* functions within {@link jWalker.TreeWalker}.
		* @namespace
		*/
		TWTester = {
			/**
			* An enumeration of possible traversal step types corresponding to the finite set of traversal functions
			* that a {@link jWalker.TreeWalker} is capable of.
			*/
			StepType: {
				parentNode: 0,
				firstChild: 1,
				lastChild: 2,
				previousSibling: 3,
				nextSibling: 4,
				previousNode: 5,
				nextNode: 6
			},

			/**
			* A representation of a traversal step, including its type and the expected outcome.
			* @constructor
			* @param {TWTester.StepType} stepType
			* @param {Node} expected_result The Node expected to return as a result of the traversal step operation.
			* @param {Node} expected_root The expected value of the "root" property after the traversal step operation.
			* @param {Node} expected_currentNode The expected value of the "currentNode" property after the traversal step operation.
			*/
			Step: function(stepType, expected_result, expected_root, expected_currentNode) {
				return {
					type: stepType,
					expected: {
						result: expected_result,
						currentNode: expected_currentNode,
						root: expected_root
					}
				};
			},

			/**
			* Create a {@link jWalker.TreeWalker} instance that is guaranteed to NOT utilize a native TreeWalker
			* internally, regardless of browser capabilities.
			* @param {Node} root The node to start walking from. The walk results will only include descendant nodes of this one, not this node itself.
			* @param {jWalker.NodeTypeFilter[]} whatToShow An array of {@link jWalker.NodeTypeFilter} values.
			* @param {NodeFilter} [filter=null] An object containing an acceptNode function to act as a visitor filter to the tree nodes. Can be null.
			* @param {Boolean} [expandEntityReferences=false] Indicates whether or not to expand entity references.
			* @returns {jWalker.TreeWalker} A {@link jWalker.TreeWalker} instance without an internal native TreeWalker.
			*/
			createNonNativeTreeWalker: function TWTester$createNonNativeTreeWalker(root, whatToShow, filter, expandEntityReferences) {
				var originalDef = jWalker.isTreeWalkerSupportedNatively;
				try
				{
					jWalker.isTreeWalkerSupportedNatively = function () { return false; };
					return new jWalker.TreeWalker(root, whatToShow, filter, expandEntityReferences);
				}
				finally
				{
					jWalker.isTreeWalkerSupportedNatively = originalDef;
				}
			},

			/**
			* A test executor and verifier to compare two instances of {@link jWalker.TreeWalker}: one which is
			* utilizing a native TreeWalker internally IF it is available in this browser; and the other which is
			* NOT utilizing a native TreeWalker, regardless of browser. This validates that {@link jWalker.TreeWalker}
			* class does indeed satisfy the same requirements of the specification as the native TreeWalker class.
			* @class Test executor and verifier for {@link jWalker.TreeWalker}
			* @param {jWalker.TreeWalker} nativeTreeWalker A {@link jWalker.TreeWalker} instance that is utilizing a native TreeWalker internally IF it is available in this browser.
			* @param {jWalker.TreeWalker} nonNativeTreeWalker A {@link jWalker.TreeWalker} instance that is NOT utilizing a native TreeWalker internally, regardless of browser.
			* @param {Function} assertEqual A function, possibly wrapped, to verify strict equality, which will be executed with arguments: actual, expected, message.
			* @returns {Object} A test executor and verifier.
			*/
			createCrossBrowserTreeWalkerTester: function TWTester$createCrossBrowserTreeWalkerTester(nativeTreeWalker, nonNativeTreeWalker, assertEqual) {
				var hiddenTester = {
					isStepVerifiable: function(step) {
						var hasOwn = jWalker$Lang.hasOwn;
						return step && hasOwn(step, "type") && hasOwn(step, "expected") &&
							hasOwn(step.expected, "result") &&
							hasOwn(step.expected, "currentNode") &&
							hasOwn(step.expected, "root");
					},
					verifyStep: function(treeWalkerType, actual, expected, stepNum) {
						var stepText = stepNum != null ? " after Step " + stepNum : "";
						assertEqual(actual.result, expected.result, treeWalkerType + " TreeWalker's result node should match expected value" + stepText);
						assertEqual(actual.currentNode, expected.currentNode, treeWalkerType + " TreeWalker's property 'currentNode' should match expected value" + stepText);
						assertEqual(actual.root, expected.root, treeWalkerType + " TreeWalker's property 'root' should match expected value" + stepText);
					},
					verify_parentNode: function(expected, stepNum) {
						var nativeActual = {
								result: nativeTreeWalker.parentNode(),
								currentNode: nativeTreeWalker.currentNode,
								root: nativeTreeWalker.root
							},
							nonNativeActual = {
								result: nonNativeTreeWalker.parentNode(),
								currentNode: nonNativeTreeWalker.currentNode,
								root: nonNativeTreeWalker.root
							};
						hiddenTester.verifyStep("Native", nativeActual, expected, stepNum);
						hiddenTester.verifyStep("Non-Native", nonNativeActual, expected, stepNum);
					},
					verify_firstChild: function(expected, stepNum) {
						var nativeActual = {
								result: nativeTreeWalker.firstChild(),
								currentNode: nativeTreeWalker.currentNode,
								root: nativeTreeWalker.root
							},
							nonNativeActual = {
								result: nonNativeTreeWalker.firstChild(),
								currentNode: nonNativeTreeWalker.currentNode,
								root: nonNativeTreeWalker.root
							};
						hiddenTester.verifyStep("Native", nativeActual, expected, stepNum);
						hiddenTester.verifyStep("Non-Native", nonNativeActual, expected, stepNum);
					},
					verify_lastChild: function(expected, stepNum) {
						var nativeActual = {
								result: nativeTreeWalker.lastChild(),
								currentNode: nativeTreeWalker.currentNode,
								root: nativeTreeWalker.root
							},
							nonNativeActual = {
								result: nonNativeTreeWalker.lastChild(),
								currentNode: nonNativeTreeWalker.currentNode,
								root: nonNativeTreeWalker.root
							};
						hiddenTester.verifyStep("Native", nativeActual, expected, stepNum);
						hiddenTester.verifyStep("Non-Native", nonNativeActual, expected, stepNum);
					},
					verify_previousSibling: function(expected, stepNum) {
						var nativeActual = {
								result: nativeTreeWalker.previousSibling(),
								currentNode: nativeTreeWalker.currentNode,
								root: nativeTreeWalker.root
							},
							nonNativeActual = {
								result: nonNativeTreeWalker.previousSibling(),
								currentNode: nonNativeTreeWalker.currentNode,
								root: nonNativeTreeWalker.root
							};
						hiddenTester.verifyStep("Native", nativeActual, expected, stepNum);
						hiddenTester.verifyStep("Non-Native", nonNativeActual, expected, stepNum);
					},
					verify_nextSibling: function(expected, stepNum) {
						var nativeActual = {
								result: nativeTreeWalker.nextSibling(),
								currentNode: nativeTreeWalker.currentNode,
								root: nativeTreeWalker.root
							},
							nonNativeActual = {
								result: nonNativeTreeWalker.nextSibling(),
								currentNode: nonNativeTreeWalker.currentNode,
								root: nonNativeTreeWalker.root
							};
						hiddenTester.verifyStep("Native", nativeActual, expected, stepNum);
						hiddenTester.verifyStep("Non-Native", nonNativeActual, expected, stepNum);
					},
					verify_previousNode: function(expected, stepNum) {
						var nativeActual = {
								result: nativeTreeWalker.previousNode(),
								currentNode: nativeTreeWalker.currentNode,
								root: nativeTreeWalker.root
							},
							nonNativeActual = {
								result: nonNativeTreeWalker.previousNode(),
								currentNode: nonNativeTreeWalker.currentNode,
								root: nonNativeTreeWalker.root
							};
						hiddenTester.verifyStep("Native", nativeActual, expected, stepNum);
						hiddenTester.verifyStep("Non-Native", nonNativeActual, expected, stepNum);
					},
					verify_nextNode: function(expected, stepNum) {
						var nativeActual = {
								result: nativeTreeWalker.nextNode(),
								currentNode: nativeTreeWalker.currentNode,
								root: nativeTreeWalker.root
							},
							nonNativeActual = {
								result: nonNativeTreeWalker.nextNode(),
								currentNode: nonNativeTreeWalker.currentNode,
								root: nonNativeTreeWalker.root
							};
						hiddenTester.verifyStep("Native", nativeActual, expected, stepNum);
						hiddenTester.verifyStep("Non-Native", nonNativeActual, expected, stepNum);
					},
					execute_parentNode: function() {
						nativeTreeWalker.parentNode();
						nonNativeTreeWalker.parentNode();
					},
					execute_firstChild: function() {
						nativeTreeWalker.firstChild();
						nonNativeTreeWalker.firstChild();
					},
					execute_lastChild: function() {
						nativeTreeWalker.lastChild();
						nonNativeTreeWalker.lastChild();
					},
					execute_previousSibling: function() {
						nativeTreeWalker.previousSibling();
						nonNativeTreeWalker.previousSibling();
					},
					execute_nextSibling: function() {
						nativeTreeWalker.nextSibling();
						nonNativeTreeWalker.nextSibling();
					},
					execute_previousNode: function() {
						nativeTreeWalker.previousNode();
						nonNativeTreeWalker.previousNode();
					},
					execute_nextNode: function() {
						nativeTreeWalker.nextNode();
						nonNativeTreeWalker.nextNode();
					}
				};

				// Public API
				return {
					/**
					* Verify a walk composed of a series of {@link TWTester.Step} items.
					* @param {TWTester.Step[]} walk
					* @void
					*/
					verifyWalk: function TWTester$createCrossBrowserTreeWalkerTester$verifyWalk(walk) {
						var TWTester$StepType = TWTester.StepType,
							jWalker$Lang$getEnumName = jWalker$Lang.getEnumName,
							stepNum,
							totalSteps,
							step,
							stepTypeName;

						for (stepNum = 0, totalSteps = walk.length; stepNum < totalSteps; stepNum++) {
							step = walk[stepNum];
							stepTypeName = jWalker$Lang$getEnumName(TWTester$StepType, step.type);

							if (hiddenTester.isStepVerifiable(step)) {
								hiddenTester["verify_" + stepTypeName].call(this, step.expected, stepNum);
							}
							else if (stepTypeName !== null) {
								hiddenTester["execute_" + stepTypeName].call(this);
							}
							else {
								throw "Step " + stepNum + " was not an expected StepType: " + step.type;
							}
						}
					}
				};
			}
		};

	// Expose TWTester to the global object
	window.TWTester = TWTester;
})(this);