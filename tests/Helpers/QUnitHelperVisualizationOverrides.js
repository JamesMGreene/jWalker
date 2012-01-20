VisualizationHelper = {
	translateTestDataIntoVisualizationData: function VisualizationHelper$translateTestDataIntoVisualizationData(visElementId, testData) {
		if (testData == null) {
			return null;
		}

		debugger;

		/*
		container: function () { return QUnit.current_testEnvironment.executionContainer; },
		html: function () { return "<div></div>"; },
		// Set TreeWalker constructor arguments
		root: function () { return this.container().firstChild; }, // div
		whatToShow: function () { return [jWalker.NodeTypeFilter.SHOW_TEXT]; },
		filter: function () { return null; },
		expandEntityReferences: function () { return false; },
		// Set walk-related properties
		startNode: function () { return this.root(); }, // div
		walk: function () {
			return [{
				type: jWalkerTester.StepType.parentNode,
				expected_root: this.root(),
				expected_currentNode: this.root(),
				expectedResultNode: null
			}];
		}
		*/

		var container = testData.container();
		container.innerHTML = testData.html();
		var temp = container.firstChild,
			elCount = 0,
			textCount = 1;

		function processNode(node) {
			var nodeVisData;
			if (node.nodeType === 1) {
				nodeVisData = {
					id: visElementId + "_element" + elCount++,
					name: node.nodeName,
					data: { "$type": "circle" },
					children: []
				};
				for (var c = 0, len = node.childNodes; c < len; c++) {
					nodeVisData.children.push(processNode(node.childNodes[c]));
				}
			}
			else if (node.nodeType === 3) {
				nodeVisData = {
					id: visElementId + "_text" + textCount++,
					name: node.nodeName,
					data: { "$type": "triangle" }
				};
			}
			return nodeVisData;
		}

		var visData = processNode(temp);
		// Update values on root
		visData.id = visElementId + "_root";
		visData.data = { "$type": "rectangle", "$color": "#FF7" /* Gold */ };

		// Clear out the test data
		container.innerHTML = "";

		return visData;
	},

	// Prepare a new container element and append it to the DOM
	prepareVisualizationContainer: function VisualizationHelper$prepareVisualizationContainer(visElementId, visContainer) {
		var testVisDiv = document.createElement("div");
		testVisDiv.id = visElementId;
		visContainer.appendChild(testVisDiv);
		return testVisDiv;
	},

	/*
	* For visualization:
	* http://thejit.org/static/v20/Jit/Examples/Spacetree/example3.html
	*/
	visualize: function VisualizationHelper$visualize(visElementId, visData) {
		var testVisDiv = document.getElementById(visElementId);

		if (visData == null) {
			testVisDiv.innerHTML = "<em>There is no visualization data associated with this test.</em>";
		}
		else {
			var spaceTree = new $jit.ST({
				//id of viz container element  
				injectInto: visElementId,
				// orientation of the graph tree
				orientation: "top",
				//set duration for the animation  
				duration: 800,
				//set animation transition type  
				transition: $jit.Trans.Quart.easeInOut,
				//set distance between node and its children  
				levelDistance: 50,
				//enable panning  
				Navigation: {
					enable: false,
					panning: false
				},
				//set node and edge styles  
				//set overridable=true for styling individual nodes or edges  
				Node: {
					height: 20,
					width: 60,
					type: 'circle',  // elementNode = 'circle', textNode = 'triangle'
					color: '#aaa',
					overridable: true
				},

				Edge: {
					type: 'bezier',
					overridable: true
				},

				onBeforeCompute: function (node) {
					//Log.write("loading " + node.name);
				},

				onAfterCompute: function () {
					//Log.write("done");
				},

				//This method is called on DOM label creation.  
				//Use this method to add event handlers and styles to  
				//your node.  
				onCreateLabel: function (label, node) {
					label.id = node.id;
					label.innerHTML = node.name;
					label.onclick = function () {
						if (normal.checked) {
							st.onClick(node.id);
						}
						else {
							st.setRoot(node.id, 'animate');
						}
					};
					//set label styles  
					var style = label.style;
					style.width = 60 + 'px';
					style.height = 17 + 'px';
					style.cursor = 'pointer';
					style.color = '#333';
					style.fontSize = '0.8em';
					style.textAlign = 'center';
					style.paddingTop = '3px';
				},

				//This method is called right before plotting  
				//a node. It's useful for changing an individual node  
				//style properties before plotting it.  
				//The data properties prefixed with a dollar  
				//sign will override the global node style properties.  
				onBeforePlotNode: function (node) {
					//add some color to the nodes in the path between the  
					//root node and the selected node.  
					if (node.selected) {
						node.data.$color = "#ff7";
					}
					else {
						delete node.data.$color;
						//if the node belongs to the last plotted level  
						if (!node.anySubnode("exist")) {
							//count children number  
							var count = 0;
							node.eachSubnode(function (n) { count++; });
							//assign a node color based on how many children it has  
							node.data.$color = ['#aaa', '#baa', '#caa', '#daa', '#eaa', '#faa'][count];
						}
					}
				},

				//This method is called right before plotting  
				//an edge. It's useful for changing an individual edge  
				//style properties before plotting it.  
				//Edge data proprties prefixed with a dollar sign will  
				//override the Edge global style properties.  
				onBeforePlotLine: function (adj) {
					if (adj.nodeFrom.selected && adj.nodeTo.selected) {
						adj.data.$color = "#eed";
						adj.data.$lineWidth = 3;
					}
					else {
						delete adj.data.$color;
						delete adj.data.$lineWidth;
					}
				}
			});

			// Load JSON data
			spaceTree.loadJSON(visData);
			// Compute node positions and layout
			spaceTree.compute();
			// Optional: make a translation of the tree
			spaceTree.geom.translate(new $jit.Complex(-200, 0), "current");
			// Emulate a click on the root node.
			spaceTree.onClick(spaceTree.root);
		}
		return testVisDiv;
	}
};

// Override the helper functionality to visualize instead of running tests
QUnitHelper.test = function QUnitHelper$visualize(testName, inputData /*, callback */) {
	var expected = undefined,
		async = undefined,
		revisedCallback = function () {
			this.testData = inputData;

			var visHelper = VisualizationHelper,
 				visElementId = testName.replace(/\s/g, '_').replace(/\,/g, '-') + "_infovis",
				visData = visHelper.translateTestDataIntoVisualizationData(visElementId, inputData),
				visElement = visHelper.prepareVisualizationContainer(visElementId, this.executionContainer);
			visHelper.visualize(visElementId, visData);

			// Manually add the visualization as a passed assertion
			QUnit.config.current.assertions.push({ result: true, message: visElement.innerHTML });
		};
	return QUnit.test(testName, expected, revisedCallback, async);
};