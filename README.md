# jWalker
[![Build Status](https://secure.travis-ci.org/JamesMGreene/jWalker.png)](http://travis-ci.org/JamesMGreene/jWalker)

jWalker provides a well-tested, cross-browser JavaScript implementation of the [TreeWalker][2] class defined in
the [W3C specification for DOM Traversal (DOM Level 2)][1].

This bridges the gap left by Internet Explorer browsers less than IE9 (as well as IE9 when used in IE7/IE8
compatibility mode) when trying to use TreeWalkers.  It also addresses a [WebKit bug that I reported][5] that has
since been [resolved][6] but still exists in older versions of WebKit browsers (e.g. Safari, Chrome).
Unfortunately, the same issue also exists in IE9 but has not yet been fixed.

Initially, I sought to also provide a well-tested, cross-browser JavaScript implementation of the
[NodeIterator][3] class defined in the [W3C specification for DOM Traversal (DOM Level 2)][1] as well.  However,
upon further review, I discovered that the NodeIterator could not be implemented 100% accurately in JavaScript
due to its [robustness requirements][4], which would require intimate browser-level knowledge of any updates
made to the live DOM.


[1]: http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal
[2]: http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal#TreeWalker
[3]: http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal#Iterator-overview
[4]: http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal#Iterator-Robustness
[5]: https://bugs.webkit.org/show_bug.cgi?id=35296
[6]: http://trac.webkit.org/changeset/65853
