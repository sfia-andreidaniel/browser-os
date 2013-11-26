var MMC2_Snapins = MMC2_Snapins || [];

MMC2_Snapins.push({
    "name": "packager",
    
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
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1gERFRcPUqe0RAAAAbFJREFUOMudkr9LHEEUxz+zO7N7e3sJB54EvCDGQBJSiQpCuFYLkyZVSCCWlqawFeRIGxBCECxicX+C9mKnoI0ECwsPEdIcmnDJ/fL21rHYvb29X0TyLd7MvHnvw3tvRvAPfV1ydeyYB/ZXCtX9tkNsvDc+A2vDAKZyeLfyDYCjnS8ULy6iO9+r1yWwtrx5ObSC75+eA9C6qTL+Yo4n029IJBzSkzkK6wuObAfWrop9ydJJR/tKcY90dhav2US6GTATQQz3kGE/IDn+CsNKAb8wpcSQVgdQuyqSzEwOTJ6aybG7nef45IzXbz+QzY4xYlqdKgFKP3Y4Pz1A4KO1j5twAHDdJM/mV3lq2Cy0PADqf0pcl39iN6rdLUw8fgRagyBYQ5UON/tbAspSdwP8+m9AExLCR45eu3OnNQhB82+pG2AqFcXrthFhYpsbB8VnYBiAtGLuDkgMOMe/pgSw7CSeshC9GQTz0EKABhEiGo0GjmXHAQ5aqpDeb4PeiTymaqHs2EdSjkvF83vHFZXa65OmhVTxCh6OMfpykfspQDW1eQsYYuNjaotWbZn/UO1GF+4ANhCEVwgYCMMAAAAASUVORK5CYII=",
            "caption": "JSPlatform Packages",
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


        $export("0001-toolbar", [
        {
            "name": "View",
            "items": [{
                "caption": "Refresh Packages",
                "id": "cmd_refresh",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAL1SURBVFiF7VdbSFRRFF1r3xm11KGyCFEIIlEpiFAU6iOijxQl/HEIKkLCnx6mkvjhZ0ZFYWVBmFmIf06UVDLUTwhJGBPRRw/pAUERhUFZaq+5uw+dvHOdOy+1CFqwOXPv2WfvdfdZZx+Gqoq/Cfmr2f8TmAsC3HElV7Zd7Ut2vSvpxF6fIW73PkOlFYKMP0ogZXtfkdud0gGgCEw29SSYyDGk15eRmpZ6CIr9AAzrnBIXDcqF8e7Ku/NCIH3njSqleQZgbjQ/BR6JavNYz9b+eOLGL0IXIAKIMKoZwtU05FpmTf/+OSUwdqmyb2H6t0JSTwkRFAJRTAht99RcPxorbkIaCGFRbX8RTEyKcBqvAKyw+5rQ9aNdzrpIqg987Ky4/+nzeCnJeiG+CInFZnqBkEeE9i2R06TzWUmqAlZk1fpzSZ4dOV9WBQBLa/2tIFqsPqqo/tBZfnleCMwI6PWlLFuS+QLA9Gkh2t+fKzsQyX/O7wLtrf4uIj1C4rcBa5z8HTth9p5bTYRuBgAq3sL8sfdNR+V4PCQEfBz+aUycgGGwAcrs0LO6Uu4A6IqHAA1NpVp0RwSdyTpNUAJhTQZSEk/yyaBSEraWEkiYAIGAdR8NYUVend8TK3lend9jCCusawkkTsDltlVAmBN0pbXFIhB0pbWJMMe61uV2roDjMaTXZ6zMzRokUGp9r2CX/Pza+Ky9fNT6Pq/O7zFdaW0Edof7Y+jl65EN2lsdUQdR+0BB8+18M4gHABbYpt4A6Ffy3lSQEgAVAHJsfhNiYN3TY5uGnXLEbET5BwcaSI1Z+khQZePwiY0no/nEJECChU0D9SAOY2YlnDABRcuT4xtPqSJqgrhb8drmwfwgg92waeJ3oOlxiGrsenhsg2PZkyIAAF6vz3i6avkWgMWqWkyyeCpIgGTAhAYKnr+72esguFkTmA/8+39MZouIlxFJYlJXYjNaxpCFoBYzLWOY2bfc6TYMeZm24KGKhUhgaoyUUO2/I+ntF7XFAHbZGkUjAAAAAElFTkSuQmCC",
                "handler": dlg.appHandler
            }]
        } , {
            "name": "Packager",
            "items": [{
                "caption": "Build Package",
                "id": "cmd_package_build",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAQAAACJ4248AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAACAAAAAgAIf6nJ0AAAKoSURBVFjD7ZVbSFRRFIa/mcaRnEbGnCyFhMweuqAUQeGFSqgkG0WJIREKiXqTQDDDwrxUGhWWjnYjyvCCGCJiF0GEIHpoEAwGKnUygsyihygSxGx6OMaeM3PO4cwUPcT8sGCvtdf6/7X32XsfiCCC/xeF6TBhhyqXiDk/Q8VTsC78gwYG7oHPJ1msB+yNwh/pDIHIUQpvWmDOAeZB/XVHjgvBQMu7o1Fo3gUVFjCVSH7JtChc7ZFi5dWSXz8MTInavhfQVA3pmeriPh/k71ERj7PB1zkp6eYPSBuHhj5R6C2DphHhv58HjFLtWq+2qJrJ0QXeSf3Fh0fl5Y9WBOd0b4PMG1Du1NMAkPUytBXsXwnPbNLYuhVc2WLu+zEwtAvusxflta2HFicq82DYAbuvhbeNv63FDT0xwh/aLF+cM0aeb4wCLOf0kc9/1J4fm1aOpx6VxGMuwNSqgN2LB6In4WqBxnceAvMViWTJOyg6oJx32qLOMdGh4xBealAQX6N8W/IUDtv9anjeCs0mqDmovVuvU/0aMDjBlg3elOBEc75yA4YebQHjF/W5xzlgbYNlpyB3GvDVKSfONmu/dGM71UXSHohxlwfOe4S/sB6I9yOayVAnMiWpqPcq56fchqWJkOt33ZanSyUnhkTMag/gq7oOLqPCk7lPWT+rMzh3cEaeExUHG+qFH1sEhd/A5lZZ1Pa7yqvaG/DnynylvmO1CRCdSugwrIO6bu2D5a7Q914k9YfRwJlefeRqVpwME0+gozIMcQCLW5AVuEITL00MUzQQyR/AlCGNd7zV38CnLWAId+VqGKgVAv2b5IIPPeDohFs//a7f7N9UT4K2HIm4vVgKxY8LsZOLV8vUCO0bwT4avpQmEtwQe1kaG2tEA2X1f0AaQQRB+AWU2s64GU7qXgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMy0wMS0wM1QxMjozODozMyswMTowMM2WzvYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTMtMDEtMDNUMTI6Mzg6MzMrMDE6MDC8y3ZKAAAAAElFTkSuQmCC",
                "handler": dlg.appHandler
            } , {
                "caption": "Download Package",
                "id": "cmd_package_download",
                "icon": "data:image/png;base64,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",
                "handler": dlg.appHandler
            } , {
                "caption": "Install Package",
                "id": "cmd_package_install",
                "icon": "data:image/png;base64,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",
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
    
        $export("0001-img", (new DOMImage({
            "src": "data:image/png;base64,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",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 10px; width: 32px; height: 32px; position: absolute; border-color: transparent"));
    
        $export("0001-lbl", (new DOMLabel("JSPlatform software package manager")).setAttr("style", "top: 15px; left: 55px; position: absolute; text-overflow: ellipsis; font-weight: bold; font-size: 1.3em").setAnchors({
            "width": function(w, h) {
                return w - 60 + "px";
            }
        }));
    
        $export("0002-lbl", (new DOMLabel("Use this tool to keep your version of JSPlatform updated")).setAttr("style", "top: 30px; left: 55px; position: absolute; text-overflow: ellipsis").setAnchors({
            "width": function(w, h) {
                return w - 60 + "px";
            }
        }));
    
        $export("0003-lbl", (new DOMLabel("Available intalled packages on this server:")).setAttr("style", "top: 50px; left: 10px; width: 270px; position: absolute; text-overflow: ellipsis"));
    
        dlg.grid = $export("0001-grid", (new DataGrid()).setAttr("style", "top: 70px; left: 10px; position: absolute").setAnchors({
            "width": function(w, h) {
                return w - 20 + "px";
            },
            "height": function(w, h) {
                return h - 80 + "px";
            }
        }).setProperty("selectable", true).chain(function() {
            this.colWidths = [104, 80, 290, 80, 80 ];
            this.th(["Package Name", "Version", "Description", "Installed", "Buildable" ]);
            this.setProperty("delrow", function(row) {
                //What to do when deleting a row
                return false;
            });
            this.enableResizing();
            this.enableSorting();
        }));
    
        $import("0001-dlg").insert($import("0001-img"));
        $import("0001-dlg").insert($import("0001-lbl"));
        $import("0001-dlg").insert($import("0002-lbl"));
        $import("0001-dlg").insert($import("0003-lbl"));
        $import("0001-dlg").insert($import("0001-grid"));
        
        dlg.handler = 'vfs/lib/mmc2/handler-packager.php';

        dlg.escapeshellarg = function( arg ) {
            var ret = '';
            ret = arg.replace(/[^\\]'/g, function (m, i, s) {
                return m.slice(0, 1) + '\\\'';
            });
            return "'" + ret + "'";
        };

        dlg.serverInfo = function() {
            var req = [];
            req.addPOST('do', 'server-info');
            return $_JSON_POST( dlg.handler, req ) || {};
        }
        
        MMC2_Packages_cmd_refresh( dlg );
        
        MMC2_Packages_cmd_package_build( dlg );
        MMC2_Packages_cmd_package_download( dlg );
        MMC2_Packages_cmd_package_install( dlg );
        
        dlg.appHandler( 'cmd_refresh' );
        
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
    
    "activateContext": /^cmd_packager(\:|$)/
});