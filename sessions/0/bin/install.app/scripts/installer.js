function JSPlatform_Install() {

    /* Init load data! */
    
    var data = (function() {
        var req = [];
        req.addPOST('do', 'load-config');
        var rsp = $_JSON_POST( 'build/jsplatform.install.php', req );
        if (rsp === null) {
            var d = DialogBox("Error loading configuration.\n\nInstall program will now reboot your web application!", {
                "type": "error",
                "buttons": {
                    "Ok": function() {
                        window.location = '.';
                    }
                }
            });
            d.modal = true;
            d.moveable = false;
            d.maximizeable = false;
            d.resizeable = false;
        }
        return rsp;
    })();

    if (!data)
        return;
  
    console.log( data );

    var dlg = new Dialog({
        "caption": "Configure JSPlatform",
        "width": Math.min( getMaxX() - 100, 570),
        "height": Math.min( getMaxY() - 100, 380),
        "minimizeable": false,
        "closeable": false
    });
    
    window.lo = dlg;
    
    var tabs = dlg.insert(
        (new TabPanel({
            "initTabs": [
                {
                    "caption": "Database"
                }
            ]
        })).setAnchors({
            "width": function(w,h) {
                return w - 10 + 'px';
            },
            "height": function(w,h) {
                return h - 50 + 'px';
            }
        }).setAttr(
            "style", "margin: 5px"
        )
    );

    var grid = tabs.getSheets(0).insert(
        (new PropertyGrid([
            {
                "label": "Database Config",
                "name": "database",
                "items": [
                    {
                        "name": "host",
                        "label": "Host",
                        "type": "varchar",
                        "value": "",
                        "placeholder": "Example: localhost, or 127.0.0.1"
                    },
                    {
                        "name": "user",
                        "label": "Username",
                        "type": "varchar",
                        "value": "",
                        "placeholder": "Example: root"
                    },
                    {
                        "name": "password",
                        "label": "Password",
                        "type": "password",
                        "value": "",
                        "placeholder": "Example: password"
                    },
                    {
                        "name": "database",
                        "label": "Database Name",
                        "type": "varchar",
                        "value": "",
                        "placeholder": "Example: jsplatform"
                    }
                ]
            },
            {
                "name": "login",
                "label": "Login Config",
                "items": [
                    {
                        "name": "user",
                        "label": "Root Login Name",
                        "value": "root",
                        "type": "varchar"
                    },
                    {
                        "name": "password",
                        "label": "Root Password",
                        "value": "",
                        "type": "password"
                    },
                    {
                        "name": "session",
                        "label": "Default Session Name",
                        "value": "",
                        "type": "varchar",
                        "placeholder": "JSPlatform"
                    }
                ]
            }
        ])).setAnchors({
            "width": function(w,h) {
                return w + 'px';
            },
            "height": function(w,h) {
                return h + 'px';
            }
        })
    );
    
    grid.splitPosition = 150;
    
    grid.values.database.host = data.database.host;
    grid.values.database.user = data.database.user;
    grid.values.database.password = data.database.password;
    grid.values.database.database = data.database.database;
    
    grid.values.login.user = data.login.user;
    grid.values.login.session = data.login.session;
        
    dlg.insert(
        (new Button('Apply', function() {
          dlg.applySettings();
        } )).setAttr(
            "style", "position: absolute; left: 5px; bottom: 10px; width: 50px"
        )
    );

    dlg.insert(
        (new Button('Reboot', function() {
          if (confirm("Reboot?"))
            window.location = 'logout.php';
        } )).setAttr(
            "style", "position: absolute; left: 65px; bottom: 10px; width: 50px"
        )
    );
    
    dlg.applySettings = function() {
        /* Setup database connection settings */
        var req = [];
        req.addPOST('do', 'set-connection' );
        
        if (!grid.values.database.host) {
          DialogBox("Please input a mysql hostname!", { "type": "error" });
          grid.inputs.database.host.focus();
          return;
        }
        
        if (!grid.values.database.user) {
          DialogBox("Please input a mysql username!", { "type": "error" });
          grid.inputs.database.user.focus();
          return;
        }
        
        if (!grid.values.database.password) {
          DialogBox("Please input a mysql password!", {"type": "error"});
          grid.inputs.database.password.focus();
          return;
        }
        
        if (!grid.values.database.database) {
          DialogBox("Please input a mysql database!", { "type": "error" });
          grid.inputs.database.database.focus();
          return;
        }
        
        if ( !grid.values.login.user ) {
          DialogBox("Please input default login user name!", { "type": "error" });
          grid.inputs.login.user.focus();
          return;
        }
        
        if ( !grid.values.login.password ) {
          DialogBox("Please input default password for root account!", { "type": "error" });
          grid.inputs.login.password.focus();
          return;
        }
        
        if ( !grid.values.login.session ) {
          DialogBox("Please input default session name!", { "type": "error" });
          grid.inputs.login.session.focus();
          return;
        }
        
        req.addPOST('host', grid.values.database.host );
        req.addPOST('user', grid.values.database.user );
        req.addPOST('password', grid.values.database.password );
        req.addPOST('database', grid.values.database.database );
        
        var rsp = $_POST( 'build/jsplatform.install.php', req );
        try {
          data = JSON.parse( rsp );
        } catch (E) {
          alert( rsp );
          return;
        }
        
        grid.values.database.host = data.database.host;
        grid.values.database.user = data.database.user;
        grid.values.database.password = data.database.password;
        grid.values.database.database = data.database.database;
        
        if ( data.flags.DB_CONNECTABLE == false ) {
          DialogBox("Setup could not connect to specified mysql database!", { "type": "error" });
          return;
        }
        
        /* Test database is created, and attempt to create it if necesarry */
        if ( data.flags.DB_IS_OK == false ) {
          if ( confirm("Although setup connected to mysql server, it could not select database `" + data.database.database + "`.\n" +
                       "Do you wish setup to attempt to create a new database?"
               )
          ) {
            var req = [];
            req.addPOST('do', 'create-database');
            req.addPOST('host', grid.values.database.host );
            req.addPOST('user', grid.values.database.user );
            req.addPOST('password', grid.values.database.password );
            req.addPOST('database', grid.values.database.database );
    
            var rsp = $_POST( 'build/jsplatform.install.php', req );
            try {
              data = JSON.parse( rsp );
            } catch (E) {
              DialogBox( rsp, { "type": "error" } );
              return;
            }
            
            if (data.flags.DB_IS_OK)
              alert("Successfully created database `" + grid.values.database.database + "`" );
            else
              return;
            
          } else return;
        }
        
        if ( data.flags.DB_TABLES_PRESENT == false ) {
          if (confirm("Setup detected that the JSPlatform mysql core tables are not present.\nDo you want to create them?")) {
            var req = [];
            req.addPOST('do', 'create-tables');
            var rsp = $_POST( 'build/jsplatform.install.php', req );
            try {
              data = JSON.parse( rsp );
            } catch (E) {
              DialogBox( rsp, { "type": "error" } );
              return;
            }
            
            if (data.flags.DB_TABLES_PRESENT)
              alert("Successfully created JSPlatform mysql core tables");
            else
              return;
          }
        }
        
        var req = [];
        req.addPOST('do', 'set-root-login');
        req.addPOST('user', grid.values.login.user);
        req.addPOST('pass', grid.values.login.password);
        req.addPOST('session', grid.values.login.session);
        
        var rsp = $_POST( 'build/jsplatform.install.php', req );
        try {
          data = JSON.parse( rsp );
        } catch (e) {
          DialogBox( rsp, {"type": "error"});
          return;
        }
        
        grid.values.database.host = data.database.host;
        grid.values.database.user = data.database.user;
        grid.values.database.password = data.database.password;
        grid.values.database.database = data.database.database;
        
        grid.values.login.user = data.login.user;
        // grid.values.login.password = '';
        grid.values.login.session = data.login.session;
        
        DialogBox("JSPlatform configuration saved and applied successfully.\n\nYou may now start using jsplatform by clicking the Reboot button");
    }
}