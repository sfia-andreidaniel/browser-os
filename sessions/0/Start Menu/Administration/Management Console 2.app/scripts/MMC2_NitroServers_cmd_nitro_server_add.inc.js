function MMC2_NitroServers_cmd_nitro_server_add( app ) {

    app.handlers.cmd_nitro_server_add = function() {

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
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90DEhMBHMy+MLIAAAKBSURBVDjLjZE/TBNxHMXf7+567ZW2B22pESv/0gCJONRGY0jUCRoGgtEEEyHEP5M6uYh/dhIGY00c1Mkwmjg6QJggVSxBY9GUhDQFClcobYX2rsf96Z2TSS3S+LZv8r6fvJdH8A8NDIQxOzuDYPCcZ2ho6L5pYqtUEpcTidXdmZmPu/gfhcPhm/PzC7uCIJgbG2lzbS1ZmZx8mQdwutrH1D729w80B4Oh16OjY9c8Hi80zYCuEySTeUpV4QZwAkD6WMDw8PDi4ODVTllWTFE8JJJ0iHQ6C4piwHFWADDrJnA6XSf9fh8IAYnHk0ilMnA6HOA4DpzNBgBGXYCiaIhG42hp8QIgcDgciK7N4ftGDOV9CReunx+JfVj69sdP1QIIAVRVhywrAAhsVhbxXAzhO1cw9nAEOX0vWO0/AmAYC0Khbvh8blAUQNM0aBcNjT+EIG3DYI36FQzDBEURlBUR+WIBclmFYdXBuizYy+ZAGFgAuGCFhQ/wBqkFRF68lbrO9NinEo/Qe7EXrc2tAGOiiAMICQF80StX1EqeBUtKmZJxJIHFQis2K23/tLJoploTpNvWA55qRHlHRmUdKDjznKvJ5ecIh1zmF+hagCSWFxai817SofZkilkIO9uQNBnpVcE0/SraPF1EUTSoeqVmUADj47eqz1Ak8mb92dOpbPuN9pXO96fMS8tnTf8T9ywAHwA/AP9fFaan32Fi4vEDO2fXeS3L3u74bC80Sva5FHHv8zQ8TR5ssFkFQPbYFfr6Lr8KBLpBHWyhgf8CF8MisLTdEDM2oVV0QCSWujNGIs/viSWxpbGiMHfbNvsUHQ0/cna5kC45vjb/pOxlPlbt/w1kbQS0SWTwaQAAAABJRU5ErkJggg==",
            "caption": "Add new server to cloud",
            "closeable": true,
            "height": 301,
            "maximizeable": true,
            "maximized": false,
            "minHeight": 301,
            "minWidth": 391,
            "minimizeable": false,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 391,
            "childOf": getOwnerWindow( app.parentNode )
            
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        $export("0001-img", (new DOMImage({
            "src": "data:image/png;base64,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",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 10px; width: 32px; height: 32px; position: absolute; border-color: transparent"));
    
        $export("0001-lbl", (new DOMLabel("Add new server to cloud")).setAttr("style", "top: 20px; left: 50px; right: 10px; position: absolute; text-overflow: ellipsis; font-weight: bold; font-size: 1.3em"));
    
        $export("0001-holder", (new DOMPlaceable({
            "caption": "Server Details",
            "appearence": "opaque"
        })).setAttr("style", "top: 75px; left: 10px; right: 10px; position: absolute").setAnchors({
            "height": function(w, h) {
                return h - 120 + "px";
            }
        }));
    
        dlg.properties = $export("0002-properties", (new PropertyGrid([{
            "name": "string1",
            "type": "varchar",
            "label": "IP Address",
            "value": "",
            "placeholder": "120.24.34.45[:2121 for custom ssh port ]"
        }, {
            "name": "_grp1",
            "label": "Nitro client deployment",
            "items": [{
                "name": "bool1",
                "type": "bool",
                "label": "Deploy client?",
                "value": true
            }, {
                "name": "string4",
                "type": "varchar",
                "label": "SSH User",
                "value": "",
                "placeholder": ""
            }, {
                "name": "pwd2",
                "type": "password",
                "label": "SSH Pass",
                "value": "",
                "placeholder": ""
            }, {
                "name": "select1",
                "type": "dropdown",
                "label": "Server OS",
                "value": "",
                "values": [{
                    "id": "ubuntu",
                    "name": "Ubuntu Server (Latest)"
                }]
            }]
        }])).chain(function() {
            $export("0001-string", this.inputs.string1);
            $export("0001-bool", this.inputs._grp1.bool1);
            $export("0004-string", this.inputs._grp1.string4);
            $export("0002-pwd", this.inputs._grp1.pwd2);
            $export("0001-select", this.inputs._grp1.select1);
            this.hasToolbar = false;
            this.splitPosition = 100;
        }).setAttr("style", "top: 10px; left: 10px; position: absolute").setAnchors({
            "width": function(w, h) {
                return w - 20 + "px";
            },
            "height": function(w, h) {
                return h - 20 + "px";
            }
        }));
    
        $export("0001-string", $import("0001-string"));
    
        $export("0001-btn", (new Button("Add Server", (function() {}))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
    
        $import("0001-dlg").insert($import("0001-img"));
        $import("0001-dlg").insert($import("0001-lbl"));
        $import("0001-dlg").insert($import("0001-holder"));
        $import("0001-holder").insert($import("0002-properties"));
        $import("0001-dlg").insert($import("0001-btn"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        return dlg;

    }
}