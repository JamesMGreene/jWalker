/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param conditionCheckFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReadyFx what to do when conditionCheckFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(conditionCheckFx, onReadyFx, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function() {
			if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
				// If not time-out yet and condition not yet fulfilled
				condition = conditionCheckFx();
			} else {
				if (!condition) {
					// If condition still not fulfilled (timeout but condition is 'false')
					console.log("'waitFor()' timeout");
					phantom.exit(1);
				} else {
					// Condition fulfilled (timeout and/or condition is 'true')
					onReadyFx(); //< Do what it's supposed to do once the condition is fulfilled
					clearInterval(interval); //< Stop this interval
				}
			}
		}, 250); //< repeat check every 250ms
}

if (phantom.args.length === 0 || phantom.args.length > 2) {
	console.log('Usage: phantom-mocha.js URL');
	phantom.exit(1);
}

var page = new WebPage();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.open(phantom.args[0], function(status) {
	if (status !== "success") {
		console.log("Unable to access network");
		phantom.exit(1);
	} else {
		waitFor(function() {
			return page.evaluate(function() {
				return (typeof(this.mochaFailures) !== 'undefined');
			});
		}, function() {
			var failedNum = page.evaluate(function() {
				return this.mochaFailures;
			});
			var failedNumInDec = parseInt(failedNum, 10);
			console.log("Test failures: " + failedNumInDec);
			phantom.exit((failedNumInDec > 0) ? 1 : 0);
		},
		10000);
	}
});