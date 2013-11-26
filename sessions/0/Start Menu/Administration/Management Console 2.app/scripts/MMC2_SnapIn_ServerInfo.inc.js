var MMC2_Snapins = MMC2_Snapins || [];

MMC2_Snapins.push({
    "name": "server",
    
    "create": function( placeIn ) {

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
            "appIcon": "data:image/gif;base64,R0lGODlhEAAQAMZUAAAA/2NjY2RkZGdnZ2hoaGtra21tbU1yp3BwcHNzc3R0dHZ2dnh4eHl5eX5+foCAgISEhIWGh4qKiouLi5GRkZGRkpKSkpiYmJycnJ6enp+fn5+goqWlpampqaysrK6urq6vt7CwsK6xua+xubS0tLW1tba2trq6uru7u8DAwMHBx8HCxMHDyMTExMXFxcjIyMrKys7Ozs3O08/Pz87P1NDQ0M/Q1NDR1tHT19LT1dPT09PT1dPT19TV2dXV19XW2tfX19bX29jZ3N7byNvb3tvc39zc393d4Nze4d7f4d/f4d/f4t/g4uDg4OLi5OXl6Ozs7u/v8fb29v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEAAH8ALAAAAAAQABAAAAekgH+Cg4JNMC0pKCYhL4SCVJBUSEZFRFAchJBDm0OQLCpCGUA6NVScAACcVBVBFzpRpqepqj8UMUuxnLqdPRMwSbmos5tUPBAuSLlDqLpUOA4pRsrMqjcMJ0TTw502CSRHB8rNIzQGH04+OZqqVCIgMgQxJSEeGhmRVBEbMjJPAoMzOqyg8cADBQUICgwI0ECQFAs7mBRRssARoSkYHDRAKMHin0AAOw==",
            "caption": "Server Information",
            "closeable": false,
            "maximizeable": false,
            "maximized": false,
            "minHeight": 50,
            "minWidth": 50,
            "minimizeable": false,
            "modal": false,
            "moveable": true,
            "resizeable": false,
            "scrollable": false,
            "visible": true,
            "x": 4,
            "y": 0,
            "childOf": placeIn
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        $export("0001-holder", (new DOMPlaceable({
            "caption": "Server Info",
            "appearence": "opaque"
        })).setAttr("style", "top: 25px; left: 10px; right: 10px; position: absolute;").setAnchors({
            "height": function(w,h) {
                return ( ( h / 2 ) >> 0 ) - 40 + "px";
            }
        }));
    
        dlg.hwInfo = $export("0001-grid", (new DataGrid()).setAttr("style", "top: 5px; left: 65px; position: absolute").setAnchors({
            "width": function(w, h) {
                return w - 73 + "px";
            },
            "height": function(w, h) {
                return h - 12 + "px";
            }
        }).setProperty("selectable", true).chain(function() {
            this.colWidths = [150, dlg.width - 200 ];
            this.th(["Property", "Value"]);
            this.setProperty("delrow", function(row) {
                //What to do when deleting a row
                return false;
            });
            this.enableResizing();
        }));
    
        $export("0001-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4dJREFUeNqsV91LFUEUPzN7b9lDEBVChoaK5EdgpkhW9qUpSSRC9VD/QQ/1WA/lg9FDCEE+9B8UoYKUHyFhiqFRBPmSWFJCgb30Ztp1d2emc2b36lW8u+Pd3cswd3fPb+Y35/z2nBmmlIJsF2Ms/TfR9bS3n3GrPcg+E6ekeNl589oVvHXTz7fCMgMCVmfP876CggMd5YeLcWAFQRQIwTiDua8LsLj4e6Dr1vWr+EjkSiBx/8mzAQn8UlVlCSSTCZAGHuBI3HFc+DL7AzjIoQe3b3SQJ7acix5ma3jtvtfzQgm8WbGFWk456q9BIzuyJxzhaZxscyVCFpOHg4AjJEzMfAeDxWd4D+D8sVIQHigP29JWdmEESE3gIgG6mmqKjQm8nVnwcEqmpQG5ECC/adFZFoPu3nfAUWAsyBybRKHWVxR6Yg1xWyJ8fgUCB6SBaHKLs6AF+RS8iQmnIhOgFaErpVBQV3YwcOqNGKVxYbIx8oAmgL+m6jJjDbz5PO8RiCUE2CgpPeqb1N94qAbQvrasQOMiE6BYSil1b+HknPNQAsy3T+MiaoChmCSuRkJ1aX6IANdRZE84FWJvFgKKJSq6ua4cjLIRemr005yHi0MDrvTye3cf5gEDB9BXe7QkX+Ni0oBYzwOUY8NEoNQGXDQPMFoRpmNsVUV7gRl4gOYke8IpBtE94Lqeoi/WVxpr4PXHWY2LKRVLdD2Hx/1TuNkw8ADG/sihfd5XEAcB/T0zzAMW1zrYWC7Xa4Py654uwWgnZWxfgdQVrqJwjz8VW6v5HIeweJ6+cZkAN2Hp2As7pXGxFCNXCD8fqE2hxumZBQ+nSjSnO2d+QWOLV4bHh+Y8AnEUI4pleiiWTrf6Ha4YbLjb8E17wHGWYWxkHmgHwZ1VxO2M7gGmQyB0dlnbkGaMKZmNJJz1x7YfIEaeczU+cANr5AHXy+utp2txlQ60NNaC7fertg0XTtVgvwot2DvYtzbWYCkWGqciE2BMC5B+g2Pvoe3scXg1Ng1t57L0+J7syF7jQjIXN0lEDrqS+stNDTA4Pg3tzSdgKEtP78kuExc9BNLbkAyPf4CkZcHIRHBPdmQfy54wfUTbkUwCbONcQCJkBoUjjIBKrSxNDY9OnqT9wHYvOiMSHgKoh50N6UhVhG2/qbc2XXQy/oPtJ52McjqcYrfLP1qxHAjQ4Cls/7IdTv8LMADVFKO23stC/AAAAABJRU5ErkJggg==",
            "displayMode": "best"
        })).setAttr("style", "top: 5px; left: 15px; width: 32px; height: 32px; position: absolute; border-color: transparent"));
    
        $export("0002-holder", (new DOMPlaceable({
            "caption": "Software Components",
            "appearence": "opaque"
        })).setAttr("style", "bottom: 10px; left: 10px; right: 10px; position: absolute").setAnchors({
            "height": function(w, h) {
                return ( ( h / 2 ) >> 0 ) - 20 + "px";
            }
        }));
    
        dlg.swInfo = $export("0002-grid", (new DataGrid()).setAttr("style", "top: 5px; left: 65px; position: absolute").setAnchors({
            "width": function(w, h) {
                return w - 72 + "px";
            },
            "height": function(w, h) {
                return h - 10 + "px";
            }
        }).setProperty("selectable", true).chain(function() {
            this.colWidths = [150, dlg.width - 200 ];
            this.th(["Component", "Status"]);
            this.setProperty("delrow", function(row) {
                //What to do when deleting a row
                return false;
            });
            this.enableResizing();
        }));
    
        disableSelection( dlg.swInfo );
        disableSelection( dlg.hwInfo );
    
        $export("0002-img", (new DOMImage({
            "src": "data:image/png;base64,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",
            "displayMode": "best"
        })).setAttr("style", "top: 5px; left: 15px; width: 32px; height: 32px; position: absolute; border-color: transparent"));
    
        $export("0001-toolbar", [{
            "name": "Toolbar Group Caption",
            "items": [{
                "caption": "Refresh",
                "id": "cmd_server_info_refresh",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAL1SURBVFiF7VdbSFRRFF1r3xm11KGyCFEIIlEpiFAU6iOijxQl/HEIKkLCnx6mkvjhZ0ZFYWVBmFmIf06UVDLUTwhJGBPRRw/pAUERhUFZaq+5uw+dvHOdOy+1CFqwOXPv2WfvdfdZZx+Gqoq/Cfmr2f8TmAsC3HElV7Zd7Ut2vSvpxF6fIW73PkOlFYKMP0ogZXtfkdud0gGgCEw29SSYyDGk15eRmpZ6CIr9AAzrnBIXDcqF8e7Ku/NCIH3njSqleQZgbjQ/BR6JavNYz9b+eOLGL0IXIAKIMKoZwtU05FpmTf/+OSUwdqmyb2H6t0JSTwkRFAJRTAht99RcPxorbkIaCGFRbX8RTEyKcBqvAKyw+5rQ9aNdzrpIqg987Ky4/+nzeCnJeiG+CInFZnqBkEeE9i2R06TzWUmqAlZk1fpzSZ4dOV9WBQBLa/2tIFqsPqqo/tBZfnleCMwI6PWlLFuS+QLA9Gkh2t+fKzsQyX/O7wLtrf4uIj1C4rcBa5z8HTth9p5bTYRuBgAq3sL8sfdNR+V4PCQEfBz+aUycgGGwAcrs0LO6Uu4A6IqHAA1NpVp0RwSdyTpNUAJhTQZSEk/yyaBSEraWEkiYAIGAdR8NYUVend8TK3lend9jCCusawkkTsDltlVAmBN0pbXFIhB0pbWJMMe61uV2roDjMaTXZ6zMzRokUGp9r2CX/Pza+Ky9fNT6Pq/O7zFdaW0Edof7Y+jl65EN2lsdUQdR+0BB8+18M4gHABbYpt4A6Ffy3lSQEgAVAHJsfhNiYN3TY5uGnXLEbET5BwcaSI1Z+khQZePwiY0no/nEJECChU0D9SAOY2YlnDABRcuT4xtPqSJqgrhb8drmwfwgg92waeJ3oOlxiGrsenhsg2PZkyIAAF6vz3i6avkWgMWqWkyyeCpIgGTAhAYKnr+72esguFkTmA/8+39MZouIlxFJYlJXYjNaxpCFoBYzLWOY2bfc6TYMeZm24KGKhUhgaoyUUO2/I+ntF7XFAHbZGkUjAAAAAElFTkSuQmCC",
                "handler": dlg.appHandler
            }]
        }].chain(function() {
            dlg.toolbars = this;
            var toolbar = dlg.toolbars;
            if (toolbar) {
                toolbar.setIconSize("normal");
                toolbar.setButtonLabels(true);
                toolbar.setTitles(false);
            }
        }));
    
        $import("0001-dlg").insert($import("0001-holder"));
        $import("0001-holder").insert($import("0001-grid"));
        $import("0001-holder").insert($import("0001-img"));
        $import("0001-dlg").insert($import("0002-holder"));
        $import("0002-holder").insert($import("0002-grid"));
        $import("0002-holder").insert($import("0002-img"));

        MMC2_ServerInfo_cmd_server_info_refresh( dlg );
        
        dlg.handler = 'vfs/lib/mmc2/handler-serverinfo.php';
        
        dlg.appHandler('cmd_server_info_refresh');
        
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        dlg.DOManchors = {
            "dummy": function(w,h) {
                this.width = w - 6;
                this.height = h - 2;
            }
        }
    
        return dlg;
    },
    
    "activateContext": /^cmd_server_info$/
});