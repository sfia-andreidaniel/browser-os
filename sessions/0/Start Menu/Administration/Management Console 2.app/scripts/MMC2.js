function MMC2() {
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

    var dlg = $export("0001-dlg", (new Dialog({
        "alwaysOnTop": false,
        "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADFElEQVR42nWSa0hTYRjHn222Uy43zmaozalDabqLikhgdDdXFgSKUvoldKVpln4oQjK7UClRfmgJWaIYQdpdSc2oLGxFdk80XeUEZ07ntuYuHnd2zjpntEODeuB/znt43//vPJeXBf8IlXI9giBhEl6oQIyi4VEouiKCz+cLudyQMI/Hjd170HptcnLEQJ9l0Y9k1SZewe7iUyujxClhfMEqFEXFQlTACeUthSVcDuD4AlgsJjCbpyE6WgJ1dRcu37rddJABpKdlb7hzu/P52NgYTBr1YPtlBqt1BmYpg8lkBJvNChiGweLiImg0ZTA6Ymy/2lxfwACkcWnynu4Xw51d1+Hzl5fg9Xqpv+J+Ay3aHADk5xeCY579+GJD9VYGEBmRgN6/+8Iy+O4pS/fqIRAEEQQIQOi3Wr0DUIH07YlT5asZgFAoZrW19LpMsz+W9fRe9wPoLDweTxCEVkbGWqpnmd8OH9mTSBAekhXofHNT33gojyO9cbMBSIJkyvgbQq9VqhTYkb13pmT/TgkFwBnA+fp2nUwWv0bbWO3PIFBGAEKLXsfGxkJ5ab1rV+HaSArgZADVR5vuZm3ZnFt7upjKgGDKCEBo0d8ikQjqz7UT2dsVUV7CY2YA+zRnLpeWlB0oq9gGJEn6RRtosdlskMuVoJCngUyEQERSjk+dLYv3ejEDA8jLrTpWe/zsmaJ9G4BDGRSKZEiUpYI8KQ0S4lXUJXL4Pn4anH6t63s9+F73aGJiuJX0EQQD2LSxUNNw4Uqz3TFFjTWGukhuWHC7/Hs4TkJN7aFGBOEO+EgfNm4Y0plmvs8xY6RDIlHKi/ZUdpjNpmm9fnSqsqoiJyNjtcAxTwC24APz3Ay4KSAXCYHOzo4nl7Q1WUEAOtRZRdvXr8s8qVQq06NWClk83jJwu7zUCHFAEDbY5+1EX1/Xm5YWbY3V9rM/CBAXl7q8UdtmDQ8XLmFz2MCidn7Z7KRh4tvc0NCHjwMD/c+GR9514zj21eejOvwngjKQSpPzhKgoxuGwO2fNJqPTadETBG6kDBj8J34D2dy7IBq56ukAAAAASUVORK5CYII=",
        "caption": "Management console | JSPlatform",
        "closeable": true,
        "height": Math.min( 500, getMaxY() - 100 ),
        "maximizeable": true,
        "maximized": false,
        "minHeight": 454,
        "minWidth": 50,
        "minimizeable": true,
        "modal": false,
        "moveable": true,
        "resizeable": true,
        "scrollable": false,
        "visible": true,
        "width": 800
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));

    dlg.addCss( 
        [ 
            '.SplitV > .DOM2Window .DOM2WindowTitle { background-image: none !important; border-radius: 0px !important; background-color: #333; color: white; }',
            '.SplitV > .DOM2Window { border-radius: 0px !important; -webkit-border-radius: 0px !important; border-color: transparent; box-shadow: none !important; }',
            '.SplitV > .DOM2Window .DOM2WindowModalButtonsHolder { display:none }'
        ].join("\n")
    );

    dlg.split = $export("0001-split", (new Splitter()).setAttr("style", "top: 4px; left: 1px; right: 1px; bottom: 20px; position: absolute; border: none").chain(function() {
        this.split([250], "V");
        $export("0001-cell", this.cells(0));
        $export("0002-cell", this.cells(1));
    }));

    $export("0001-cell", $import("0001-cell"));

    dlg.tree = $export("0001-tree", (new Tree({
        "name": "JSPlatform",
        "id": '',
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADFElEQVR42nWSa0hTYRjHn222Uy43zmaozalDabqLikhgdDdXFgSKUvoldKVpln4oQjK7UClRfmgJWaIYQdpdSc2oLGxFdk80XeUEZ07ntuYuHnd2zjpntEODeuB/znt43//vPJeXBf8IlXI9giBhEl6oQIyi4VEouiKCz+cLudyQMI/Hjd170HptcnLEQJ9l0Y9k1SZewe7iUyujxClhfMEqFEXFQlTACeUthSVcDuD4AlgsJjCbpyE6WgJ1dRcu37rddJABpKdlb7hzu/P52NgYTBr1YPtlBqt1BmYpg8lkBJvNChiGweLiImg0ZTA6Ymy/2lxfwACkcWnynu4Xw51d1+Hzl5fg9Xqpv+J+Ay3aHADk5xeCY579+GJD9VYGEBmRgN6/+8Iy+O4pS/fqIRAEEQQIQOi3Wr0DUIH07YlT5asZgFAoZrW19LpMsz+W9fRe9wPoLDweTxCEVkbGWqpnmd8OH9mTSBAekhXofHNT33gojyO9cbMBSIJkyvgbQq9VqhTYkb13pmT/TgkFwBnA+fp2nUwWv0bbWO3PIFBGAEKLXsfGxkJ5ab1rV+HaSArgZADVR5vuZm3ZnFt7upjKgGDKCEBo0d8ikQjqz7UT2dsVUV7CY2YA+zRnLpeWlB0oq9gGJEn6RRtosdlskMuVoJCngUyEQERSjk+dLYv3ejEDA8jLrTpWe/zsmaJ9G4BDGRSKZEiUpYI8KQ0S4lXUJXL4Pn4anH6t63s9+F73aGJiuJX0EQQD2LSxUNNw4Uqz3TFFjTWGukhuWHC7/Hs4TkJN7aFGBOEO+EgfNm4Y0plmvs8xY6RDIlHKi/ZUdpjNpmm9fnSqsqoiJyNjtcAxTwC24APz3Ay4KSAXCYHOzo4nl7Q1WUEAOtRZRdvXr8s8qVQq06NWClk83jJwu7zUCHFAEDbY5+1EX1/Xm5YWbY3V9rM/CBAXl7q8UdtmDQ8XLmFz2MCidn7Z7KRh4tvc0NCHjwMD/c+GR9514zj21eejOvwngjKQSpPzhKgoxuGwO2fNJqPTadETBG6kDBj8J34D2dy7IBq56ukAAAAASUVORK5CYII=",
        "items": []
    })).setAttr("style", "top: 0px; left: 0px; bottom: 0px; position: absolute").setAnchors({
        "width": function(w, h) {
            return w + 'px';
        }
    }));

    $export("0002-cell", $import("0002-cell"));

    $import("0001-dlg").insert($import("0001-split"));
    $import("0001-split").insert($import("0001-cell"));
    $import("0001-cell").insert($import("0001-tree"));
    $import("0001-split").insert($import("0002-cell"));

    MMC2_Menu( dlg );
    MMC2_cmd_refresh( dlg );
    MMC2_Tree( dlg );

    MMC2_SnapIn( dlg );

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);

    window.mmc2 = dlg;

    return dlg;
};