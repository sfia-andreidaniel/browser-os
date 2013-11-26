function MMC2_Packages_cmd_package_build( app ) {
    
    app.handlers.cmd_package_build = function() {
        
        var whichPackage = app.grid.selectedIndex == -1
            ? null
            : ( function() {
                var row = app.grid.tbody.rows[ app.grid.selectedIndex ];
                
                if ( row.cells[4].value != 'Yes' ) {
                    DialogBox("Package " + row.cells[0].value + " is not buildable!", {
                        "childOf":  getOwnerWindow( app.parentNode ),
                        "type": "error",
                        "caption": "Cannot build package!"
                    });
                    return false;
                }
                
                return row.primaryKey;
              })()
        
        if ( !whichPackage )
            return;
        
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
    
        var serverInfo = app.serverInfo();
        
        if ( !serverInfo.root )
            return;
        
        var root = serverInfo.root;
        
        //console.log( serverInfo );
        
        if (!root) {
            DialogBox("Sorry, cannot get the server document root", {
                "type": "error",
                "childOf": getOwnerWindow( app.parentNode )
            });
            return;
        }
    
        var dlg = $export("0001-dlg", (new Dialog({
            "alwaysOnTop": false,
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1gERFRcPUqe0RAAAAbFJREFUOMudkr9LHEEUxz+zO7N7e3sJB54EvCDGQBJSiQpCuFYLkyZVSCCWlqawFeRIGxBCECxicX+C9mKnoI0ECwsPEdIcmnDJ/fL21rHYvb29X0TyLd7MvHnvw3tvRvAPfV1ydeyYB/ZXCtX9tkNsvDc+A2vDAKZyeLfyDYCjnS8ULy6iO9+r1yWwtrx5ObSC75+eA9C6qTL+Yo4n029IJBzSkzkK6wuObAfWrop9ydJJR/tKcY90dhav2US6GTATQQz3kGE/IDn+CsNKAb8wpcSQVgdQuyqSzEwOTJ6aybG7nef45IzXbz+QzY4xYlqdKgFKP3Y4Pz1A4KO1j5twAHDdJM/mV3lq2Cy0PADqf0pcl39iN6rdLUw8fgRagyBYQ5UON/tbAspSdwP8+m9AExLCR45eu3OnNQhB82+pG2AqFcXrthFhYpsbB8VnYBiAtGLuDkgMOMe/pgSw7CSeshC9GQTz0EKABhEiGo0GjmXHAQ5aqpDeb4PeiTymaqHs2EdSjkvF83vHFZXa65OmhVTxCh6OMfpykfspQDW1eQsYYuNjaotWbZn/UO1GF+4ANhCEVwgYCMMAAAAASUVORK5CYII=",
            "caption": "Building Package \"" + whichPackage + "\" ...",
            "closeable": true,
            "height": 303,
            "maximizeable": true,
            "maximized": false,
            "minHeight": 303,
            "minWidth": 481,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 481,
            "childOf": getOwnerWindow( app.parentNode )
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        dlg.app = app;
        
        dlg.console = dlg.insert( $export("0001-source", (new Terminal( {
            "autoLogin": true,
            "exec": "cd " + app.escapeshellarg( root ) + " && sudo ./build-package " + app.escapeshellarg( whichPackage ) + " && exit"
        })).setAttr("style", "top: 15px; left: 57px; width: auto; height: auto; position: absolute").setAnchors({
            "width": function( w,h ) {
                return w - 65 + "px";
            },
            "height": function(w,h) {
                return h - 30 + "px";
            }
        })));
    
        dlg.console.readOnly = true;
    
        dlg.console.expect( [ {
            "when": /Successfully build package/,
            "then": function() {
                DialogBox("Package \"" + whichPackage + "\" has been successfully built", {
                    "childOf": getOwnerWindow( app.parentNode ),
                    "buttons": {
                        "Ok": function() {
                            
                        },
                        "Download": function() {
                            app.appHandler('cmd_package_download', whichPackage );
                        }
                    }
                });
                
                dlg.app.appHandler('cmd_refresh');
                
                dlg.close();
                dlg.purge();
                dlg = null;
            }
        } ], 600000, function() {

            dlg.app.appHandler( 'cmd_refresh' );
            
            DialogBox("It seems that the package could not be built!", {
                "childOf": getOwnerWindow( app.parentNode ),
                "type": "error"
            });
            
            dlg.close();
            dlg.purge();
            dlg = null;
            
        } );
    
        $export("0001-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAQAAACJ4248AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAACAAAAAgAIf6nJ0AAAKoSURBVFjD7ZVbSFRRFIa/mcaRnEbGnCyFhMweuqAUQeGFSqgkG0WJIREKiXqTQDDDwrxUGhWWjnYjyvCCGCJiF0GEIHpoEAwGKnUygsyihygSxGx6OMaeM3PO4cwUPcT8sGCvtdf6/7X32XsfiCCC/xeF6TBhhyqXiDk/Q8VTsC78gwYG7oHPJ1msB+yNwh/pDIHIUQpvWmDOAeZB/XVHjgvBQMu7o1Fo3gUVFjCVSH7JtChc7ZFi5dWSXz8MTInavhfQVA3pmeriPh/k71ERj7PB1zkp6eYPSBuHhj5R6C2DphHhv58HjFLtWq+2qJrJ0QXeSf3Fh0fl5Y9WBOd0b4PMG1Du1NMAkPUytBXsXwnPbNLYuhVc2WLu+zEwtAvusxflta2HFicq82DYAbuvhbeNv63FDT0xwh/aLF+cM0aeb4wCLOf0kc9/1J4fm1aOpx6VxGMuwNSqgN2LB6In4WqBxnceAvMViWTJOyg6oJx32qLOMdGh4xBealAQX6N8W/IUDtv9anjeCs0mqDmovVuvU/0aMDjBlg3elOBEc75yA4YebQHjF/W5xzlgbYNlpyB3GvDVKSfONmu/dGM71UXSHohxlwfOe4S/sB6I9yOayVAnMiWpqPcq56fchqWJkOt33ZanSyUnhkTMag/gq7oOLqPCk7lPWT+rMzh3cEaeExUHG+qFH1sEhd/A5lZZ1Pa7yqvaG/DnynylvmO1CRCdSugwrIO6bu2D5a7Q914k9YfRwJlefeRqVpwME0+gozIMcQCLW5AVuEITL00MUzQQyR/AlCGNd7zV38CnLWAId+VqGKgVAv2b5IIPPeDohFs//a7f7N9UT4K2HIm4vVgKxY8LsZOLV8vUCO0bwT4avpQmEtwQe1kaG2tEA2X1f0AaQQRB+AWU2s64GU7qXgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMy0wMS0wM1QxMjozODozMyswMTowMM2WzvYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTMtMDEtMDNUMTI6Mzg6MzMrMDE6MDC8y3ZKAAAAAElFTkSuQmCC",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 10px; width: 32px; height: 32px; position: absolute; border-color: transparent"));
    
        $import("0001-dlg").insert($import("0001-img"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
        
    }
    
}