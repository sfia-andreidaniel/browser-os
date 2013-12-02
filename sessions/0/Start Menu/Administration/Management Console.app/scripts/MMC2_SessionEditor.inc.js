function MMC2_Sessions_cmd_session_edit( app ) {

    app.handlers.cmd_session_edit = function( sessionID ) {
        
        if ( typeof sessionID == 'undefined') {
            if ( app.grid.selectedIndex == -1 )
                return;
            sessionID = app.grid.tbody.rows[ app.grid.selectedIndex ].primaryKey;
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
            "appIcon": "data:image/gif;base64,R0lGODlhEAAQAIQRAP9RUv+ezjFhnABhnGPP/wCezpSWlJyeY62ulM7PnP//nP//zv/PAM6eAJxhAM4wAJwAAP///wAAAP///////////////////////////////////////////////////yH5BAEKAB8ALAAAAAAQABAAAAV/4CeOpAg8ZSo2ASQWcDEgNN0wjoRIBSEnkcgi0lDkZLxfcLG45QSEAW8ANFiLOcRCIKUGDUScbpFICHRL8CEnIS8QBjQTLBFKEu9EXDsP2skJcGN9S3eBejxMCwaKC3cIgWcwTBKVlpAIApI+THhlmFBnA6MFVqZWmpqWq6ysIQA7",
            "caption": "Session Editor",
            "closeable": true,
            "height": 432,
            "maximizeable": true,
            "maximized": false,
            "minHeight": 432,
            "minWidth": 363,
            "minimizeable": true,
            "modal": false,
            "moveable": true,
            "resizeable": true,
            "scrollable": false,
            "visible": true,
            "width": 363,
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

        $export("0011-btn", (new Button("Apply", (function() {
            dlg.appHandler('cmd_save', true);
        }))).setAttr("style", "bottom: 10px; left: 50px; position: absolute"));
    
        $export("0002-btn", (new Button("Cancel", (function() {
            dlg.appHandler('cmd_cancel');
        }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));
    
        $export("0001-tabs", (new TabPanel({
            "initTabs": [{
                "id": "0000-sheet",
                "caption": "General",
                "closeable": false
            } , {
                "id": "0001-sheet",
                "caption": "Settings",
                "closeable": false
            }, {
                "id": "0002-sheet",
                "caption": "Startup",
                "closeable": false
            }]
        })).chain(function() {
            $export("0001-sheet", this.getTabById("0001-sheet").getSheet());
            $export("0002-sheet", this.getTabById("0002-sheet").getSheet());
            $export("0000-sheet", this.getTabById("0000-sheet").getSheet());
        }).setAttr("style", "top: 10px; left: 10px; right: 10px; bottom: 45px; position: absolute"));
    
        $export("0001-sheet", $import("0001-sheet"));
    
        $export("0001-holder", (new DOMPlaceable({
            "caption": "Sessions Variables",
            "appearence": "opaque"
        })).setAttr("style", "top: 25px; left: 10px; right: 10px; position: absolute").setAnchors({
            "height": function(w, h) {
                return h - 185 + "px";
            }
        }));
    
        dlg.variables = $export("0001-grid", (new DataGrid()).setAttr("style", "top: 10px; left: 10px; position: absolute").setAnchors({
            "width": function(w, h) {
                return w - 20 + "px";
            },
            "height": function(w, h) {
                return h - 50 + "px";
            }
        }).setProperty("selectable", true).setProperty("multiple", true).chain(function() {
            this.colWidths = [100, 100];
            this.th(["Name", "Value"]);
            this.setProperty("delrow", function(row) {
                //What to do when deleting a row
                return false;
            });
            this.enableResizing();
            this.enableSorting();
        }));
    
        $export("0003-btn", (new Button("Remove", (function() {
            dlg.appHandler('cmd_remove_variable');
        }))).setAttr("style", "bottom: 10px; left: 50px; position: absolute"));
    
        $export("0006-btn", (new Button("Add", (function() {
            dlg.appHandler('cmd_add_variable');
        }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
    
        $export("0002-holder", (new DOMPlaceable({
            "caption": "Default MySQL Database",
            "appearence": "opaque"
        })).setAttr("style", "bottom: 85px; left: 10px; right: 10px; position: absolute; height: 45px"));
    
        $export("0001-lbl", (new DOMLabel("Default Database:")).setAttr("style", "top: 15px; left: 55px; width: 105px; position: absolute; text-overflow: ellipsis"));
    
        $export("0001-img", (new DOMImage({
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAwBQTFRFHWJz6XkA9sWOuc7U8/f4/fTq520A/fLm7I4kfKSu2OPn7pg79siV7pxD+uPJWY2Y7ZY08KVSToWSIWZ2//78/vjw8PT2/OnV++vX755G++bQ3Obp7ps+AU5h7ps81+Lm1ODl7pUynbrCztzg8alZADhOu9DVTIORDVZoRX2LQHuK8rFpAEVZ/f3+9/r78atdAD5T8KZV7/P0/O/f4ertXI6aRn+NKWl5+dy7AEBV7pU56HMAzdzgzNvf7I0i64kbNXOCZ5ahnrzDAEhc520AUYaT76JMSYGP8KFL6oIV6oMP6XwDAEJX53EAGF9wAExfAEteAEZaAktf9sqZ6X4F++jSwdTZ7Iod7PH06HYA6HUA7pg4PnmH/O3c//z5ssnP8KJM8PT1///+/vv3755E759E+Pr74uvt/v7+6X4G0+Hk8rNs++nT/vz5+/z9//z6+du59L1/76BH/vr1/fTp/OzaO3eG+fv7ToSR7pk6B09i0eDi9suZ8rJr1eLmF15w6oMX3+nria2299Gn64Uc6/Hz64gXX42Zn73E5msA//7+/e/g7JAo4Ons8a1lCVJl6XcA6/Hy+d2+LGx9VYmV8rRu9b6B/vfw1eLl1uHn1uPm/vv4s8rQ2ubp7IgZ++bOMGp6S4KQMHB/JWd48KRO8fb3pMDH+8ubq8XLpsHI+dSt98yc/fDi7/T1o7/HFVNm9Pn68vb3gaex9Lp79Lt8bJqlOHSDPHeG++jR++DD8axfztvg6HkGzt7hH2Z2AERX/v7/9seSQHB/PW9++NawkLK7lra+/evZ7Isf6oIR+NGm6XsK87ZyAEFV9siXf6awK2x8LWd3EVhqElpsFFtuF15vBlJl6X0E986g6n4E/fXs/vfvOXWEOHaFO3eF755F8rBn759F+t/AJ2h68rBs6XoAwNTY9fn5+uHE+uLH/vz68KBI7pg3+vz87PLz+/z86HcA9vj56HcB9/n6//369Pj49Pj57PL07fL17fP16vDzGV5yGl9zs8rP7JIr////6ldiTQAAAmZJREFUOE9j+E8AMBCj4PnuGTBlWcpf0XQATTAxdw46DxHmDHI2l0ZVAVSgdvaafxUXSFha1l/DZxmGgjBLMyEDTpDwVgP+irMr/vfOLQfx0qpn6f7/DzQhzMDVVmff0v//exl0ngmdjf8+eb0NSEHdpce/IAostVgcLJ3+/z+qqmV0zyc+sd4HrEDe+UoEVEHZfyeDu28zFu93+u8AVMDgDFbA5e8HV5DHIuyTNSeQIe0bRMFeNAV3Pv/fZGAqpNr0f6ODz1+jq/tngRS0ykJNUFNd9PF/Y/9+HQ3p/0svqK5872qwWMjdzF0z4M8PsBv2HnLU+/9/3YKLHf//szgeZv6ve6xdvaLC1SzgN8QNB/TSQCau/QkiyzdkwIM94LIYWAE6mGiquVAdCBh0TIFSWBS8m7ItBgi2aynlYVeAEReYliCLMPwX1+aOBgIrtzX/LfRlKoFg16P/oiqS7BBlDMaekYpFKSkpvIK3bnyw7pGRk3nDGNVc7GVdClWwik0uGWpkKpuKaJeIyCsma4/8cMZYqIJTbA+h8kkpbGfAzJ2RHnEIBeKnI/Wnbdl8ju9/UipbNlhBQVQCkoL/L578s+M4MeFTYVIRdgX//+cmz04+wmZ3ewnb1P+sJSL/LcAmGEPdAHVAqW/Prddstf8ncVvx7Ywsyp/HyApVcPxgMBDwuLG9yX3ANo9pdWqnvYz1g/8CvoI8NSAJhuWMmSEhmd4nJcX/sxs2PL3p1XadTbH4f859zxAQ8GYQnR8KBDtKwAay873k637Usqfwy///0yV2ACWksOVNiT7DHHh0EJV58UYnAIw/0QgjR52SAAAAAElFTkSuQmCC",
            "displayMode": "best"
        })).setAttr("style", "top: 5px; left: 10px; width: 32px; height: 32px; position: absolute"));
    
        dlg.mysqlDatabases = 
        $export("0001-drop", (new DropDown(undefined)).setAttr("style", "top: 12px; left: 165px; position: absolute; margin: 0").setAnchors({
            "width": function(w, h) {
                return w - 175 + "px";
            }
        })).setProperty("disabled", true);
    
        $export("0003-holder", (new DOMPlaceable({
            "caption": "Security",
            "appearence": "opaque"
        })).setAttr("style", "bottom: 10px; left: 10px; right: 10px; position: absolute; height: 45px"));
    
        $export("0002-img", (new DOMImage({
            "src": "data:image/png;base64,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",
            "displayMode": "best"
        })).setAttr("style", "top: 5px; left: 10px; width: 32px; height: 32px; position: absolute; border-color: transparent"));
    
        $export("0002-lbl", (new DOMLabel("Manage access list:")).setAttr("style", "top: 15px; left: 55px; width: 110px; position: absolute; text-overflow: ellipsis"));
    
        var btnEditSecurity =
        $export("0004-btn", (new Button("Edit Security", (function() {
            dlg.appHandler('cmd_edit_policy');
        }))).setAttr("style", "top: 12px; left: 170px; position: absolute")).setProperty("disabled", true);
    
        $export("0002-sheet", $import("0002-sheet"));
    
        $import("0001-dlg").insert($import("0001-tabs"));
        $import("0001-tabs").insert($import("0001-sheet"));
        $import("0001-tabs").insert($import("0002-sheet"));

        dlg.startup = $export("0001-source", (new AceEditor()).setAttr("style", "top: 35px; left: 10px; right: 10px; bottom: 10px; width: auto; height: auto; position: absolute").chain(function() {
            this.value = "";
        }));
        
        dlg.paint();
        
        $export("0003-lbl", (new DOMLabel("Enter here startup commmands that will run")).setAttr("style", "top: 10px; left: 10px; position: absolute; text-overflow: ellipsis").setAnchors({
            "width": function(w, h) {
                return w - 20 + "px";
            }
        }));
        
        dlg.properties = $import('0000-sheet').insert(
            ( new PropertyGrid([{
                "name": "name",
                "label": "Name",
                "type": "varchar",
                "value": ""
            } , {
                "name": "id",
                "label": "ID",
                "type": "Generic",
                "value": sessionID || ""
            } , {
                "name": "policyId",
                "label": "Security Policy ID",
                "type": "Generic",
                "value": ""
            }]) ).setAttr("style", "position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px").chain(
                function() {
                    this.splitPosition = 100;
                }
            )
        );
    
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0011-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
        $import("0001-sheet").insert($import("0001-holder"));
        $import("0001-holder").insert($import("0001-grid"));
        $import("0001-holder").insert($import("0003-btn"));
        $import("0001-holder").insert($import("0006-btn"));
        $import("0001-sheet").insert($import("0002-holder"));
        $import("0002-holder").insert($import("0001-lbl"));
        $import("0002-holder").insert($import("0001-img"));
        $import("0002-holder").insert($import("0001-drop"));
        $import("0001-sheet").insert($import("0003-holder"));
        $import("0003-holder").insert($import("0002-img"));
        $import("0003-holder").insert($import("0002-lbl"));
        $import("0003-holder").insert($import("0004-btn"));
        $import("0002-sheet").insert($import("0001-source"));
        $import("0002-sheet").insert($import("0003-lbl"));


        dlg.handler = 'vfs/lib/mmc2/handler-sessions.php';
        var dbAdmin = '';
    
        /* Summary:
         *   btnEditSecurity    - button for editing security when clicked
         *   dlg.mysqlDatabases - drop down with the list of databases
         *   dlg.variables      - DataGrid with session variables
         *   dlg.startup        - CodeEditor containing startup code for that session
         *   dlg.databasesList  - array containing the names of the available databases on server
         *   dbAdmin            - '$__DBADMIN__' from jsplatform
         *
         *  Handlers:
         *     cmd_add_variable
         *     cmd_remove_variable
         *     cmd_save
         *     cmd_cancel
         *     cmd_edit_policy
         */
    
        MMC2_SessionEditor_cmd_cancel( dlg );
        MMC2_Policies_cmd_policy_edit( dlg, false );
    
        /* Fetch the list of databases from server and put them in the dropdown */
        dlg.databasesList = (function(){
            var req = [];
            req.addPOST('do', 'enum-databases');
            return $_JSON_POST(dlg.handler, req) || [];
        })();
        
        (function(){
            var items = [{
                'id': '',
                'name': "None",
                "icon": "img/mmc2/deny.png"
            }];
            for ( var i=0,len=dlg.databasesList.length; i<len; i++ ) {
                items.push({
                    "id": dlg.databasesList[i].replace(/^\!/, ''),
                    "name": dlg.databasesList[i].replace(/^\!/,''),
                    "icon": 'img/mmc2/db' + ( dlg.databasesList[i].charAt(0) == '!' ? '1' : '' ) + ".png"
                });
                
                if ( dlg.databasesList[i].charAt(0) == '!' )
                    dbAdmin = dlg.databasesList[i].replace(/^\!/, '');
            }
            dlg.mysqlDatabases.setItems( items );
        })();
    
        dlg.mysqlDatabases.value = dbAdmin;
        dlg.mysqlDatabases.syncIcon();
        
        if ( sessionID && parseInt(sessionID) > 0) {
            dlg.mysqlDatabases.disabled = false;
            btnEditSecurity.disabled = false;
        }
    
        MMC2_SessionEditor_cmd_add_variable( dlg );
        MMC2_SessionEditor_cmd_remove_variable( dlg );
        
        dlg.sessionID = sessionID;
        MMC2_SessionEditor_cmd_load_session( dlg, btnEditSecurity );
        MMC2_SessionEditor_cmd_edit_policy( dlg );
        MMC2_SessionEditor_cmd_save( dlg );
    
        dlg.paint();
        dlg.ready();
    
        return dlg;

        
        
    };
    
}