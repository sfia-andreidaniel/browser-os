function MMC2_Users_cmd_user_edit( app ) {

    app.handlers.cmd_user_edit = function( userID ) {
        
        nativeApp = typeof nativeApp == 'undefined' ? true : !!nativeApp;
        
        if ( typeof userID == 'undefined' ) {
            if ( app.grid.selectedIndex == -1 )
                return;
            userID = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
        }
        
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
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACv0lEQVR42p2Sa0iTURzGn3fb++6mbnNT826myzQyirwmJWEkhEKxChKM0g8qQvWhJCqIILIP+aHUD0okGURSkRGVFBnewooocnkpm640HWOXdJf33fZ2toVN65MH/nB4nnN+5385FP5dIhJHaEZ8WBIWkekXXAt2Pce6b5PtTRKe0MPUissxIprpTkjbkLNOm4FIlTIgmi1WTI6P4vuXz8Meji0j0tz/ALRQRA/Erl2/TSaXg6KWs3meh2NxEbPfxt54PVwhkbiVgJoIdXQLI5EtE7VJGjQey0P99V4YTQtgXQ7YzfO1xGpdBiAvDkrDFfkUkeRSBnnZaThYmg9dyWbQvAvGKQOONz1Cz9tpLNqtQySjglBApTYltu2sLp0uLc5FZLwWAlkUKUoWdDkH4JwH7EY8eNaPhluj3Lhhtpo4HX6AXLcj3bS/MF66e0sCVIlZQEQSINUAAjoI8LIEYCKAaViMI+h5P4N7Az+cXa8movwAZe2eZHP9gXxBskYM6RoyufAEQEIAQvEfgDsI+GWE86ceU2YO1+4O+VqeTqkDJTAi6uqZfSknqvdmI06bA4TFkQzU5EdI/5bgMgMLM5gZG0bb44+4dN/QxHr4k6ENz6sqSeptO18hhjKVUBUEIAk6HhfgtgK2SVRf6HS3PzfuJOrrlWNMFIhlT+5cLM/SFW8FVGkhPSAjt06g6+U7HDrXPeJzO0qJagwFFEk2Fj2MqmpUZUg4dOaaoXKOQQBvwPRBCItEi4phDUZdNEztpy2uT33lxOrzAxKZzO0f1DXNKkooBM+xuLErGhYHi1OD5gDgSoEaKhmDoy/mQdEMeK8X5tY6C6vvz6YgELUoGrprhMqYpVoUIh/sLA9eIAx+Mp8XEQwFm0ewdMZrnYPtclkrRSVu+iqubE7FKpa7o26SQpjagNhMxWoAmNXbfgP9tPsNjXnSyQAAAABJRU5ErkJggg==",
            "caption": "User Properties",
            "closeable": true,
            "height": 390,
            "maximizeable": true,
            "maximized": false,
            "minHeight": 360,
            "minWidth": 285,
            "minimizeable": true,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 366,
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
    
        $export("0001-tabs", (new TabPanel({
            "initTabs": [{
                "id": "0001-sheet",
                "caption": "Properties",
                "closeable": false
            }, {
                "id": "0002-sheet",
                "caption": "MemberOf",
                "closeable": false
            }]
        })).chain(function() {
            $export("0001-sheet", this.getTabById("0001-sheet").getSheet());
            $export("0002-sheet", this.getTabById("0002-sheet").getSheet());
        }).setAttr("style", "top: 10px; left: 10px; right: 10px; bottom: 45px; position: absolute"));
    
        $export("0001-sheet", $import("0001-sheet"));
    
        dlg.properties = $export("0001-properties", (new PropertyGrid([{
            "name": "name",
            "type": "varchar",
            "label": "User Name",
            "value": "",
            "placeholder": "Will be used at login screen"
        }, {
            "name": "enabled",
            "type": "bool",
            "label": "Account Enabled",
            "value": false
        }, { 
            "name": "id",
            "type": "Generic",
            "label": "Account ID",
            "value": userID || ''
        } , {
            "name": "password",
            "type": "password",
            "label": "Password",
            "value": "",
            "placeholder": "Leave blank to unchange"
        }, {
            "name": "confirm",
            "type": "password",
            "label": "Confirm Password",
            "value": "",
            "password": true,
            "placeholder": "Must match with the Password field"
        }, {
            "name": "email",
            "type": "varchar",
            "label": "Email",
            "value": "",
            "placeholder": "user@site.com"
        }, {
            "name": "phone",
            "type": "varchar",
            "label": "Phone",
            "value": "",
            "placeholder": "(+xx)-xxx-xxx-xxx"
        }, {
            "name": "description",
            "type": "textarea",
            "label": "Description",
            "value": "",
            "placeholder": "The role of this user is to ..."
        }, {
            "name": "expireDate",
            "type": "date",
            "label": "Account Expires",
            "value": "",
            "valueFormat": "%Y-%m-%d %H:%i:%S",
            "displayFormat": "%Y-%m-%d %H:%i:%S"
        }])).chain(function() {
            this.hasToolbar = false;
            this.splitPosition = 126;
        }).setAttr("style", "top: 0px; left: 0px; position: absolute").setAnchors({
            "width": function(w, h) {
                return w - 4 + "px";
            },
            "height": function(w, h) {
                return h - 4 + "px";
            }
        }));
    
        $export("0002-sheet", $import("0002-sheet"));
    
        $export("0001-holder", (new DOMPlaceable({
            "caption": "Groups where this user is a member",
            "appearence": "opaque"
        })).setAttr("style", "top: 25px; left: 10px; right: 10px; position: absolute").setAnchors({
            "height": function(w, h) {
                return h - 120 + "px";
            }
        }));
    
        dlg.groupsList = $export("0003-holder", $('div', 'DOMPlaceable appearence-groove members-list').
            setAttr("style", "top: 30px; left: 10px; right: 10px; position: absolute; overflow-x: hidden; overflow-y: scroll").setAnchors({
                "height": function(w, h) {
                    return h - 70 + "px";
                }
            })
        );
    
        $export("0001-lbl", (new DOMLabel("Right click an item for more options")).setAttr("style", "top: 10px; left: 10px; position: absolute; text-overflow: ellipsis").setAnchors({
            "width": function(w, h) {
                return w - 20 + "px";
            }
        }));
    
        $export("0003-btn", (new Button("Remove from selected groups", (function() {
            dlg.appHandler('cmd_remove_member')
        }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
    
        $export("0002-holder", (new DOMPlaceable({
            "caption": "Add user to a group:",
            "appearence": "opaque"
        })).setAttr("style", "bottom: 10px; left: 10px; right: 10px; position: absolute; height: 50px"));
    
        $export("0002-lbl", (new DOMLabel("Add to group:")).setAttr("style", "top: 20px; left: 10px; width: 80px; position: absolute; text-overflow: ellipsis"));
    
        dlg.groups = $export("0001-drop", (new DropDown(undefined)).setItems((function() {
            var req = [];
            req.addPOST('do', 'get-groups-list');
            var rsp = $_JSON_POST( 'vfs/lib/mmc2/handler-groups.php', req );
            rsp = rsp || [];

            dlg.entities = rsp;

            for ( var i=0,len=rsp.length; i<len; i++ ) {
                rsp[i].id = parseInt( rsp[i].id.replace(/^cmd_groups\:/, '') );
            }
            return rsp;
        })()).setAttr("style", "top: 18px; left: 100px; position: absolute; margin: 0").setAnchors({
            "width": function(w, h) {
                return w - 155 + "px";
            }
        })).chain( function() {
            this.syncIcon();
        });
    
        $export("0004-btn", (new Button("Add", (function() {
            dlg.appHandler('cmd_add_member');
        }))).setAttr("style", "top: 18px; right: 10px; position: absolute"));
    
        $export("0001-btn", (new Button("Ok", (function() {
            dlg.appHandler('cmd_save');
        }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
    
        $export("0002-btn", (new Button("Cancel", (function() {
            dlg.appHandler('cmd_cancel');
        }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));
    
        $import("0001-dlg").insert($import("0001-tabs"));
        $import("0001-tabs").insert($import("0001-sheet"));
        $import("0001-sheet").insert($import("0001-properties"));
        $import("0001-tabs").insert($import("0002-sheet"));
        $import("0002-sheet").insert($import("0001-holder"));
        $import("0001-holder").insert($import("0003-holder"));
        $import("0001-holder").insert($import("0001-lbl"));
        $import("0001-holder").insert($import("0003-btn"));
        $import("0002-sheet").insert($import("0002-holder"));
        $import("0002-holder").insert($import("0002-lbl"));
        $import("0002-holder").insert($import("0001-drop"));
        $import("0002-holder").insert($import("0004-btn"));
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));

    
        dlg.handler = 'vfs/lib/mmc2/handler-users.php';
    
        /* Summary:
         *   dlg.properties - property grid collecting users's properties
         *   dlg.groupsList - a placeholder where to put policy's existing members
         *   dlg.groups     - a dropdown with all available groups from the system
         *   dlg.entities   - an array with available groups from the server
         
         *
         *  Handlers:
         *     cmd_add_member
         *     cmd_remove_member
         *     cmd_save
         *     cmd_cancel
         */
    
        MMC2_UserEditor_cmd_cancel( dlg );
        MMC2_UserEditor_cmd_add_member( dlg );
        MMC2_UserEditor_cmd_remove_member( dlg );
        MMC2_UserEditor_cmd_load_user( dlg );
        MMC2_UserEditor_cmd_save( dlg );
    
        /* Fetch the users and the groups list */
        
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        return dlg;

        
        
    };
    
}