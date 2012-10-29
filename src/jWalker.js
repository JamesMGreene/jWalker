/**
* jWalker v0.5
* http://jamesmgreene.github.com/jWalker/
*
* @author James Greene
* @copyright Copyright © 2012: James Greene (Team Gunmetal, Inc.)
* @license MIT (http://www.opensource.org/licenses/mit-license.php)
* @language JavaScript
*/

/* JSHint options: */
/*global */
/*jshint browser:true, evil:false, asi:false, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, latedef:true, newcap:true, nonew:true, curly:true, plusplus:false, quotmark:true, regexp:true, indent:4, multistr:false, white:false, funcscope:true, maxerr:50 */

(function(window, undefined) {
	/*jshint white:true */
	"use strict";
	
	// Use the correct document accordingly with window argument (sandbox)
	var document = window.document,
		_undefinedType = "undefined",
		_isNodeDefined = (typeof window.Node !== _undefinedType),
		_node = (_isNodeDefined ? window.Node : undefined),
		_isNodeFilterDefined = (typeof window.NodeFilter !== _undefinedType),
		_nodeFilter = (_isNodeFilterDefined ? window.NodeFilter : undefined),
		_isCreateTreeWalkerDefined = (typeof document.createTreeWalker === "function"),

		/**
		* The jWalker.Lang object contains a number of utility functions for the language that are needed for jWalker.
		* @name jWalker.Lang
		* @private
		* @namespace
		*/
		jWalker$Lang = {
			/**
			* Safer Object.hasOwnProperty
			* @name jWalker.Lang.hasOwn
			* @version 0.1.0 (2012-01-19)
			* @author Miller Medeiros
			* @see https://github.com/millermedeiros/amd-utils/blob/master/src/object/hasOwn.js
			*/
			hasOwn: function jWalker$Lang$hasOwn(obj, prop) {
				return Object.prototype.hasOwnProperty.call(obj, prop);
			},

			/**
			* Combine properties from all the objects into first one.
			* - This method affects target object in place, if you want to create a new Object pass an empty object as first param.
			* @name jWalker.Lang.mixIn
			* @param {object} target Target Object
			* @param {...object} rest Objects to be combined (0...n objects).
			* @returns {object} Target Object.
			*/
			mixIn: function jWalker$Lang$mixIn(target /*, ...rest */) {
				var hasOwn = jWalker$Lang.hasOwn,
					i,
					len,
					key,
					cur;
				
				for (i = 1, len = arguments.length; i < len; i++) {
					cur = arguments[i];
					if (cur) {
						for (key in cur) {
							if (hasOwn(cur, key)) {
								target[key] = cur[key];
							}
						}
					}
				}
				return target;
			},

			/**
			* Get the property name of a given value within an enumeration.
			* @name jWalker.Lang.getEnumName
			* @param {Object} enumObject The current enumeration object.
			* @param {Number} enumValue The value of the property whose name is being sought.
			* @returns {String} The name of the property, if present; otherwise null.
			*/
			getEnumName: function jWalker$Lang$getEnumName(enumObject, enumValue) {
				var hasOwn = jWalker$Lang.hasOwn;
				// Verify the enumObject is a valid object and the enumValue is a valid integer
				if (enumObject && typeof enumObject === "object" &&
					typeof enumValue === "number" && enumValue.toString().indexOf(".") === -1) {
					for (var propName in enumObject) {
						if (hasOwn(enumObject, propName) && enumObject[propName] === enumValue) {
							return propName;
						}
					}
				}
				return null;
			},

			/**
			* Check if a given object is a native JavaScript Array.
			* @name jWalker.Lang.isArray
			* @param {Object} potentialArray Required. The object to check.
			* @returns {Boolean} True if the object is a native JavaScript Array, otherwise false.
			*/
			isArray: function jWalker$Lang$isArray(potentialArray) {
				var returnValue = false;
				if (potentialArray && (typeof potentialArray === "object")) {
					if (potentialArray.constructor) {
						var constructorText = potentialArray.constructor.toString().replace(/\s+/g, " ");
						if (constructorText === "function Array() { [native code] }") {
							returnValue = true;
						}
					}
				}
				return returnValue;
			},

			/**
			* Gets the index of an item in an array.
			* @name jWalker.Lang.arrayIndexOf
			* @param {Array} someArray The current class type.
			* @param {Object} item The current class type.
			* @returns {Number} The first index of the item in the array, if present; otherwise -1.
			*/
			arrayIndexOf: function jWalker$Lang$arrayIndexOf(someArray, item) {
				if (jWalker$Lang.isArray(someArray)) {
					// Many non-IE browsers have already implemented Array.indexOf
					if (typeof someArray.indexOf === "function") {
						return someArray.indexOf(item);
					}
					else {
						for (var i = 0, len = someArray.length; i < len; i++) {
							if (someArray[i] === item) {
								return i;
							}
						}
					}
					return -1;
				}
				else {
					throw new TypeError("someArray was not an array");
				}
			}
		},

		jWalker$NodeTypeFilter = {
			/**
			 * Gets the {@link jWalker.NodeTypeFilter} corresponding to the provided {@link jWalker.NodeType}.
			 * @name jWalker.NodeTypeFilter.getFromNodeType
			 * @private
			 * @param {jWalker.NodeType} nodeType The {@link jWalker.NodeType} for which the corresponding {@link jWalker.NodeTypeFilter} is desired.
			 * @returns {jWalker.NodeTypeFilter} The {@link jWalker.NodeTypeFilter} corresponding to the provided {@link jWalker.NodeType}.
			 */
			getFromNodeType: function jWalker$NodeTypeFilter$getFromNodeType(nodeType) {
				if (nodeType && typeof nodeType === "number" && nodeType.toString().indexOf(".") === -1) {
					var name = jWalker$Lang.getEnumName(jWalker.NodeType, nodeType);
					if (name !== null) {
						var nodeTypeFilterName = "SHOW_" + name.replace(/_NODE$/, "");
						return jWalker.NodeTypeFilter[nodeTypeFilterName];
					}
				}
				return null;
			},

			/**
			 * Indicates whether or not the {@link jWalker.NodeTypeFilter} array contains a filter that will make it show element node types.
			 * @name jWalker.NodeTypeFilter.showsElements
			 * @private
			 * @param {jWalker.NodeTypeFilter[]} nodeTypeFilters The {@link jWalker.NodeTypeFilter} array to look through.
			 * @returns {boolean} True if should show element node types; otherwise false.
			 */
			showsElements: function jWalker$NodeTypeFilter$showsElements(nodeTypeFilters) {
				var NodeTypeFilter = jWalker.NodeTypeFilter;  // Localize
				// If NOT including elements in the logical view
				return !(jWalker$Lang.arrayIndexOf(nodeTypeFilters, NodeTypeFilter.SHOW_ALL) === -1 &&
					jWalker$Lang.arrayIndexOf(nodeTypeFilters, NodeTypeFilter.SHOW_ELEMENT) === -1);
			}
		},

		/**
		* jWalker provides a well-tested, cross-browser JavaScript implementation of the
		* {@link <a href="http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal#TreeWalker">TreeWalker</a>}
		* class defined in the
		* {@link <a href="http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal">W3C specification for DOM Traversal (DOM Level 2)</a>}.
		* This bridges the gap left by Internet Explorer browsers less than IE9 (as well as IE9+ when used in IE7/IE8
		* compatibility mode) when trying to use TreeWalkers. It also addresses a
		* {@link <a href="https://bugs.webkit.org/show_bug.cgi?id=35296">WebKit bug that the creators of jWalker reported</a>}
		* that has since been {@link <a href="http://trac.webkit.org/changeset/65853">resolved</a>} but still exists in
		* older versions of WebKit browsers (e.g. Safari, Chrome). Unfortunately, the same issue also exists in IE9+
		* but has not yet been fixed.
		* @namespace
		*/
		jWalker = {
			/**
			* An enumeration equivalent to the type enumeration in the DOM's Node data type.
			* @see http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1950641247
			* @readonly
			* @enum {number}
			*/
			NodeType: {
				"ELEMENT_NODE": (_isNodeDefined && _node.ELEMENT_NODE ? _node.ELEMENT_NODE : 1),
				"ATTRIBUTE_NODE": (_isNodeDefined && _node.ATTRIBUTE_NODE ? _node.ATTRIBUTE_NODE : 2),
				"TEXT_NODE": (_isNodeDefined && _node.TEXT_NODE ? _node.TEXT_NODE : 3),
				"CDATA_SECTION_NODE": (_isNodeDefined && _node.CDATA_SECTION_NODE ? _node.CDATA_SECTION_NODE : 4),
				"ENTITY_REFERENCE_NODE": (_isNodeDefined && _node.ENTITY_REFERENCE_NODE ? _node.ENTITY_REFERENCE_NODE : 5),
				"ENTITY_NODE": (_isNodeDefined && _node.ENTITY_NODE ? _node.ENTITY_NODE : 6),
				"PROCESSING_INSTRUCTION_NODE": (_isNodeDefined && _node.PROCESSING_INSTRUCTION_NODE ? _node.PROCESSING_INSTRUCTION_NODE : 7),
				"COMMENT_NODE": (_isNodeDefined && _node.COMMENT_NODE ? _node.COMMENT_NODE : 8),
				"DOCUMENT_NODE": (_isNodeDefined && _node.DOCUMENT_NODE ? _node.DOCUMENT_NODE : 9),
				"DOCUMENT_TYPE_NODE": (_isNodeDefined && _node.DOCUMENT_TYPE_NODE ? _node.DOCUMENT_TYPE_NODE : 10),
				"DOCUMENT_FRAGMENT_NODE": (_isNodeDefined && _node.DOCUMENT_FRAGMENT_NODE ? _node.DOCUMENT_FRAGMENT_NODE : 11),
				"NOTATION_NODE": (_isNodeDefined && _node.NOTATION_NODE ? _node.NOTATION_NODE : 12)
			},

			/**
			* An enumeration equivalent to the type filtering enumeration portion of the DOM's NodeFilter data type.
			* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-NodeFilter
			* @readonly
			* @enum {number}
			*/
			NodeTypeFilter: {
				"SHOW_ALL": (_isNodeFilterDefined && _nodeFilter.SHOW_ALL ? _nodeFilter.SHOW_ALL : -1),
				"SHOW_ELEMENT": (_isNodeFilterDefined && _nodeFilter.SHOW_ELEMENT ? _nodeFilter.SHOW_ELEMENT : 1),
				"SHOW_ATTRIBUTE": (_isNodeFilterDefined && _nodeFilter.SHOW_ATTRIBUTE ? _nodeFilter.SHOW_ATTRIBUTE : 2),
				"SHOW_TEXT": (_isNodeFilterDefined && _nodeFilter.SHOW_TEXT ? _nodeFilter.SHOW_TEXT : 4),
				"SHOW_CDATA_SECTION": (_isNodeFilterDefined && _nodeFilter.SHOW_CDATA_SECTION ? _nodeFilter.SHOW_CDATA_SECTION : 8),
				"SHOW_ENTITY_REFERENCE": (_isNodeFilterDefined && _nodeFilter.SHOW_ENTITY_REFERENCE ? _nodeFilter.SHOW_ENTITY_REFERENCE : 16),
				"SHOW_ENTITY": (_isNodeFilterDefined && _nodeFilter.SHOW_ENTITY ? _nodeFilter.SHOW_ENTITY : 32),
				"SHOW_PROCESSING_INSTRUCTION": (_isNodeFilterDefined && _nodeFilter.SHOW_PROCESSING_INSTRUCTION ? _nodeFilter.SHOW_PROCESSING_INSTRUCTION : 64),
				"SHOW_COMMENT": (_isNodeFilterDefined && _nodeFilter.SHOW_COMMENT ? _nodeFilter.SHOW_COMMENT : 128),
				"SHOW_DOCUMENT": (_isNodeFilterDefined && _nodeFilter.SHOW_DOCUMENT ? _nodeFilter.SHOW_DOCUMENT : 256),
				"SHOW_DOCUMENT_TYPE": (_isNodeFilterDefined && _nodeFilter.SHOW_DOCUMENT_TYPE ? _nodeFilter.SHOW_DOCUMENT_TYPE : 512),
				"SHOW_DOCUMENT_FRAGMENT": (_isNodeFilterDefined && _nodeFilter.SHOW_DOCUMENT_FRAGMENT ? _nodeFilter.SHOW_DOCUMENT_FRAGMENT : 1024),
				"SHOW_NOTATION": (_isNodeFilterDefined && _nodeFilter.SHOW_NOTATION ? _nodeFilter.SHOW_NOTATION : 2048)
			},

			/**
			* An enumeration equivalent to the filtering action enumeration portion of the DOM's NodeFilter data type.
			* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-NodeFilter
			* @readonly
			* @enum {number}
			*/
			NodeFilter: {
				"FILTER_ACCEPT": (_isNodeFilterDefined && _nodeFilter.FILTER_ACCEPT ? _nodeFilter.FILTER_ACCEPT : 1),
				"FILTER_REJECT": (_isNodeFilterDefined && _nodeFilter.FILTER_REJECT ? _nodeFilter.FILTER_REJECT : 2),
				"FILTER_SKIP": (_isNodeFilterDefined && _nodeFilter.FILTER_SKIP ? _nodeFilter.FILTER_SKIP : 3)
			},

			/**
			* A cross-browser TreeWalker implementation, yay!
			* @constructor
			* @class Cross-browser TreeWalker
			* @param {Node} root The node to start walking from. The walk results will only include descendant nodes of this one, not this node itself.
			* @param {jWalker.NodeTypeFilter[]} whatToShow An array of {@link jWalker.NodeTypeFilter} values.
			* @param {NodeFilter} [filter=null] An object containing an acceptNode function to act as a visitor filter to the tree nodes. Can be null.
			* @param {Boolean} [expandEntityReferences=false] Indicates whether or not to expand entity references.
			* @throws {TypeError} `root` is not a valid `Node` object
			* @throws {TypeError} `whatToShow` is not an array
			* @throws {TypeError} `whatToShow` is an empty array
			* @throws {TypeError} `whatToShow` contains invalid values
			* @throws {TypeError} `filter` is not a valid `NodeFilter` function or object
			* @throws {TypeError} `expandEntityReferences` is not a Boolean
			*/
			TreeWalker: function jWalker$TreeWalker(root, whatToShow, filter, expandEntityReferences) {
				// Alias this into the local scope to save on lookup time
				var NodeTypeFilter = jWalker.NodeTypeFilter,
					NodeFilter = jWalker.NodeFilter,
					typeofFilter = typeof filter,
					typeofEER = typeof expandEntityReferences,
					filterCount,
					len,
					valueToVerify,
					_nativeWalker = null,
					_nativeWhatToShow = NodeTypeFilter.SHOW_ALL,
					_safeFilter = null,
					_compositeNodeFilter = null;

				// Validate the arguments!
				if (_isNodeDefined) {
					if (!(root instanceof window.Node)) {
						throw new TypeError("`root` is not a valid `Node` object");
					}
				}
				else if (!root.nodeType) {
					throw new TypeError("`root` is not a valid `Node` object");
				}

				if (!jWalker$Lang.isArray(whatToShow)) {
					throw new TypeError("`whatToShow` is not an array");
				}
				else if (whatToShow.length <= 0) {
					throw new TypeError("`whatToShow` is an empty array");
				}
				// Verify all the values are valid
				for (filterCount = 0, len = whatToShow.length; filterCount < len; filterCount++) {
					valueToVerify = whatToShow[filterCount];
					if (jWalker$Lang.getEnumName(NodeTypeFilter, valueToVerify) === null) {
						throw new TypeError("`whatToShow` contains invalid value at index " + filterCount + ": " + valueToVerify);
					}
				}

				if (!(typeofFilter === "undefined" || filter === null || typeofFilter === "function" ||
					(typeofFilter === "object" && typeof filter.acceptNode === "function"))) {
					throw new TypeError("`filter` is not a valid `NodeFilter` function or object");
				}

				if (typeofEER !== "undefined" && expandEntityReferences !== null && typeofEER !== "boolean") {
					throw new TypeError("`expandEntityReferences` is not a Boolean primitive");
				}


				/**
				* The root node of the TreeWalker, as specified when it was created.
				* @type Node
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-root
				*/
				this.root = root;
				/**
				* This attribute determines which node types are presented via the TreeWalker.
				* The available set of constants is defined in the {@link jWalker.NodeTypeFilter} interface.
				* Nodes not accepted by whatToShow will be skipped, but their children may still be considered.
				* Note that this skip takes precedence over the filter, if any.
				* @type jWalker.NodeTypeFilter[]
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-whatToShow
				*/
				this.whatToShow = whatToShow;
				/**
				* The filter used to screen nodes.
				* @type NodeFilter
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-filter
				*/
				this.filter = filter || null;
				/**
				* The value of this flag determines whether the children of entity reference nodes are visible to the TreeWalker.
				* If false, they and their descendants will be rejected. Note that this rejection takes precedence over `whatToShow`
				* and the filter, if any. To produce a view of the document that has entity references expanded and does not expose
				* the entity reference node itself, use the `whatToShow` flags to hide the entity reference node and set
				* `expandEntityReferences` to true when creating the TreeWalker. To produce a view of the document that has entity
				* reference nodes but no entity expansion, use the `whatToShow` flags to show the entity reference node and set
				* `expandEntityReferences` to false.
				* @type Boolean
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-expandEntityReferences
				*/
				this.expandEntityReferences = expandEntityReferences || false;
				/**
				* The node at which the TreeWalker is currently positioned. Alterations to the DOM tree may cause the current node
				* to no longer be accepted by the TreeWalker's associated `filter`. `currentNode` may also be explicitly set to any
				* node, whether or not it is within the subtree specified by the root node or would be accepted by the `filter` and
				* `whatToShow` flags. Further traversal occurs relative to currentNode even if it is not part of the current view,
				* by applying the `filter`s in the requested direction; if no traversal is possible, `currentNode` is not changed.
				* @type Node
				* @throws {DOMException} NOT_SUPPORTED_ERR: Raised if an attempt is made to set currentNode to null.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-currentNode
				*/
				this.currentNode = root;

				// Create a native TreeWalker in browsers that support DOM Level 2 (i.e. all but IE8-)
				if (jWalker.isTreeWalkerSupportedNatively()) {
					_nativeWhatToShow = 0;
					if (jWalker$Lang.arrayIndexOf(this.whatToShow, NodeTypeFilter.SHOW_ALL) !== -1) {
						_nativeWhatToShow = NodeTypeFilter.SHOW_ALL;
					}
					else {
						for (var f = 0, wtsCount = this.whatToShow.length; f < wtsCount; f++) {
							var nodeTypeFilterName = jWalker$Lang.getEnumName(NodeTypeFilter, this.whatToShow[f]);
							if (nodeTypeFilterName) {
								_nativeWhatToShow += NodeFilter[nodeTypeFilterName];
							}
						}
					}

					// This object is meant to circumnavigate the dumb browsers (IE9, and older versions of Safari and Chrome)
					// that expect the filter to not be an object that contains a method, and instead the method itself.
					// Well, this is both.  It's perhaps not compliant with the W3C spec in the end call (type function rather
					// than type object), but it works whether the browser calls "filter()" or "filter.acceptNode()".
					_safeFilter = this.filter;
					if (this.filter && typeof this.filter.acceptNode === "function") {
						_safeFilter = this.filter.acceptNode;
						_safeFilter.acceptNode = this.filter.acceptNode;
					}

					_nativeWalker = document.createTreeWalker(this.root, _nativeWhatToShow, _safeFilter, this.expandEntityReferences);
				}
				// Update the _compositeNodeFilter to account for NodeTypeFilter-ing and the NodeFilter function passed in
				else {
					/**
					 * @private
					 */
					_compositeNodeFilter = function jWalker$TreeWalker$_compositeNodeFilter(node) {
						if (node) {
							// Filter by nodeType
							var nodeTypeFilter = NodeTypeFilter.getFromNodeType(node.nodeType);
							if (jWalker$Lang.arrayIndexOf(this.whatToShow, NodeTypeFilter.SHOW_ALL) !== -1 ||
								jWalker$Lang.arrayIndexOf(this.whatToShow, nodeTypeFilter) !== -1)
							{
								// If it made it past the nodeType filtering, run it through the user's acceptNode filter, if provided
								if (this.filter && typeof this.filter.acceptNode === "function") {
									return this.filter.acceptNode(node);
								}
								return NodeFilter.FILTER_ACCEPT;
							}
							else {
								// Else skip this immediate node but continue to look at its descendants
								return NodeFilter.FILTER_SKIP;
							}
						}
						return NodeFilter.FILTER_REJECT;
					};
				}

				/**
				* Moves to and returns the closest visible ancestor node of the current node. If the search for
				* parentNode attempts to step upward from the TreeWalker's `root` node, or if it fails to find a
				* visible ancestor node, this method retains the current position and returns null.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-parentNode
				* @returns {Node} The new parent node, or null if the current node has no parent in the TreeWalker's logical view.
				*/
				this.parentNode = function jWalker$TreeWalker$parentNode() {
					if (this.currentNode !== this.root) {
						if (_nativeWalker && typeof _nativeWalker.parentNode === "function") {
							_nativeWalker.currentNode = this.currentNode;
							var node = _nativeWalker.parentNode();
							this.currentNode = _nativeWalker.currentNode;
							return node;
						}
						else {
							// If including elements in the logical view
							if (jWalker$NodeTypeFilter.showsElements(this.whatToShow)) {
								var nodeContext = this.currentNode.parentNode;
								while (nodeContext) {
									var filterStatus = _compositeNodeFilter(nodeContext);
									if (filterStatus === NodeFilter.FILTER_ACCEPT) {
										this.currentNode = nodeContext;
										return this.currentNode;
									}
									else if (filterStatus !== NodeFilter.FILTER_REJECT) {
										nodeContext = nodeContext.parentNode;
									}
								}
							}
						}
					}
					// If no acceptable node was found, return null but DO NOT UPDATE the TreeWalker's currentNode property!
					return null;
				};

				/**
				* Moves the TreeWalker to the first visible child of the current node, and returns the new node.
				* If the current node has no visible children, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-firstChild
				* @returns {Node} The new node, or null if the current node has no children in the TreeWalker's logical view.
				*/
				this.firstChild = function jWalker$TreeWalker$firstChild() {
					if (_nativeWalker && typeof _nativeWalker.firstChild === "function") {
						_nativeWalker.currentNode = this.currentNode;
						var node = _nativeWalker.firstChild();
						this.currentNode = _nativeWalker.currentNode;
						return node;
					}
					else {
						// If NOT including elements in the logical view
						if (!jWalker$NodeTypeFilter.showsElements(this.whatToShow)) {
							if (this.currentNode.nodeType === jWalker.NodeType.ELEMENT_NODE) {
								return this.nextNode();
							}
							return null;
						}

						// Else iterate as normal
						var NodeFilter = jWalker.NodeFilter;  // Localize
						var nodeContext = this.currentNode.firstChild;
						while (nodeContext) {
							var filterStatus = _compositeNodeFilter(nodeContext);
							if (filterStatus === NodeFilter.FILTER_ACCEPT) {
								this.currentNode = nodeContext;
								return this.currentNode;
							}
							else if (filterStatus !== NodeFilter.FILTER_REJECT) {
								nodeContext = nodeContext.nextSibling;
							}
						}
					}
					// If no acceptable node was found, return null but DO NOT UPDATE the TreeWalker's currentNode property!
					return null;
				};

				/**
				* Moves the TreeWalker to the last visible child of the current node, and returns the new node.
				* If the current node has no visible children, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-lastChild
				* @returns {Node} The new node, or null if the current node has no children in the TreeWalker's logical view.
				*/
				this.lastChild = function jWalker$TreeWalker$lastChild() {
					/*jshint noempty:false */
					
					if (_nativeWalker && typeof _nativeWalker.lastChild === "function") {
						_nativeWalker.currentNode = this.currentNode;
						var node = _nativeWalker.lastChild();
						this.currentNode = _nativeWalker.currentNode;
						return node;
					}
					else {
						// If NOT including elements in the logical view
						if (!jWalker$NodeTypeFilter.showsElements(this.whatToShow)) {
							var currentNodeRef = this.currentNode;
							if (this.currentNode.nodeType === jWalker.NodeType.ELEMENT_NODE) {
								// Loop through to the last node
								while (this.nextNode()) { /* Do nothing */ }
							}

							if (this.currentNode !== currentNodeRef) {
								return this.currentNode;
							}
							return null;
						}

						var NodeFilter = jWalker.NodeFilter;  // Localize
						var nodeContext = this.currentNode.lastChild;
						while (nodeContext) {
							var filterStatus = _compositeNodeFilter(nodeContext);
							if (filterStatus === NodeFilter.FILTER_ACCEPT) {
								this.currentNode = nodeContext;
								return this.currentNode;
							}
							else if (filterStatus !== NodeFilter.FILTER_REJECT) {
								nodeContext = nodeContext.previousSibling;
							}
						}
					}
					// If no acceptable node was found, return null but DO NOT UPDATE the TreeWalker's currentNode property!
					return null;
				};

				/**
				* Moves the TreeWalker to the previous sibling of the current node, and returns the new node.
				* If the current node has no visible previous sibling, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-previousSibling
				* @returns {Node} The new node, or null if the current node has no previous sibling in the TreeWalker's logical view.
				*/
				this.previousSibling = function jWalker$TreeWalker$previousSibling() {
					if (this.currentNode !== this.root) {
						if (_nativeWalker && typeof _nativeWalker.previousSibling === "function") {
							_nativeWalker.currentNode = this.currentNode;
							var node = _nativeWalker.previousSibling();
							this.currentNode = _nativeWalker.currentNode;
							return node;
						}
						else
						{
							// If NOT including elements in the logical view
							if (!jWalker$NodeTypeFilter.showsElements(this.whatToShow) && this.currentNode.nodeType !== jWalker.NodeType.ELEMENT_NODE) {
								return this.previousNode();
							}

							var NodeFilter = jWalker.NodeFilter;  // Localize
							var nodeContext = this.currentNode;
							while (nodeContext.previousSibling) {
								var filterStatus = _compositeNodeFilter(nodeContext.previousSibling);
								if (filterStatus === NodeFilter.FILTER_ACCEPT) {
									this.currentNode = nodeContext.previousSibling;
									return this.currentNode;
								}
								else if (filterStatus !== NodeFilter.FILTER_REJECT) {
									nodeContext = nodeContext.previousSibling;
								}
							}
						}
					}
					// If no acceptable node was found, return null but DO NOT UPDATE the TreeWalker's currentNode property!
					return null;
				};

				/**
				* Moves the TreeWalker to the next sibling of the current node, and returns the new node.
				* If the current node has no visible next sibling, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-nextSibling
				* @returns {Node} The new node, or null if the current node has no next sibling in the TreeWalker's logical view.
				*/
				this.nextSibling = function jWalker$TreeWalker$nextSibling() {
					if (this.currentNode !== this.root) {
						if (_nativeWalker && typeof _nativeWalker.nextSibling === "function") {
							_nativeWalker.currentNode = this.currentNode;
							var node = _nativeWalker.nextSibling();
							this.currentNode = _nativeWalker.currentNode;
							return node;
						}
						else {
							// If NOT including elements in the logical view
							if (!jWalker$NodeTypeFilter.showsElements(this.whatToShow) && this.currentNode.nodeType !== jWalker.NodeType.ELEMENT_NODE) {
								return this.nextNode();
							}

							var NodeFilter = jWalker.NodeFilter,  // Localize
								nodeContext = this.currentNode,
								filterStatus;
							while (nodeContext.nextSibling) {
								filterStatus = _compositeNodeFilter(nodeContext.nextSibling);
								if (filterStatus === NodeFilter.FILTER_ACCEPT) {
									this.currentNode = nodeContext.nextSibling;
									return this.currentNode;
								}
								else if (filterStatus !== NodeFilter.FILTER_REJECT) {
									nodeContext = nodeContext.nextSibling;
								}
							}
						}
					}
					// If no acceptable node was found, return null but DO NOT UPDATE the TreeWalker's currentNode property!
					return null;
				};

				/**
				* Moves the TreeWalker to the previous visible node in document order relative to the current node, and
				* returns the new node. If the current node has no previous node, or if the search for previousNode
				* attempts to step upward from the TreeWalker's root node, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-previousNode
				* @returns {Node} The new node, or null if the current node has no previous node in the TreeWalker's logical view.
				*/
				this.previousNode = function jWalker$TreeWalker$previousNode() {
					if (this.currentNode !== this.root) {
						if (_nativeWalker && typeof _nativeWalker.previousNode === "function") {
							_nativeWalker.currentNode = this.currentNode;
							var node = _nativeWalker.previousNode();
							this.currentNode = _nativeWalker.currentNode;
							return node;
						}
						else {
							var NodeFilter = jWalker.NodeFilter;  // Localize
							var contextNode = this.currentNode;
							while (contextNode && contextNode !== this.root) {
								// previous node is the previous sibling's last child, or the previous sibling, if any
								if (contextNode.previousSibling) {
									contextNode = contextNode.previousSibling;
									if (_compositeNodeFilter(contextNode) !== NodeFilter.FILTER_REJECT) {
										// Get the deepest ancestor that is a last child
										while (contextNode.lastChild) {
											contextNode = contextNode.lastChild;
											if (_compositeNodeFilter(contextNode) === NodeFilter.FILTER_REJECT) {
												break;
											}
										}
										// NOTE: If this lastChild doesn't pass the filter, any previous siblings will be handled by looping back
									}
									else {
										// If this node was rejected, loop back and look at its previousSibling/parentNode
										continue;
									}
								}
								// or previous node is under the the parent node, but don't go beyond the root
								else {
									contextNode = contextNode.parentNode;
								}

								if (_compositeNodeFilter(contextNode) === NodeFilter.FILTER_ACCEPT) {
									this.currentNode = contextNode;
									return contextNode;
								}
							}
						}
					}
					// If no acceptable node was found, return null but DO NOT UPDATE the TreeWalker's currentNode property!
					return null;
				};

				/**
				* Moves the TreeWalker to the next visible node in document order relative to the current node, and
				* returns the new node. If the current node has no next node, or if the search for nextNode attempts
				* to step upward from the TreeWalker's root node, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-nextNode
				* @returns {Node} The new node, or null if the current node has no next node in the TreeWalker's logical view.
				*/
				this.nextNode = function jWalker$TreeWalker$nextNode() {
					if (_nativeWalker && typeof _nativeWalker.nextNode === "function") {
						_nativeWalker.currentNode = this.currentNode;
						var node = _nativeWalker.nextNode();
						this.currentNode = _nativeWalker.currentNode;
						return node;
					}
					else {
						var NodeFilter = jWalker.NodeFilter;  // Localize
						var contextNode = this.currentNode;
						while (contextNode) {
							// If this node is acceptable by the filter, then next node is the first child, if any
							if (_compositeNodeFilter(contextNode) !== NodeFilter.FILTER_REJECT && contextNode.hasChildNodes()) {
								contextNode = contextNode.firstChild;
							}
							// Or the next sibling, if any.
							// NOTE: This accounts for children AFTER the firstChild as the contextNode on the next loop will be the firstChild
							else if (contextNode.nextSibling) {
								contextNode = contextNode.nextSibling;
							}
							// Or the closest ancestor's next sibling, if any.
							// NOTE: This comes back up the DOM hierarchy such that it will also account for next siblings of the original context Node
							else {
								while (contextNode) {
									if (contextNode.parentNode && contextNode.parentNode !== this.root) {
										if (contextNode.parentNode.nextSibling) {
											contextNode = contextNode.parentNode.nextSibling;
											break;
										}
										else {
											contextNode = contextNode.parentNode;
										}
									}
									else {
										// If no acceptable node was found, return null but DO NOT UPDATE the TreeWalker's currentNode property!
										return null;
									}
								}
							}

							if (_compositeNodeFilter(contextNode) === NodeFilter.FILTER_ACCEPT) {
								this.currentNode = contextNode;
								return contextNode;
							}
						}
					}
					// If no acceptable node was found, return null but DO NOT UPDATE the TreeWalker's currentNode property!
					return null;
				};
			},

			/**
			* Abstract the check for native TreeWalker support so that we can force the non-native TreeWalker for testing
			*/
			isTreeWalkerSupportedNatively: function jWalker$isTreeWalkerSupportedNatively() {
				// The following feature detection checks are approximately equivalent to, but more reliable than:
				//    `document.implementation.hasFeature("Traversal", "2.0")`
				return (_isCreateTreeWalkerDefined && _isNodeFilterDefined);
			},

			/**
			* Use jWalker to provide the underlying implementation for the native API members defined by the browser.
			* Note that this will ONLY execute if TreeWalker is not natively supported already.
			* BUYER BEWARE!
			*/
			createMissingNativeApi: function jWalker$createMissingNativeApi() {
				if (!jWalker.isTreeWalkerSupportedNatively()) {
					// Hookup Node with jWalker.Node
					window.Node = jWalker.NodeType;
					// Hookup NodeFilter with {jWalker.NodeTypeFilter, jWalker.NodeFilter}
					window.NodeFilter = jWalker$Lang.mixIn({}, jWalker.NodeTypeFilter, jWalker.NodeFilter);

					// Hookup createTreeWalker with jWalker.TreeWalker class
					document.createTreeWalker = function jWalker$TreeWalker$wrapAsNative(root, whatToShow, filter, expandEntityReferences) {
						// Deal with conversion of piped Node[Type]Filters into jWalker.NodeTypeFilters and back into piped Node[Type]Filters
						var _whatToShow = [],
							w = whatToShow,
							NodeTypeFilter = jWalker.NodeTypeFilter,
							valuesToCheck,
							valueToCheck,
							v,
							len;

						if (typeof w === "number") {
							if (w === NodeTypeFilter.SHOW_ALL) {
								_whatToShow.push(NodeTypeFilter.SHOW_ALL);
							}
							else {
								// Values are in descending numerical order (from largest to smallest)
								valuesToCheck = [
									NodeTypeFilter.SHOW_NOTATION,
									NodeTypeFilter.SHOW_DOCUMENT_FRAGMENT,
									NodeTypeFilter.SHOW_DOCUMENT_TYPE,
									NodeTypeFilter.SHOW_DOCUMENT,
									NodeTypeFilter.SHOW_COMMENT,
									NodeTypeFilter.SHOW_PROCESSING_INSTRUCTION,
									NodeTypeFilter.SHOW_ENTITY,
									NodeTypeFilter.SHOW_ENTITY_REFERENCE,
									NodeTypeFilter.SHOW_CDATA_SECTION,
									NodeTypeFilter.SHOW_TEXT,
									NodeTypeFilter.SHOW_ATTRIBUTE,
									NodeTypeFilter.SHOW_ELEMENT
								];
								for (v = 0, len = valuesToCheck.length; v < len; v++) {
									valueToCheck = valuesToCheck[v];
									if (w - valueToCheck > -1) {
										w -= valueToCheck;
										_whatToShow.push(valueToCheck);
									}
								}
							}
						}
						return new jWalker.TreeWalker(root, _whatToShow, filter, !!expandEntityReferences);
					};
				}
			}
		};

	// Expose jWalker to the global object
	return (window.jWalker = jWalker);
})(this);
