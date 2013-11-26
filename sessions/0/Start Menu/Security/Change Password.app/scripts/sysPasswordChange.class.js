function sysPasswordChange() {
    
    /*

    var dlg = new DOM2Window({
        'width': 308,
        'height':320,
        'caption': 'Change Password',
        'minimizeable': false,
        'maximizeable': false,
        'appIcon': '',
        'resizeable': false
    });
    
    dlg.insert($('img')).setAttr('src', 'img/login.png');
    
    dlg.tbl = (new SimpleTable());
    
    dlg.tbl.className=  'changePasswordTable';
    
    dlg.userName = (new TextBox($_SESSION.UNAME)).setAttr('readonly', 'readonly');
    dlg.oldPass  = (new TextBox('')).setAttr('type', 'password');
    dlg.newPass  = (new TextBox('')).setAttr('type', 'password');
    dlg.confPass = (new TextBox('')).setAttr('type', 'password');
    dlg.strength = (new TextBox('')).setAttr('readonly', 'readonly');
    dlg.strength.value = 'No strength';
    
    dlg.tbl.tr(['<nobr>User Name:</nobr>', dlg.userName]);
    dlg.tbl.tr(['<nobr>Old Password:</nobr>', dlg.oldPass]);
    dlg.tbl.tr(['<nobr>New Password:</nobr>', dlg.newPass]);
    dlg.tbl.tr(['<nobr>Confirm New Password:</nobr>', dlg.confPass]);
    dlg.tbl.tr(['<nobr>*Password Strength:</nobr>', dlg.strength]);
    
    dlg.insert($('hr'));
    
    dlg.insert(dlg.tbl);
    
    
    dlg.newPass.addEventListener('keyup', dlg.updatePasswordStrength, true);
    dlg.confPass.addEventListener('keyup', dlg.updatePasswordStrength, true);
    
    dlg.changePass = function() {
        if (dlg.oldPass.value == '') {
            alert('Please enter your old password first!');
            dlg.oldPass.focus();
            return;
        }
        if (dlg.newPass.value == '') {
            alert('Plase enter your new password!');
            dlg.newPass.focus();
            return;
        }
        if (dlg.confPass.value == '') {
            alert('Please confirm your password!');
            dlg.confPass.focus();
            return;
        }
        if (dlg.newPass.value != dlg.confPass.value) {
            alert("Passwords don't match!");
            dlg.newPass.focus();
        }
        var req = [];
        req.addPOST('old_pass', dlg.oldPass.value);
        req.addPOST('new_pass', dlg.newPass.value);
        
        if ($_JSON_POST('vfs/lib/passwd/handler.php', req) == 'ok') {
            alert('Passwords changed successfully!');
            dlg.close();
        }
    };
    
    dlg.insert(new Button('Change my Password', function() { dlg.changePass(); })).setAttr('style', 'margin-top: 10px; margin-right: 10px');
    dlg.insert(new Button('Cancel', function() { dlg.close(); }));
    
    */
    
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
        "appIcon": "data:image/png;base64,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",
        "caption": "Change password",
        "closeable": true,
        "height": 361,
        "maximizeable": true,
        "maximized": false,
        "minHeight": 361,
        "minWidth": 373,
        "minimizeable": true,
        "modal": false,
        "moveable": true,
        "resizeable": true,
        "scrollable": false,
        "visible": true,
        "width": 373
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));


    var updatePasswordStrength = function() {
        if (newPass.value == '' && confPass.value == '') {
            strength.value = 'No strength';
        } else
        if (newPass.value != confPass.value) {
            strength.value = "Passwords don't match";
        } else {
            strength.value = testPasswordStrength(newPass.value);
        }
    };

    Keyboard.bindKeyboardHandler( dlg, 'enter', function() {
        dlg.appHandler( 'cmd_change_pass' );
    } );
    
    Keyboard.bindKeyboardHandler( dlg, 'esc', function() {
        dlg.close();
        dlg.purge();
    } );

    dlg.handlers.cmd_change_pass = function() {
        if (oldPass.value == '') {
            DialogBox('Please enter your old password first!', { "childOf": dlg, "modal": true, "type": "error" });
            return;
        }
        if (newPass.value == '') {
            DialogBox('Plase enter your new password!', { "childOf": dlg, "modal": true, "type": "error" });
            return;
        }
        if (confPass.value == '') {
            DialogBox('Please confirm your password!', { "childOf": dlg, "modal": true, "type": "error" });
            return;
        }
        if (newPass.value != confPass.value) {
            DialogBox("Passwords don't match!", { "childOf": dlg, "modal": true, "type": "error" });
            return;
        }
        
        var req = [];
        req.addPOST('old_pass', oldPass.value);
        req.addPOST('new_pass', newPass.value);
        
        if ($_JSON_POST('vfs/lib/passwd/handler.php', req) == 'ok') {
            DialogBox("Paswords were changed successfully", { "type": "info" });
            dlg.close();
            dlg.purge();
        }
    }




    $export("0001-img", (new DOMImage({
        "src": "img/login.png",
        "displayMode": "best"
    })).setAttr("style", "top: 10px; left: 10px; height: 57px; position: absolute; border: none").setAnchors({
        "width": function(w, h) {
            return w - 20 + "px";
        }
    }));

    $export("0001-lbl", (new DOMLabel("User name:")).setAttr("style", "top: 95px; left: 10px; width: 75px; position: absolute; text-overflow: ellipsis"));

    $export("0002-lbl", (new DOMLabel("Old password:")).setAttr("style", "top: 130px; left: 10px; width: 85px; position: absolute; text-overflow: ellipsis"));

    $export("0003-lbl", (new DOMLabel("New password:")).setAttr("style", "top: 165px; left: 10px; width: 90px; position: absolute; text-overflow: ellipsis"));

    $export("0004-lbl", (new DOMLabel("Confirm new password:")).setAttr("style", "top: 200px; left: 10px; width: 130px; position: absolute; text-overflow: ellipsis"));

    $export("0005-lbl", (new DOMLabel("Password strength:")).setAttr("style", "top: 260px; left: 10px; width: 115px; position: absolute; text-overflow: ellipsis"));

    $export("0001-btn", (new Button("Cancel", (function() {
        
        dlg.close();
        dlg.purge();
        
    }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));

    $export("0002-btn", (new Button("Change password", (function() {
        
        dlg.appHandler( 'cmd_change_pass' );
        
    }))).setAttr("style", "bottom: 10px; right: 70px; position: absolute"));

    var userName = $export("0001-text", (new TextBox($_SESSION.UNAME)).setAttr("style", "top: 90px; left: 150px; position: absolute; margin: 0").setAnchors({
        "width": function(w, h) {
            return w - 170 + "px";
        }
    }).chain( function() {
        this.readOnly = this.disabled = true;
    } ) );

    var oldPass = $export("0002-text", (new TextBox("")).setAttr("style", "top: 125px; left: 150px; position: absolute; margin: 0").setAttr('type', 'password').setAnchors({
        "width": function(w, h) {
            return w - 170 + "px";
        }
    }));

    var newPass = $export("0003-text", (new TextBox("")).setAttr("style", "top: 160px; left: 150px; position: absolute; margin: 0").setAttr('type', 'password').setAnchors({
        "width": function(w, h) {
            return w - 170 + "px";
        }
    }));

    var confPass = $export("0004-text", (new TextBox("")).setAttr("style", "top: 195px; left: 150px; position: absolute; margin: 0").setAttr('type', 'password').setAnchors({
        "width": function(w, h) {
            return w - 170 + "px";
        }
    }));

    newPass.addCustomEventListener( 'change', updatePasswordStrength );
    confPass.addCustomEventListener( 'change', updatePasswordStrength );

    var strength = $export("0005-text", (new TextBox("No strength")).setAttr("style", "top: 255px; left: 150px; position: absolute; margin: 0").setAnchors({
        "width": function(w, h) {
            return w - 170 + "px";
        }
    }));

    $import("0001-dlg").insert($import("0001-img"));
    $import("0001-dlg").insert($import("0001-lbl"));
    $import("0001-dlg").insert($import("0002-lbl"));
    $import("0001-dlg").insert($import("0003-lbl"));
    $import("0001-dlg").insert($import("0004-lbl"));
    $import("0001-dlg").insert($import("0005-lbl"));
    $import("0001-dlg").insert($import("0001-btn"));
    $import("0001-dlg").insert($import("0002-btn"));
    $import("0001-dlg").insert($import("0001-text"));
    $import("0001-dlg").insert($import("0002-text"));
    $import("0001-dlg").insert($import("0003-text"));
    $import("0001-dlg").insert($import("0004-text"));
    $import("0001-dlg").insert($import("0005-text"));

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);

    return dlg;
    
}