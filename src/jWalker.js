/**
 * jWalker JavaScript Library v1.0.0
 * http://code.google.com/p/jwalker/
 *
 * Copyright (c) 2011: James Greene (d.b.a. Team Gunmetal, Inc.)
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: __________
 */

(function (window, undefined)
{
	// Use the correct document accordingly with window argument (sandbox)
	var document = window.document,
		_undefinedType = "undefined",
		_isNodeDefined = (typeof (Node) !== _undefinedType),
		_node = (_isNodeDefined ? Node : undefined),
		_isNodeFilterDefined = (typeof (NodeFilter) !== _undefinedType),
		_nodeFilter = (_isNodeFilterDefined ? NodeFilter : undefined),
		jWalker$Lang = {
			/**
			* Get the property name of a given value within an enumeration.
			* @param {Object} enumObject The current enumeration object.
			* @param {Number} enumValue The value of the property whose name is being sought.
			* @returns {String} The name of the property, if present; otherwise null.
			*/
			getEnumName: function jWalker$Lang$getEnumName(enumObject, enumValue)
			{
				// Verify the enumObject is a valid object and the enumValue is a valid integer
				if (enumObject && typeof (enumObject) === "object" &&
					typeof (enumValue) === "number" && (new String(enumValue)).indexOf(".") === -1)
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

			/**
			* Check if a given object is a native JavaScript Array.
			* @param {Object} potentialArray   Required. The object to check.
			* @returns {Boolean} True if the object is a native JavaScript Array, otherwise false.
			*/
			isArray: function jWalker$Lang$isArray(potentialArray)
			{
				var returnValue = false;
				if (potentialArray && (typeof (potentialArray) === "object"))
				{
					if (potentialArray.constructor)
					{
						var constructorText = potentialArray.constructor.toString().replace(/\s+/g, ' ');
						if (constructorText === "function Array() { [native code] }")
						{
							returnValue = true;
						}
					}
				}
				return returnValue;
			},

			/**
			* Gets the index of an item in an array.
			* @param {Array} someArray The current class type.
			* @param {Object} item The current class type.
			* @returns {Number} The first index of the item in the array, if present; otherwise -1.
			*/
			arrayIndexOf: function jWalker$Lang$arrayIndexOf(someArray, item)
			{
				if (jWalker$Lang.isArray(someArray))
				{
					// Many non-IE browsers have implemented Array.indexOf
					if (typeof (someArray.indexOf) === "function")
					{
						return someArray.indexOf(item);
					}
					else
					{
						for (var i = 0, len = someArray.length; i < len; i++)
						{
							if (someArray[i] === item)
							{
								return i;
							}
						}
					}
					return -1;
				}
				else
				{
					throw "ArgumentException: someArray was not an Array object.";
				}
			}
		},

	/**
	* ???
	* @namespace
	*/
		jWalker = {
			/**
			* ???
			* @see http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1950641247
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
			* ???
			* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-NodeFilter
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
				"SHOW_NOTATION": (_isNodeFilterDefined && _nodeFilter.SHOW_NOTATION ? _nodeFilter.SHOW_NOTATION : 2048),

				/**
				* ???
				*/
				getFromNodeType: function jWalker$NodeTypeFilter$getFromNodeType(nodeType)
				{
					if (nodeType && (typeof (nodeType)).toLowerCase() === "number" && nodeType.toString().indexOf(".") === -1)
					{
						var name = jWalker$Lang.getEnumName(jWalker.NodeType, nodeType);
						if (name != null)
						{
							var nodeTypeFilterName = "SHOW_" + name.toUpperCase().replace(/_NODE$/g, "");
							return jWalker.NodeTypeFilter[nodeTypeFilterName];
						}
					}
					return null;
				}
			},

			/**
			* ???
			* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-NodeFilter
			*/
			NodeFilter: {
				"FILTER_ACCEPT": (_isNodeFilterDefined && _nodeFilter.FILTER_ACCEPT ? _nodeFilter.FILTER_ACCEPT : 1),
				"FILTER_REJECT": (_isNodeFilterDefined && _nodeFilter.FILTER_REJECT ? _nodeFilter.FILTER_REJECT : 2),
				"FILTER_SKIP": (_isNodeFilterDefined && _nodeFilter.FILTER_SKIP ? _nodeFilter.FILTER_SKIP : 3)
			},

			/**
			* Abstract the check for native TreeWalker support so that we can force the non-native TreeWalker for testing
			*/
			isTreeWalkerSupportedNatively: function jWalker$isTreeWalkerSupportedNatively()
			{
				// The following object checks are approximately equivalent to, but more reliable than:  document.implementation.hasFeature("Traversal", "2.0")
				return (document.createTreeWalker && typeof (NodeFilter) !== "undefined");
			},

			/**
			* Cross-browser TreeWalker, yay!
			* @constructor
			* @class Cross-browser TreeWalker
			* @param {Node} root The node to start walking from. The walk results will only include descendant nodes of this one, not this node itself.
			* @param {jWalker.NodeTypeFilter[]} whatToShow An array of {@link jWalker.NodeTypeFilter} values.
			* @param {NodeFilter} [filter=null] An object containing an acceptNode function to act as a visitor filter to the tree nodes. Can be null.
			* @param {Boolean} [expandEntityReferences=false] Indicates whether or not to expand entity references.
			*/
			TreeWalker: function jWalker$TreeWalker(root, whatToShow, filter, expandEntityReferences)
			{
				// Alias this into the local scope to save on lookup time
				var jWalker$NodeTypeFilter = jWalker.NodeTypeFilter,
				// Hoisting these to the top
					filterCount,
					len,
					valueToVerify,
				// Private variables (only available via closure scope context)
					_nativeWalker = null,
					_nativeWhatToShow = jWalker$NodeTypeFilter.SHOW_ALL,
					_safeFilter = null,
					_compositeNodeFilter = null;


				// Validate the arguments!
				if (typeof (Node) !== _undefinedType)
				{
					if (!(root instanceof Node))
					{
						throw "ArgumentException: root is not a valid Node object";
					}
				}
				else if (!root.nodeType)
				{
					throw "ArgumentException: root is not a valid Node object";
				}

				if (!jWalker$Lang.isArray(whatToShow))
				{
					throw "ArgumentException: Invalid array provided as value for whatToShow";
				}
				else if (whatToShow.length <= 0)
				{
					throw "ArgumentException: Empty array provided as value for whatToShow";
				}
				// Verify all the values are valid
				for (filterCount = 0, len = whatToShow.length; filterCount < len; filterCount++)
				{
					valueToVerify = whatToShow[filterCount];
					if (jWalker$Lang.getEnumName(jWalker$NodeTypeFilter, valueToVerify) == null)
					{
						throw "ArgumentException: Invalid value in whatToShow[" + filterCount + "] = " + valueToVerify;
					}
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
				* If false, they and their descendants will be rejected. Note that this rejection takes precedence over whatToShow
				* and the filter, if any. To produce a view of the document that has entity references expanded and does not expose
				* the entity reference node itself, use the whatToShow flags to hide the entity reference node and set
				* expandEntityReferences to true when creating the TreeWalker. To produce a view of the document that has entity
				* reference nodes but no entity expansion, use the whatToShow flags to show the entity reference node and set
				* expandEntityReferences to false.
				* @type Boolean
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-expandEntityReferences
				*/
				this.expandEntityReferences = expandEntityReferences || false;
				/**
				* The node at which the TreeWalker is currently positioned. Alterations to the DOM tree may cause the current node
				* to no longer be accepted by the TreeWalker's associated filter. currentNode may also be explicitly set to any
				* node, whether or not it is within the subtree specified by the root node or would be accepted by the filter and
				* whatToShow flags. Further traversal occurs relative to currentNode even if it is not part of the current view,
				* by applying the filters in the requested direction; if no traversal is possible, currentNode is not changed.
				* @type Node
				* @throws {DOMException} NOT_SUPPORTED_ERR: Raised if an attempt is made to set currentNode to null.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-currentNode
				*/
				this.currentNode = root;


				/**
				* Moves to and returns the closest visible ancestor node of the current node. If the search for
				* parentNode attempts to step upward from the TreeWalker's root node, or if it fails to find a
				* visible ancestor node, this method retains the current position and returns null.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-parentNode
				* @returns {Node} The new parent node, or null if the current node has no parent in the TreeWalker's logical view.
				*/
				this.parentNode = function jWalker$TreeWalker$parentNode()
				{
					return null;
				};

				/**
				* Moves the TreeWalker to the first visible child of the current node, and returns the new node.
				* If the current node has no visible children, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-firstChild
				* @returns {Node} The new node, or null if the current node has no children in the TreeWalker's logical view.
				*/
				this.firstChild = function jWalker$TreeWalker$firstChild()
				{

				};

				/**
				* Moves the TreeWalker to the last visible child of the current node, and returns the new node.
				* If the current node has no visible children, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-lastChild
				* @returns {Node} The new node, or null if the current node has no children in the TreeWalker's logical view.
				*/
				this.lastChild = function jWalker$TreeWalker$lastChild()
				{

				};

				/**
				* Moves the TreeWalker to the previous sibling of the current node, and returns the new node.
				* If the current node has no visible previous sibling, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-previousSibling
				* @returns {Node} The new node, or null if the current node has no previous sibling in the TreeWalker's logical view.
				*/
				this.previousSibling = function jWalker$TreeWalker$previousSibling()
				{

				};

				/**
				* Moves the TreeWalker to the next sibling of the current node, and returns the new node.
				* If the current node has no visible next sibling, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-nextSibling
				* @returns {Node} The new node, or null if the current node has no next sibling in the TreeWalker's logical view.
				*/
				this.nextSibling = function jWalker$TreeWalker$nextSibling()
				{

				};

				/**
				* Moves the TreeWalker to the previous visible node in document order relative to the current node, and
				* returns the new node. If the current node has no previous node, or if the search for previousNode
				* attempts to step upward from the TreeWalker's root node, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-previousNode
				* @returns {Node} The new node, or null if the current node has no previous node in the TreeWalker's logical view.
				*/
				this.previousNode = function jWalker$TreeWalker$previousNode()
				{

				};

				/**
				* Moves the TreeWalker to the next visible node in document order relative to the current node, and
				* returns the new node. If the current node has no next node, or if the search for nextNode attempts
				* to step upward from the TreeWalker's root node, returns null, and retains the current node.
				* @see http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker-nextNode
				* @returns {Node} The new node, or null if the current node has no next node in the TreeWalker's logical view.
				*/
				this.nextNode = function jWalker$TreeWalker$nextNode()
				{

				};
			},

			/**
			* Use the the jWalker implementations to override the native API members defined by the browser.
			* NOT RECOMMENDED!
			*/
			useAsNativeApis: function jWalker$useAsNativeApis()
			{
				// TODO: Hookup Node, NodeFilter with this.Node, {this.NodeTypeFilter, this.NodeFilter}
				// TODO: Deal with conversion of piped NodeTypeFilters into jWalker NodeTypeFilters and back into piped NodeTypeFilters
				// TODO: Hookup createTreeWalker with this.TreeWalker class
			}
		};

	// Expose jWalker to the global object
	return (window.jWalker = jWalker);
})(window);
