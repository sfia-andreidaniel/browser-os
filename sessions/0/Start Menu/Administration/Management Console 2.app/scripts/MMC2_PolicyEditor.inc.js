function MMC2_Policies_cmd_policy_edit( app ) {

    app.handlers.cmd_policy_edit = function( policyID, nativeApp ) {
        
        nativeApp = typeof nativeApp == 'undefined' ? true : !!nativeApp;
        
        if ( typeof policyID == 'undefined' && nativeApp ) {
            if ( app.grid.selectedIndex == -1 )
                return;
            policyID = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
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
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2lpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM0M0I1MkY0MDNCRDExRTE4QTIwOThENzVDNTcwNzRCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM0M0I1MkYzMDNCRDExRTE4QTIwOThENzVDNTcwNzRCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzMgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOkFDMUYyRTgzMzI0QURGMTFBQUI4QzUzOTBEODVCNUIzIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkM5RDM0OTY2NEEzQ0REMTFCMDhBQkJCQ0ZGMTcyMTU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+uELhUwAAAixJREFUeNqkk89rE0EUx78zmd1uTLbaVKhELHgRlYqgRC9q1FpB+gd4yKF4EQVBDz141YMXT+JNQVEQ1IuCglBQGyqKBAWtPwpFA7GGpjHENE032R8Z3zSbmMRLwIEvvHkz773PezvLpJT4nyUSBzl2DTOMDDccAc5g6NjLgDhth/x7OSqTrNp459UbBT9lgNmMBHtykXdk5IzFzMHo6R1HTh3PLv4KKl9000br68vbU+VC9kZdylQHgWV3Q8mxPQcmxt88nyp++fD2sfLs3L3/WOzQxPjMwytp2nYk4LpgaKpsQWmLZMZQZv79gi5wXknZyqfO1B0RYNB8iQ0hvy6JMYZ0rh6ulJY5pFMLUwOFZUDXnJpVXuFlS4ajEQYzqFr1W2ijORvUsW21JrXS7yIEh0OXHrie3Co4+zH3eRbqjEhv0t2PpOsqiE1fCjQJrh4+c3fSWbVgV6uwLVLNQrEwjz4dWGc0FAwLTN+/c42SX+gmQCqZpMocQghqh8PzXBSLFgJUw9AomBKFTK3zHbRvYvE4ugn69JV/CL69bkvguK0hyl4JKEa2hriQaz1lb+xcbwQv8tJhTYLLjyQS+9ZsvVeC9E+pqQT36EmJdF7i1iuGE9sxGBsdhWc7cInAJQKXCPr7XegUaBh/tVjAwLM5IFuSa0OMkBH9vgSeOHryKWHmI+tZJTIAHg7BnEnJzf47QxN7qQIrW8IImVnlUz+M2f1Felhq/OU/AgwAUhb7sEqcK1oAAAAASUVORK5CYII=",
            "caption": "Edit Policy",
            "closeable": true,
            "height": 458,
            "maximizeable": true,
            "maximized": false,
            "minHeight": 360,
            "minWidth": 400,
            "minimizeable": true,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 400,
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
                "caption": "General",
                "closeable": false
            }, {
                "id": "0002-sheet",
                "caption": "Members",
                "closeable": false
            }]
        })).chain(function() {
            $export("0001-sheet", this.getTabById("0001-sheet").getSheet());
            $export("0002-sheet", this.getTabById("0002-sheet").getSheet());
        }).setAttr("style", "top: 10px; left: 10px; right: 10px; bottom: 45px; position: absolute"));
    
        $export("0001-sheet", $import("0001-sheet"));
    
        dlg.properties =
        
        $export("0001-properties", (new PropertyGrid([{
            "name": "name",
            "type": "varchar",
            "label": "Name",
            "value": "",
            "placeholder": "My special policy application"
        }, {
            "name": "id",
            "type": "Generic",
            "label": "Policy ID",
            "value": policyID || ''
        } , {
            "name": "code",
            "type": "varchar",
            "label": "Code",
            "value": "",
            "placeholder": "MY_SPECIAL_POLICY_APPLICATION"
        }, {
            "name": "description",
            "type": "textarea",
            "label": "Description",
            "value": "",
            "placeholder": "This policy does ... and affects ..."
        }, {
            "name": "enabled",
            "type": "bool",
            "label": "Enabled",
            "value": false
        }, {
            "name": "defaultAction",
            "type": "dropdown",
            "label": "Default Action",
            "value": "1",
            "values": [{
                "id": "1",
                "name": "Allow",
                "icon": "img/mmc2/allow.png"
            }, {
                "id": "0",
                "name": "Deny",
                "icon": "img/mmc2/deny.png"
            }]
        }])).chain(function() {
            this.hasToolbar = false;
            this.splitPosition = 107;
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
            "caption": "Policy Members",
            "appearence": "opaque"
        })).setAttr("style", "top: 25px; left: 10px; right: 10px; position: absolute").setAnchors({
            "height": function(w, h) {
                return h - 105 + "px";
            }
        }));
    
        $export("0004-btn", (new Button("Remove member", (function() {
            dlg.appHandler('cmd_remove_member');
        }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
    
        dlg.membersList = $export("0003-holder", ($('div', 'DOMPlaceable appearence-groove members-list') ).
            setAttr("style", "top: 10px; left: 10px; right: 10px; position: absolute; bottom: 45px; overflow-x: hidden; overflow-y: scroll"));
    
        $export("0002-holder", (new DOMPlaceable({
            "caption": "Add new member in policy",
            "appearence": "opaque"
        })).setAttr("style", "bottom: 10px; left: 10px; right: 10px; position: absolute; height: 45px"));
    
        $export("0001-lbl", (new DOMLabel("Add:")).setAttr("style", "top: 15px; left: 10px; width: 35px; position: absolute; text-overflow: ellipsis"));
    
        dlg.chooseFrom = $export("0001-drop", (new DropDown(undefined)).setItems([{
            "id": "group",
            "name": "Group",
            "icon": "img/mmc2/g.gif"
        }, {
            "id": "user",
            "name": "User",
            "icon": "img/mmc2/u1.png"
        }]).setAttr("style", "top: 13px; left: 40px; position: absolute; margin: 0; width: 70px; border-right-color: transparent;")).chain(function() {
            this.syncIcon();
        });
    
        dlg.members = $export("0002-drop", (new DropDown(undefined))
        .setAttr("style", "top: 13px; left: 110px; position: absolute; margin: 0; border-left-color: transparent;").setAnchors({
            "width": function(w, h) {
                return w - 270 + "px";
            }
        }));
    
        $export("0003-btn", (new Button("Add", (function() {
            dlg.appHandler('cmd_add_member');
        }))).setAttr("style", "top: 13px; right: 10px; position: absolute"));
    
        $export("0002-lbl", (new DOMLabel("Right:")).setAttr("style", "top: 15px; right: 105px; width: 45px; position: absolute; text-overflow: ellipsis"));
    
        dlg.rightType =
        $export("0003-drop", (new DropDown()).setItems([{
            "id": "1",
            "name": "Allow",
            "icon": "img/mmc2/allow.png"
        }, {
            "id": "0",
            "name": "Deny",
            "icon": "img/mmc2/deny.png"
        }]).setAttr("style", "top: 13px; right: 50px; width: 60px; position: absolute; margin: 0")).chain(function() {
            this.syncIcon();
        });
    
        $export("0001-btn", (new Button("Ok", (function() {
            dlg.appHandler('cmd_save');
        }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
    
        $export("0002-btn", (new Button("Cancel", (function() {
            dlg.appHandler('cmd_cancel');
        }))).setAttr("style", "bottom: 10px; left: 50px; position: absolute"));
    
        $import("0001-dlg").insert($import("0001-tabs"));
        $import("0001-tabs").insert($import("0001-sheet"));
        $import("0001-sheet").insert($import("0001-properties"));
        $import("0001-tabs").insert($import("0002-sheet"));
        $import("0002-sheet").insert($import("0001-holder"));
        $import("0001-holder").insert($import("0004-btn"));
        $import("0001-holder").insert($import("0003-holder"));
        $import("0002-sheet").insert($import("0002-holder"));
        $import("0002-holder").insert($import("0001-lbl"));
        $import("0002-holder").insert($import("0001-drop"));
        $import("0002-holder").insert($import("0002-drop"));
        $import("0002-holder").insert($import("0003-btn"));
        $import("0002-holder").insert($import("0002-lbl"));
        $import("0002-holder").insert($import("0003-drop"));
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
    
        dlg.handler = 'vfs/lib/mmc2/handler-policies.php';
    
        /* Summary:
         *   dlg.properties - property grid collecting policy's properties
         *   dlg.membersList- a placeholder where to put policy's existing members
         *   dlg.chooseFrom - what kind of entities will be displayed in dlg.members
         *   dlg.members    - members of type dlg.chooseFrom
         *   dlg.rightType  - what kind of right will have the newly added member
         *
         *  Handlers:
         *     cmd_add_member
         *     cmd_remove_member
         *     cmd_save
         *     cmd_cancel
         */
    
        MMC2_PolicyEditor_cmd_cancel( dlg );
    
        /* Fetch the users and the groups list */
        dlg.entities = {
            "user": (function(){
                var req = [];
                req.addPOST('do', 'get-users-list');
                var rsp = $_JSON_POST( 'vfs/lib/mmc2/handler-users.php', req );
                rsp = rsp || [];

                for ( var i=0,len=rsp.length; i<len; i++ ) {
                    rsp[i].id = parseInt( rsp[i].id.replace(/^cmd_users\:/, '') );
                }
                return rsp;
            })(),
            "group": (function(){
                var req = [];
                req.addPOST('do', 'get-groups-list');
                var rsp = $_JSON_POST( 'vfs/lib/mmc2/handler-groups.php', req );
                rsp = rsp || [];

                for ( var i=0,len=rsp.length; i<len; i++ ) {
                    rsp[i].id = parseInt( rsp[i].id.replace(/^cmd_groups\:/, '') );
                }
                return rsp;
            })()
        };
    
        MMC2_PolicyEditor_evt_change_choose_from( dlg );
        MMC2_PolicyEditor_cmd_add_member( dlg );
        MMC2_PolicyEditor_cmd_remove_member( dlg );
        MMC2_PolicyEditor_cmd_load_policy( dlg );
        MMC2_PolicyEditor_cmd_save( dlg, nativeApp );
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        return dlg;

        
        
    };
    
}