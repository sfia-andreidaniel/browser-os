function DocumentEditor_dlg_find( app ) {
    
    app.handlers.cmd_find = (function() {

    var editor = app.activeDocument;
    
    if ( !editor )
        return;
    
    if ( !editor.searchReplacePatched ) {
        editor.editor.nativeEditor.on('beforeaddundo keydown', function(e) {
            if ( app.searchReplaceDialog && app.searchReplaceDialog.childOf ) {
                console.log("Canceled!");
                e.preventDefault();
                return false;
            }
        });
    
    }
    
    editor = editor.editor.nativeEditor;

    var $namespace = {};

    var $export = function(objectID, objectData) {
        $namespace[objectID] = objectData;
        return objectData;
    };
    var $import = function(objectID) {
        return $namespace[objectID] || (function() {
            throw "Namespace " + objectID + " is not defined (yet?)";
        })();
    };
    var $pid = getUID();

    var dlg = app.searchReplaceDialog ? app.searchReplaceDialog : ( function() { var dlg = app.searchReplaceDialog = $export("0001-dlg", (new Dialog({
        "alwaysOnTop": true,
        "appIcon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAgAAAgIAAgICBAICBAQABAQCBAQEBgYEOfn5+/v5/f37/f39//3//r29v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAA0ALAAAAAAQABAAAAh2ABsIHEiwoMGDCAEoHAjAAICDAhYIYLjgoUEBAAIMRABgYkGFAxYqxGiRYkgDDQAsCDmAYACFAEICODByYUqVIRFUDFCRo8gBFRVWBOpzIc2gDTMGdfgQZkeMKUlibKmyY0mBVQe05Dnyo0SRMD0yVEgTIcKAAAA7",
        "caption": "Find and Replace",
        "closeable": true,
        "height": 216,
        "maximizeable": false,
        "maximized": false,
        "minimizeable": false,
        "modal": false,
        "moveable": true,
        "resizeable": false,
        "scrollable": false,
        "visible": true,
        "width": 401,
        "childOf": app
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));

    Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
        dlg.close();
    } );

    $export("0001-lbl", (new DOMLabel("Find:")).setAttr("style", "top: 20px; left: 10px; width: 50px; position: absolute; text-overflow: ellipsis"));

    $export("0002-lbl", (new DOMLabel("Replace with:")).setAttr("style", "top: 55px; left: 10px; width: 80px; position: absolute; text-overflow: ellipsis"));

    var txtFind = $export("0001-text", (new TextBox("")).setAttr("style", "top: 15px; left: 95px; position: absolute; margin: 0").setAnchors({
        "width": function(w, h) {
            return w - 115 + "px";
        }
    }));

    var txtReplace = $export("0002-text", (new TextBox("")).setAttr("style", "top: 50px; left: 95px; position: absolute; margin: 0").setAnchors({
        "width": function(w, h) {
            return w - 115 + "px";
        }
    }));

    var matchCase = $export("0001-check", (new DOMCheckBox({
        "valuesSet": "two-states",
        "checked": "false"
    })).setAttr("style", "top: 80px; left: 90px; position: absolute"));

    var wholeWords = $export("0002-check", (new DOMCheckBox({
        "valuesSet": "two-states",
        "checked": "false"
    })).setAttr("style", "top: 105px; left: 90px; position: absolute"));

    $export("0003-lbl", (new DOMLabel("Match case")).setAttr("style", "top: 83px; left: 115px; width: 115px; position: absolute; text-overflow: ellipsis"));

    $export("0004-lbl", (new DOMLabel("Whole words")).setAttr("style", "top: 107px; left: 115px; width: 95px; position: absolute; text-overflow: ellipsis"));

    $export("0001-btn", (new Button("Find", (function() {
        dlg.appHandler('cmd_find');
    }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));

    $export("0002-btn", (new Button("Replace", (function() {
        dlg.appHandler('cmd_replace');
    }))).setAttr("style", "bottom: 10px; left: 55px; position: absolute"));

    $export("0003-btn", (new Button("Replace All", (function() {
        dlg.appHandler('cmd_replace_all');
    }))).setAttr("style", "bottom: 10px; left: 120px; position: absolute"));

    $export("0004-btn", (new Button("Next", (function() {
        dlg.appHandler('cmd_find_next');
    }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));

    $export("0005-btn", (new Button("Prev", (function() {
        dlg.appHandler('cmd_find_prev');
    }))).setAttr("style", "bottom: 10px; right: 60px; position: absolute"));

    $import("0001-dlg").insert($import("0001-lbl"));
    $import("0001-dlg").insert($import("0002-lbl"));
    $import("0001-dlg").insert($import("0001-text"));
    $import("0001-dlg").insert($import("0002-text"));
    $import("0001-dlg").insert($import("0001-check"));
    $import("0001-dlg").insert($import("0002-check"));
    $import("0001-dlg").insert($import("0003-lbl"));
    $import("0001-dlg").insert($import("0004-lbl"));
    $import("0001-dlg").insert($import("0001-btn"));
    $import("0001-dlg").insert($import("0002-btn"));
    $import("0001-dlg").insert($import("0003-btn"));
    $import("0001-dlg").insert($import("0004-btn"));
    $import("0001-dlg").insert($import("0005-btn"));

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);


    function findAndReplaceDOMText(regex, node, replacementNode, captureGroup, schema) {
        var m, matches = [], text, count = 0, doc;
        var blockElementsMap, hiddenTextElementsMap, shortEndedElementsMap;

        doc = node.ownerDocument;
        blockElementsMap = schema.getBlockElements(); // H1-H6, P, TD etc
        hiddenTextElementsMap = schema.getWhiteSpaceElements(); // TEXTAREA, PRE, STYLE, SCRIPT
        shortEndedElementsMap = schema.getShortEndedElements(); // BR, IMG, INPUT

        function getMatchIndexes(m, captureGroup) {
            captureGroup = captureGroup || 0;

            if (!m[0]) {
                throw 'findAndReplaceDOMText cannot handle zero-length matches';
            }

            var index = m.index;

            if (captureGroup > 0) {
                var cg = m[captureGroup];

                if (!cg) {
                    throw 'Invalid capture group';
                }

                index += m[0].indexOf(cg);
                m[0] = cg;
            }

            return [index, index + m[0].length, [m[0]]];
        }

        function getText(node) {
            var txt;

            if (node.nodeType === 3) {
                return node.data;
            }

            if (hiddenTextElementsMap[node.nodeName]) {
                return '';
            }

            txt = '';

            if (blockElementsMap[node.nodeName] || shortEndedElementsMap[node.nodeName]) {
                txt += '\n';
            }

            if ((node = node.firstChild)) {
                do {
                    txt += getText(node);
                } while ((node = node.nextSibling));
            }

            return txt;
        }

        function stepThroughMatches(node, matches, replaceFn) {
            var startNode, endNode, startNodeIndex,
                endNodeIndex, innerNodes = [], atIndex = 0, curNode = node,
                matchLocation = matches.shift(), matchIndex = 0;

            out: while (true) {
                if (blockElementsMap[curNode.nodeName] || shortEndedElementsMap[curNode.nodeName]) {
                    atIndex++;
                }

                if (curNode.nodeType === 3) {
                    if (!endNode && curNode.length + atIndex >= matchLocation[1]) {
                        // We've found the ending
                        endNode = curNode;
                        endNodeIndex = matchLocation[1] - atIndex;
                    } else if (startNode) {
                        // Intersecting node
                        innerNodes.push(curNode);
                    }

                    if (!startNode && curNode.length + atIndex > matchLocation[0]) {
                        // We've found the match start
                        startNode = curNode;
                        startNodeIndex = matchLocation[0] - atIndex;
                    }

                    atIndex += curNode.length;
                }

                if (startNode && endNode) {
                    curNode = replaceFn({
                        startNode: startNode,
                        startNodeIndex: startNodeIndex,
                        endNode: endNode,
                        endNodeIndex: endNodeIndex,
                        innerNodes: innerNodes,
                        match: matchLocation[2],
                        matchIndex: matchIndex
                    });

                    // replaceFn has to return the node that replaced the endNode
                    // and then we step back so we can continue from the end of the
                    // match:
                    atIndex -= (endNode.length - endNodeIndex);
                    startNode = null;
                    endNode = null;
                    innerNodes = [];
                    matchLocation = matches.shift();
                    matchIndex++;

                    if (!matchLocation) {
                        break; // no more matches
                    }
                } else if (!hiddenTextElementsMap[curNode.nodeName] && curNode.firstChild) {
                    // Move down
                    curNode = curNode.firstChild;
                    continue;
                } else if (curNode.nextSibling) {
                    // Move forward:
                    curNode = curNode.nextSibling;
                    continue;
                }

                // Move forward or up:
                while (true) {
                    if (curNode.nextSibling) {
                        curNode = curNode.nextSibling;
                        break;
                    } else if (curNode.parentNode !== node) {
                        curNode = curNode.parentNode;
                    } else {
                        break out;
                    }
                }
            }
        }

        /**
        * Generates the actual replaceFn which splits up text nodes
        * and inserts the replacement element.
        */
        function genReplacer(nodeName) {
            var makeReplacementNode;

            if (typeof nodeName != 'function') {
                var stencilNode = nodeName.nodeType ? nodeName : doc.createElement(nodeName);

                makeReplacementNode = function(fill, matchIndex) {
                    var clone = stencilNode.cloneNode(false);

                    clone.setAttribute('data-mce-index', matchIndex);

                    if (fill) {
                        clone.appendChild(doc.createTextNode(fill));
                    }

                    return clone;
                };
            } else {
                makeReplacementNode = nodeName;
            }

            return function replace(range) {
                var before, after, parentNode, startNode = range.startNode,
                    endNode = range.endNode, matchIndex = range.matchIndex;

                if (startNode === endNode) {
                    var node = startNode;

                    parentNode = node.parentNode;
                    if (range.startNodeIndex > 0) {
                        // Add `before` text node (before the match)
                        before = doc.createTextNode(node.data.substring(0, range.startNodeIndex));
                        parentNode.insertBefore(before, node);
                    }

                    // Create the replacement node:
                    var el = makeReplacementNode(range.match[0], matchIndex);
                    parentNode.insertBefore(el, node);
                    if (range.endNodeIndex < node.length) {
                        // Add `after` text node (after the match)
                        after = doc.createTextNode(node.data.substring(range.endNodeIndex));
                        parentNode.insertBefore(after, node);
                    }

                    node.parentNode.removeChild(node);

                    return el;
                } else {
                    // Replace startNode -> [innerNodes...] -> endNode (in that order)
                    before = doc.createTextNode(startNode.data.substring(0, range.startNodeIndex));
                    after = doc.createTextNode(endNode.data.substring(range.endNodeIndex));
                    var elA = makeReplacementNode(startNode.data.substring(range.startNodeIndex), matchIndex);
                    var innerEls = [];

                    for (var i = 0, l = range.innerNodes.length; i < l; ++i) {
                        var innerNode = range.innerNodes[i];
                        var innerEl = makeReplacementNode(innerNode.data, matchIndex);
                        innerNode.parentNode.replaceChild(innerEl, innerNode);
                        innerEls.push(innerEl);
                    }

                    var elB = makeReplacementNode(endNode.data.substring(0, range.endNodeIndex), matchIndex);

                    parentNode = startNode.parentNode;
                    parentNode.insertBefore(before, startNode);
                    parentNode.insertBefore(elA, startNode);
                    parentNode.removeChild(startNode);

                    parentNode = endNode.parentNode;
                    parentNode.insertBefore(elB, endNode);
                    parentNode.insertBefore(after, endNode);
                    parentNode.removeChild(endNode);

                    return elB;
                }
            };
        }

        text = getText(node);
        if (!text) {
            return;
        }

        if (regex.global) {
            while ((m = regex.exec(text))) {
                matches.push(getMatchIndexes(m, captureGroup));
            }
        } else {
            m = text.match(regex);
            matches.push(getMatchIndexes(m, captureGroup));
        }

        if (matches.length) {
            count = matches.length;
            stepThroughMatches(node, matches, genReplacer(replacementNode));
        }

        return count;
    }

    var self = dlg,
        currentIndex = -1,
        spellCheckerEnabled;
    
    dlg.closeCallback = function() {
        editor.focus();
        dlg.unmarkAllMatches();
        return true;
    }

    self.markAllMatches = function(regex) {
        var node, marker;

        marker = editor.dom.create('span', {
            "class": 'mce-match-marker',
            "data-mce-bogus": 1
        });

        node = editor.getBody();

        self.unmarkAllMatches(node);

        return findAndReplaceDOMText(regex, node, marker, false, editor.schema);
    };












    function unwrap(node) {
        var parentNode = node.parentNode;
        parentNode.insertBefore(node.firstChild, node);
        node.parentNode.removeChild(node);
    }

    function moveSelection(forward, fromStart) {
        var selection = editor.selection, rng = selection.getRng(true), currentIndex = -1,
            startContainer, endContainer;

        forward = forward !== false;

        function walkToIndex() {
            var node, walker;

            if (fromStart) {
                node = editor.getBody()[forward ? 'firstChild' : 'lastChild'];
            } else {
                node = rng[forward ? 'endContainer' : 'startContainer'];
            }

            walker = new tinymce.dom.TreeWalker(node, editor.getBody());

            while ((node = walker.current())) {
                if (node.nodeType == 1 && node.nodeName == "SPAN" && node.getAttribute('data-mce-index') !== null) {
                    currentIndex = node.getAttribute('data-mce-index');
                    startContainer = node.firstChild;

                    while ((node = walker.current())) {
                        if (node.nodeType == 1 && node.nodeName == "SPAN" && node.getAttribute('data-mce-index') !== null) {
                            if (node.getAttribute('data-mce-index') === currentIndex) {
                                endContainer = node.firstChild;
                            } else {
                                return;
                            }
                        }
                        walker[forward ? 'next' : 'prev']();
                    }
                }

                walker[forward ? 'next' : 'prev']();
            }
        }

        walkToIndex();

        if (startContainer && endContainer) {
            editor.focus();

            if (forward) {
                rng.setStart(startContainer, 0);
                rng.setEnd(endContainer, endContainer.length);
            } else {
                rng.setStart(endContainer, 0);
                rng.setEnd(startContainer, startContainer.length);
            }

            selection.scrollIntoView(startContainer.parentNode);
            selection.setRng(rng);
        }

        return currentIndex;
    }

    function removeNode(node) {
        node.parentNode.removeChild(node);
    }

    self.first = function() {
        currentIndex = moveSelection(true, true);
        return currentIndex !== -1;
    };

    self.next = function() {
        currentIndex = moveSelection(true);
        return currentIndex !== -1;
    };

    self.prev = function() {
        currentIndex = moveSelection(false);
        return currentIndex !== -1;
    };

    self.replace = function(text, forward, all) {
        var i, nodes, node, matchIndex, currentMatchIndex, nextIndex;

        if (currentIndex === -1) {
            currentIndex = moveSelection(forward);
        }

        nextIndex = moveSelection(forward);

        node = editor.getBody();
        nodes = tinymce.toArray(node.getElementsByTagName('span'));
        if (nodes.length) {
            for (i = 0; i < nodes.length; i++) {
                var nodeIndex = nodes[i].getAttribute('data-mce-index');

                if (nodeIndex === null || !nodeIndex.length) {
                    continue;
                }

                matchIndex = currentMatchIndex = nodes[i].getAttribute('data-mce-index');
                
                if (all || matchIndex === currentIndex) {
                    if (text.length) {
                        nodes[i].firstChild.nodeValue = text;
                        unwrap(nodes[i]);
                    } else {
                        removeNode(nodes[i]);
                    }

                    while (nodes[++i]) {
                        matchIndex = nodes[i].getAttribute('data-mce-index');

                        if (nodeIndex === null || !nodeIndex.length) {
                            continue;
                        }

                        if (matchIndex === currentMatchIndex) {
                            removeNode(nodes[i]);
                        } else {
                            i--;
                            break;
                        }
                    }
                }
            }
        }

        if (nextIndex == -1) {
            nextIndex = moveSelection(forward, true);
        }

        currentIndex = nextIndex;

        if (all) {
            editor.selection.setCursorLocation(editor.getBody(), 0);
        }

        editor.undoManager.add();

        return currentIndex !== -1;
    };

    self.replaceAll = function(text) {
        self.replace(text, true, true);
    };

    self.unmarkAllMatches = function() {
        var i, nodes, node;

        node = editor.getBody();
        nodes = node.getElementsByTagName('span');
        i = nodes.length;

        while (i--) {
            node = nodes[i];
            if (node.getAttribute('data-mce-index')) {
                unwrap(node);
            }
        }
    };
    
    function disabled( bool ) {
        var btns = [ $import('0002-btn'), $import('0003-btn'), $import('0004-btn'), $import('0005-btn') ];
        
        for ( var i=0, len=btns.length; i<len; i++ )
            btns[i].disabled = !!bool;
        
    }
    
    disabled( true );
    
    dlg.handlers.cmd_find = function() {

        var count, regEx, caseState, text, wholeWord;

        caseState = matchCase.checked;
        wholeWord = wholeWords.checked;

        text = txtFind.value;
        
        if (!text.length) {
            self.unmarkAllMatches();
            disabled(true);
            return;
        }

        text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        text = wholeWord ? '\\b' + text + '\\b' : text;
        regEx = new RegExp(text, caseState ? 'g' : 'gi');
        count = self.markAllMatches(regEx);

        if (count) {
            self.first();
        } else {
            DialogBox("Could not find the specified string", {
                "type": "error",
                "childOf": app,
                "modal": true,
                "caption": "Not found"
            } );
        }

        disabled(count === 0);
    }
    
    dlg.handlers.cmd_find_next = function() {
        self.next();
    }
    
    dlg.handlers.cmd_find_prev = function() {
        self.prev();
    }

    dlg.handlers.cmd_replace = function() {
        
        if (!self.replace(txtReplace.value)) {
            disabled(true);
        }
    }

    dlg.handlers.cmd_replace_all = function() {
        self.replaceAll(txtReplace.value);
        disabled(true);
    }

    return dlg;
    
    })();
    
    if ( !dlg.childOf ) {
        dlg.childOf = app;
    }
    
    dlg.querySelector('input').focus();
    
    return dlg;
    
    });
    
    Keyboard.bindKeyboardHandler( app, 'ctrl f', function() {
        app.appHandler( 'cmd_find' );
    });
}