var MMC2_Snapins = MMC2_Snapins || [];

MMC2_Snapins.push({
    "name": "generic",
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
                "caption": "Management Console",
                "closeable": false,
                "maximizeable": false,
                "maximized": false,
                "minHeight": 50,
                "minWidth": 50,
                "minimizeable": false,
                "modal": false,
                "moveable": false,
                "resizeable": false,
                "scrollable": false,
                "visible": true,
                "childOf": placeIn,
                "x": 4,
                "y": 0
            })).chain(function() {
                Object.defineProperty(this, "pid", {
                    "get": function() {
                        return $pid;
                    }
                });
                this.addClass("PID-" + $pid);
            }));
        
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
        }
});