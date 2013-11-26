function MMC2_Groups_cmd_group_edit( app ) {

    app.handlers.cmd_group_edit = function( groupID ) {
        
        if ( typeof groupID == 'undefined' ) {
            if ( app.grid.selectedIndex == -1 )
                return;
            groupID = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
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
            "appIcon": "data:image/gif;base64,R0lGODlhEAAQAPcAAKRng457rjw8i0VFfb+/3pyco3p6f3p6fa6usLe3uH9/gDg6kCwxoVFXm4iNuV5lihs2o4GOwCVHpMLO8oaj6wZAxRdQyYeYvKe86JS8+xZh1KzH7pG57Rxu0xZsyR2E8hF12hJ12mu2/3S6/xB52hF52ySX/yWX/224/3S7/3K0733A/3qlzp7Q/7bc/8Th+y2e/y6f/zSi/zWj/1+2/7Xd/8Pj/9Dr/0at9aPZ/8bn/9bu/zZ6pmDB/8Xo/069/9Tw/9b2/3ivoSFjPcr92RqgKL3yvjaINjqBOjdZN050TmmTacHNwcvTy/v8+9PU046PjjKDL1mXUnKpahyrANP3yyrOAi1pHmG8SDHOA6npl9Puyz23DXi6YGG7OGDnF5/ef7PvksDzpmrOK5XjZHbWMtnpzKjShJGzZ3eSGf//8f/+693bv//znpKNcJp6Dv/hge/grv/wvf/st9++bcWMD//GRndTCPzGVPzHWP/NatmeL+yqNfGxOvGyPv3FXv/Zl8J/DP/Qf7KGRMehZ593QbZlAraOW+nf1NFrDbyQZrxWAMmlh+Ghcv/Yu9OXcv/Qsselj//Gp6M4ALJ5XfjCpvjDqf3ayP69nvW6n/3HrsqrnPq2m8SPefrIs+SdhP+6of/JtfvNu7yflPqVcv/i2NhpStt1WO6plaxrW7tuXv+/scFYRLRyabejoOWEe/mWjbwNA81+et6CgtqUlI1mZuPKys26uvLl5ejj4/j19f////v7+/f39+/v7+3t7eXl5dnZ2dbW1tLS0sXFxbm5ubW1tZ+fn5ycnJmZmZeXl5OTk4GBgf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAM0ALAAAAAAQABAAAAj/AJs10zXqEKFCx3oJXMhwEyNEcegMesKQIa5HctbMgWOnFi1Yr24xtNWoDSBBf/iwmrUKVStXC3MpwqMnT59EoHbtUgNJVbCFbur42RNokahSlzw5irSsmRMmUtIYmnTnTaZQmixJ6oSsWZMpRohQioXmzCdOlTCRSgWs2ZIuYqqYYbOFRQBZp0wBaICgGRIvZMCE0SKEwgQCDiJg2HCBWBIuX8aUwcIjw40dL2wACcLhAZQrVKxkKeJhRYsaPnS4yKFCwq9kSo5EGVLhBw0UKUaI6IEDgkBfxIoVWPDBRIwZMmCc6DCgYrMEDDSAKEEihAUBxpzzGqZMgYEDzI4JA2sWEAA7",
            "caption": "Group Properties",
            "closeable": true,
            "height": 449,
            "maximizeable": true,
            "maximized": false,
            "minHeight": 400,
            "minWidth": 366,
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
    
        $export("0001-btn", (new Button("Ok", (function() {
            dlg.appHandler('cmd_save');
        }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
    
        $export("0002-btn", (new Button("Cancel", (function() {
            dlg.appHandler('cmd_cancel');
        }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));
    
        $export("0001-tabs", (new TabPanel({
            "initTabs": [{
                "id": "0001-sheet",
                "caption": "Properties",
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
    
        dlg.properties = $export("0001-properties", (new PropertyGrid([{
            "name": "name",
            "type": "varchar",
            "label": "Group Name",
            "value": "",
            "placeholder": "the name of the group"
        }, {
            "name": "id",
            "type": "Generic",
            "label": "Group ID",
            "value": groupID || ''
        }, {
            "name": "description",
            "type": "textarea",
            "label": "Description",
            "value": "",
            "placeholder": "Members of this group are allowed to ..."
        }])).chain(function() {
            this.hasToolbar = false;
            this.splitPosition = 100;
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
            "caption": "Users which are members of this group:",
            "appearence": "opaque"
        })).setAttr("style", "top: 25px; left: 10px; right: 10px; position: absolute").setAnchors({
            "height": function(w, h) {
                return h - 115 + "px";
            }
        }));
    
        $export("0001-lbl", (new DOMLabel("Right click a user for more options.")).setAttr("style", "top: 10px; left: 10px; position: absolute; text-overflow: ellipsis").setAnchors({
            "width": function(w, h) {
                return w - 20 + "px";
            }
        }));
    
        dlg.usersList = $export("0002-holder", $('div', 'DOMPlaceable appearence-groove members-list').setAttr("style", "top: 35px; left: 10px; right: 10px; position: absolute; bottom: 45px; overflow-x: hidden; overflow-y: scroll"));
    
        $export("0003-btn", (new Button("Remove selected users", (function() {
            dlg.appHandler('cmd_remove_member');
        }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
    
        $export("0003-holder", (new DOMPlaceable({
            "caption": "Add new users to this group:",
            "appearence": "opaque"
        })).setAttr("style", "bottom: 10px; left: 10px; right: 10px; position: absolute; height: 50px"));
    
        $export("0002-lbl", (new DOMLabel("Add this user:")).setAttr("style", "top: 15px; left: 10px; width: 80px; position: absolute; text-overflow: ellipsis"));
    
        dlg.users = $export("0001-drop", (new DropDown(undefined)).setItems((function() {
            var req = [];
            req.addPOST('do', 'get-users-list');
            var rsp = $_JSON_POST( 'vfs/lib/mmc2/handler-users.php', req );
            rsp = rsp || [];

            dlg.entities = rsp;

            for ( var i=0,len=rsp.length; i<len; i++ ) {
                rsp[i].id = parseInt( rsp[i].id.replace(/^cmd_users\:/, '') );
            }
            
            return rsp;
        })()).setAttr("style", "top: 14px; left: 95px; position: absolute; margin: 0; right: 55px").chain(function() {
            this.syncIcon();
        }));
    
        $export("0004-btn", (new Button("Add", (function() {
            dlg.appHandler('cmd_add_member');
        }))).setAttr("style", "top: 14px; right: 10px; position: absolute"));
    
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
        $import("0001-dlg").insert($import("0001-tabs"));
        $import("0001-tabs").insert($import("0001-sheet"));
        $import("0001-sheet").insert($import("0001-properties"));
        $import("0001-tabs").insert($import("0002-sheet"));
        $import("0002-sheet").insert($import("0001-holder"));
        $import("0001-holder").insert($import("0001-lbl"));
        $import("0001-holder").insert($import("0002-holder"));
        $import("0001-holder").insert($import("0003-btn"));
        $import("0002-sheet").insert($import("0003-holder"));
        $import("0003-holder").insert($import("0002-lbl"));
        $import("0003-holder").insert($import("0001-drop"));
        $import("0003-holder").insert($import("0004-btn"));
        
        dlg.handler = 'vfs/lib/mmc2/handler-groups.php';
    
        /* Summary:
         *   dlg.properties - property grid collecting users's properties
         *   dlg.usersList  - a placeholder where to put groups's existing members
         *   dlg.users      - a dropdown with all available users from the system
         *   dlg.entities   - an array with available users from the server
         
         *
         *  Handlers:
         *     cmd_add_member
         *     cmd_remove_member
         *     cmd_save
         *     cmd_cancel
         */
    
        MMC2_GroupEditor_cmd_cancel( dlg );
        MMC2_GroupEditor_cmd_add_member( dlg );
        MMC2_GroupEditor_cmd_load_group( dlg );
        MMC2_GroupEditor_cmd_remove_member( dlg );
        MMC2_GroupEditor_cmd_save( dlg );
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        return dlg;

        
        
    };
    
}