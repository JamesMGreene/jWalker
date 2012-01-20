jWalkerTester = {
	containerId: "qunit-fixture",

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
	* Get the property name of a given value within this enumeration object.
	* @param {Object} enumObject The current enumeration object.
	* @param {Number} enumValue The value of the property whose name is being sought.
	* @returns The name of the property, if present; otherwise null.
	* @type String
	*/
	getEnumName: function jWalkerTester$getEnumName(enumObject, enumValue)
	{
		// Verify the enumObject is a valid object and the enumValue is a valid integer
		if (enumObject && (typeof (enumObject)).toLowerCase() === "object" &&
			(typeof (enumValue)).toLowerCase() === "number" && (new String(enumValue)).indexOf(".") === -1)
		{
			for (var propName in enumObject)
			{
				if (enumObject[propName] === enumValue)
				{
					return propName;
				}
			}
		}
		return null;
	},

	createNonNativeTreeWalker: function jWalkerTester$createNonNativeTreeWalker(root, whatToShow, filter, expandEntityReferences)
	{
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

	crossBrowserTreeWalkerTester: function jWalkerTester$crossBrowserTreeWalkerTester(nativeTreeWalker, nonNativeTreeWalker)
	{
		function _isStepVerifiable(step)
		{
			return step && step.hasOwnProperty("type") && step.hasOwnProperty("expected_root") && step.hasOwnProperty("expected_currentNode") && step.hasOwnProperty("expectedResultNode");
		}

		function _verifyResultsOfNormalFunctions(treeWalkerType, treeWalker, actualResultNode, expected_root, expected_currentNode, expectedResultNode, walkStepNumber)
		{
			var stepText = walkStepNumber != null ? " after Step " + walkStepNumber : "";
			strictEqual(treeWalker.root, expected_root, treeWalkerType + " TreeWalker's property 'root' should match expected value" + stepText);
			strictEqual(treeWalker.currentNode, expected_currentNode, treeWalkerType + " TreeWalker's property 'currentNode' should match expected value" + stepText);
			strictEqual(actualResultNode, expectedResultNode, treeWalkerType + " TreeWalker's result node should match expected value" + stepText);
		}

		this.verifyObjectInstance = function (expected_root, expected_whatToShow, expected_filter, expected_expandEntityReferences, expected_currentNode)
		{
			var undefinedType = "undefined";
			// Private verification method
			function _verifyCommonAspectsOfTreeWalkerInit(treeWalkerType, treeWalker, expected_root, expected_whatToShow, expected_filter, expected_expandEntityReferences, expected_currentNode)
			{
				// Verify construction of object
				strictEqual((typeof(treeWalker)).toLowerCase(), "object", "Constructor should create a " + treeWalkerType + " TreeWalker object");

				// Verify existence and type of properties
				strictEqual((typeof(treeWalker.root)).toLowerCase(), "object", treeWalkerType + " TreeWalker should have property 'root' of type 'object'");
				strictEqual((typeof(treeWalker.whatToShow)).toLowerCase(), "object", treeWalkerType + " TreeWalker should have property 'whatToShow' of type 'object'");
				strictEqual((typeof(treeWalker.filter)).toLowerCase(), "object", treeWalkerType + " TreeWalker should have property 'filter' of type 'object'");
				strictEqual((typeof(treeWalker.expandEntityReferences)).toLowerCase(), "boolean", treeWalkerType + " TreeWalker should have property 'expandEntityReferences' of type 'boolean'");
				strictEqual((typeof(treeWalker.currentNode)).toLowerCase(), "object", treeWalkerType + " TreeWalker should have property 'currentNode' of type 'object'");

				// Verify value of properties
				strictEqual(treeWalker.root, expected_root, treeWalkerType + " TreeWalker's property 'root' should match expected value");
				strictEqual(treeWalker.whatToShow, expected_whatToShow, treeWalkerType + " TreeWalker's property 'whatToShow' should match expected value");
				strictEqual(treeWalker.filter, expected_filter, treeWalkerType + " TreeWalker's property 'filter' should match expected value");
				strictEqual(treeWalker.expandEntityReferences, expected_expandEntityReferences, treeWalkerType + " TreeWalker's property 'expandEntityReferences' should match expected value");
				strictEqual(treeWalker.currentNode, expected_currentNode, treeWalkerType + " TreeWalker's property 'currentNode' should match expected value");

				// Verify existence of functions
				strictEqual((typeof(treeWalker.parentNode)).toLowerCase(), "function", treeWalkerType + " TreeWalker should have function: parentNode");
				strictEqual((typeof(treeWalker.firstChild)).toLowerCase(), "function", treeWalkerType + " TreeWalker should have function: firstChild");
				strictEqual((typeof(treeWalker.lastChild)).toLowerCase(), "function", treeWalkerType + " TreeWalker should have function: lastChild");
				strictEqual((typeof(treeWalker.previousSibling)).toLowerCase(), "function", treeWalkerType + " TreeWalker should have function: previousSibling");
				strictEqual((typeof(treeWalker.nextSibling)).toLowerCase(), "function", treeWalkerType + " TreeWalker should have function: nextSibling");
				strictEqual((typeof(treeWalker.previousNode)).toLowerCase(), "function", treeWalkerType + " TreeWalker should have function: previousNode");
				strictEqual((typeof(treeWalker.nextNode)).toLowerCase(), "function", treeWalkerType + " TreeWalker should have function: nextNode");
			}

			_verifyCommonAspectsOfTreeWalkerInit("Native", nativeTreeWalker, expected_root, expected_whatToShow, expected_filter, expected_expandEntityReferences, expected_currentNode);
			_verifyCommonAspectsOfTreeWalkerInit("Non-Native", nonNativeTreeWalker, expected_root, expected_whatToShow, expected_filter, expected_expandEntityReferences, expected_currentNode);
		};

		this.verifyWalk = function (walk)
		{
			for (var stepNum = 0, totalSteps = walk.length; stepNum < totalSteps; stepNum++)
			{
				var step = walk[stepNum],
					stepTypeName = jWalkerTester.getEnumName(jWalkerTester.StepType, step.type);

				if (_isStepVerifiable(step))
				{
					this["verify_" + stepTypeName].call(this, step.expected_root, step.expected_currentNode, step.expectedResultNode, stepNum);
				}
				else if (stepTypeName != null)
				{
					this["execute_" + stepTypeName].call(this);
				}
				else
				{
					throw "Step " + stepNum + " was not an expected StepType: " + step.type;
				}
			}
		};

		this.verify_parentNode = function (expected_root, expected_currentNode, expectedResultNode, walkStepNumber)
		{
			_verifyResultsOfNormalFunctions("Native", nativeTreeWalker, nativeTreeWalker.parentNode(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
			_verifyResultsOfNormalFunctions("Non-Native", nonNativeTreeWalker, nonNativeTreeWalker.parentNode(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
		};
		this.verify_firstChild = function (expected_root, expected_currentNode, expectedResultNode, walkStepNumber)
		{
			_verifyResultsOfNormalFunctions("Native", nativeTreeWalker, nativeTreeWalker.firstChild(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
			_verifyResultsOfNormalFunctions("Non-Native", nonNativeTreeWalker, nonNativeTreeWalker.firstChild(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
		};
		this.verify_lastChild = function (expected_root, expected_currentNode, expectedResultNode, walkStepNumber)
		{
			_verifyResultsOfNormalFunctions("Native", nativeTreeWalker, nativeTreeWalker.lastChild(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
			_verifyResultsOfNormalFunctions("Non-Native", nonNativeTreeWalker, nonNativeTreeWalker.lastChild(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
		};
		this.verify_previousSibling = function (expected_root, expected_currentNode, expectedResultNode, walkStepNumber)
		{
			_verifyResultsOfNormalFunctions("Native", nativeTreeWalker, nativeTreeWalker.previousSibling(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
			_verifyResultsOfNormalFunctions("Non-Native", nonNativeTreeWalker, nonNativeTreeWalker.previousSibling(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
		};
		this.verify_nextSibling = function (expected_root, expected_currentNode, expectedResultNode, walkStepNumber)
		{
			_verifyResultsOfNormalFunctions("Native", nativeTreeWalker, nativeTreeWalker.nextSibling(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
			_verifyResultsOfNormalFunctions("Non-Native", nonNativeTreeWalker, nonNativeTreeWalker.nextSibling(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
		};
		this.verify_previousNode = function (expected_root, expected_currentNode, expectedResultNode, walkStepNumber)
		{
			_verifyResultsOfNormalFunctions("Native", nativeTreeWalker, nativeTreeWalker.previousNode(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
			_verifyResultsOfNormalFunctions("Non-Native", nonNativeTreeWalker, nonNativeTreeWalker.previousNode(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
		};
		this.verify_nextNode = function (expected_root, expected_currentNode, expectedResultNode, walkStepNumber)
		{
			_verifyResultsOfNormalFunctions("Native", nativeTreeWalker, nativeTreeWalker.nextNode(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
			_verifyResultsOfNormalFunctions("Non-Native", nonNativeTreeWalker, nonNativeTreeWalker.nextNode(), expected_root, expected_currentNode, expectedResultNode, walkStepNumber);
		};

		this.execute_parentNode = function ()
		{
			nativeTreeWalker.parentNode();
			nonNativeTreeWalker.parentNode();
		};
		this.execute_firstChild = function ()
		{
			nativeTreeWalker.firstChild();
			nonNativeTreeWalker.firstChild();
		};
		this.execute_lastChild = function ()
		{
			nativeTreeWalker.lastChild();
			nonNativeTreeWalker.lastChild();
		};
		this.execute_previousSibling = function ()
		{
			nativeTreeWalker.previousSibling();
			nonNativeTreeWalker.previousSibling();
		};
		this.execute_nextSibling = function ()
		{
			nativeTreeWalker.nextSibling();
			nonNativeTreeWalker.nextSibling();
		};
		this.execute_previousNode = function ()
		{
			nativeTreeWalker.previousNode();
			nonNativeTreeWalker.previousNode();
		};
		this.execute_nextNode = function ()
		{
			nativeTreeWalker.nextNode();
			nonNativeTreeWalker.nextNode();
		};
	}
}