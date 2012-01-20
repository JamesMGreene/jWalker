QUnitHelper = {
	test: function QUnitHelper$test(testName, inputData, callback) {
		var expected = undefined,
			async = undefined,
			revisedCallback = function() {
				this.testData = inputData;
				callback.apply(this);
			};
		return QUnit.test(testName, expected, revisedCallback, async);
	}
};