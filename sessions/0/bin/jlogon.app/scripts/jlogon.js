function LogonLoader(showMenu) {

    var needInstall;

    if ( ( needInstall = (function() {
        // Check if JSPlatform in installed
        var req = [];
        req.addPOST('do', 'check-install');
        var rsp = $_JSON_POST('vfs/bin/jlogon.app/bin/jlogon.php', req );
        
        switch (true) {
        
            case rsp === false:
                return false;
                break;

            case rsp === true:
                AppExec("bin/install.app");
                return true;
                break;
                
            default:
                DialogBox("JSPlatform could not check it's installed state", {
                    "type": "error"
                } );
                return false;
                break;
        }
    })() ) ) {
        return;
    }

    var self = this;

    this.sessionStarted = function() {
        this.uid = $_JSON_POST('vfs/bin/jlogon.app/bin/jlogon.php', []);
        if (this.uid == -1) return false; else return true;
    }
    
    this.doLogin = function() {
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
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADSwAAA0sBr9neAQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJ6SURBVDiNhZNNSJRRFIaf833fmGPO4KRO/iQaaYWUVGBjINiixayiFgYF0cIgiNq0kdaRYG1cZIsighZF0g+lhBG1qKQfKyREa5SmHytUGGlER+ebuaeF4zCJ0Nnee5577vueV1SV5RIRAQoAYfVSIAUkNdPo5J7u2UCgO8RTVSxZupzbKQI6Mc/A/n7OAItZgIhYgLW3DP/OYnb0fqPPwEx2MlCjWJv8NJV5aQQ8WYCI2PX19Q3GmMqElQxSbLj6Kjkwmij4AhgAy7JSkUjkZV+Yy0EvNbmTOUB+aWnpdZ/P11BU6FU6eqj4evC8zqZytbEikUilJUvAlQBRVZmcnLwfeT7YyQl5E39HuG+MKCDBYHB7KBS6CwRcgyet2EBARBSYX9ZALcty/Xn8yaJ7hscA8gs89ITr8N4bGX6xpYTNhXlw5Nd3oqNDtLc2OytHAnBNxp3bl04n4tN22+PqLobGD2+s/X1y3RpTSdHxCQIlRYCsCqhZy7bqAg9b44N26XSUipowRycfUuvDLfQQx3csBhRlbVwuI6QBLjZx4Vy4jvjAfFfQ9UDHNTh18xbA6yneI7IspuMAqKqoqv1hmrhcoQoIsG/kI0/KDqz/EdPdnw896O2llqXdsDjrdIMokOeQ2Ti/39/S3Nz8SESMqtptjZXcqA52prypdOa1mKrOiIg30wyw4ADu3NzcHdd1d2W/Yozn0+wiC0k3ZpLJ2NTU1HjGrXwgHzVW5qotLAXHA9g5cgToGf7J4LN+THoGEcW2U4go6bRNsCqESSdob21xMqlK5oopIhbR0SFKyitAyv/1SAWTTjAz/RZYkNw45wD+F2sAF0j+BfZN96LjG/zsAAAAAElFTkSuQmCC",
            "caption": "Login to JSPlatform",
            "closeable": false,
            "height": 366,
            "maximizeable": false,
            "maximized": false,
            "minHeight": 50,
            "minWidth": 400,
            "minimizeable": false,
            "modal": false,
            "moveable": true,
            "resizeable": false,
            "scrollable": false,
            "visible": true,
            "width": 550
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        $export("0001-img", (new DOMImage({
            "src": "img/vector/jsplatform.svg",
            "displayMode": "best"
        })).setAttr("style", "top: 0px; left: 0px; right: 0; bottom: 0; position: absolute; border: none"));
    
        var loginUser = $export("0001-text", (new TextBox("")).setAttr("style", "top: 140px; left: 125px; position: absolute; margin: 0; right: 55px").setProperty("placeholder", "John Doe"));
    
        var loginPass = $export("0002-text", (new TextBox("")).setProperty("type", "passsword").setAttr("style", "top: 185px; left: 125px; position: absolute; margin: 0; right: 55px").setProperty("placeholder", "Type here your secret password").setAttr('type', 'password') );
    
        var authSources = $export("0001-drop", (new DropDown(undefined)).setItems( ( function() {
            return $_JSON_POST( 'vfs/bin/jlogon.app/bin/auth_sources.php', [] ) || [ {
                "id": "",
                "name": "Local Authentication"
            } ]
        } )() ).setAttr("style", "top: 235px; left: 125px; position: absolute; margin: 0; right: 255px"));
    
        $export("0001-lbl", (new DOMLabel("Username:", { "for": loginUser })).setAttr("style", "top: 145px; left: 50px; width: 70px; position: absolute; text-overflow: ellipsis"));
    
        $export("0002-lbl", (new DOMLabel("Password:", { "for": loginPass })).setAttr("style", "top: 190px; left: 50px; width: 65px; position: absolute; text-overflow: ellipsis"));
    
        $export("0003-lbl", (new DOMLabel("Login At:", { "for": authSources })).setAttr("style", "top: 237px; left: 50px; width: 50px; position: absolute; text-overflow: ellipsis"));
    
        var btnLogin = $export("0001-btn", (new Button("Login", (function() { dlg.doLogin(); }))).setAttr("style", "bottom: 34px; right: 55px; position: absolute; height: 30px; width: 75px; font-weight: bold"));
    
        $import("0001-dlg").insert($import("0001-img"));
        $import("0001-dlg").insert($import("0001-lbl"));
        $import("0001-dlg").insert($import("0002-lbl"));
        $import("0001-dlg").insert($import("0003-lbl"));
        $import("0001-dlg").insert($import("0001-text"));
        $import("0001-dlg").insert($import("0002-text"));
        $import("0001-dlg").insert($import("0001-drop"));
        $import("0001-dlg").insert($import("0001-btn"));
    
        
        
        Keyboard.bindKeyboardHandler(dlg, 'alt u', function() {
            loginUser.focus();
        });
        
        Keyboard.bindKeyboardHandler(dlg, 'alt p', function() {
            loginPass.focus();
        });
        
        Keyboard.bindKeyboardHandler(dlg, 'alt t', function() {
            authSources.focus();
        });

        Keyboard.bindKeyboardHandler( loginUser, 'enter', function() {
            dlg.doLogin();
        });
        
        Keyboard.bindKeyboardHandler( loginPass, 'enter', function() {
            dlg.doLogin();
        });
    
        dlg.doLogin = function() {
        
            if ( loginUser.disabled )
                return;
        
            if ( loginUser.value.toString().trim() == '' ) {
                HighlightElement( loginUser );
                return;
            }
            
            if ( loginPass.value.toString().trim() == '' ) {
                HighlightElement( loginPass );
                return;
            }
            
            var req = [];
            req.addPOST('uname', loginUser.value.toString().trim() );
            req.addPOST('pass',  loginPass.value );
            
            if ( authSources.options.length ) {
                req.addPOST('auth-source', authSources.value);
            }
            
            req.addPOST('to_json', true);
            
            loginUser.disabled = true;
            loginPass.disabled = true;
            btnLogin.disabled = true;
            
            var rsp = $_POST('login.php', req);
            
            loginUser.disabled = false;
            loginPass.disabled = false;
            btnLogin.disabled = false;
            
            if (rsp === null) {
                DialogBox("Server could not log you in temporarily\n\nPlease try again later", {
                    "type": "error",
                    "modal": true
                });
            } else {
                try {
                    var ok = json_parse(rsp);
                    
                    if (ok == 'ok')
                        window.location.reload();
                } catch(ex) {

                    DialogBox( rsp, {
                        "type": "error",
                        "modal": true
                    } );
                    
                    this.attempts++;
                    return;
                }
            }
        };

        setTimeout(function() {
            dlg.paint();
            dlg.ready();
            loginUser.focus();
        }, 1);
    
        return dlg;

    }
    
    
    this.logOff = function() {
        $_POST('logout.php');
        window.location.reload();
    };
    
    this.showSessions = function( autoLogin ) {

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
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADSwAAA0sBr9neAQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJ6SURBVDiNhZNNSJRRFIaf833fmGPO4KRO/iQaaYWUVGBjINiixayiFgYF0cIgiNq0kdaRYG1cZIsighZF0g+lhBG1qKQfKyREa5SmHytUGGlER+ebuaeF4zCJ0Nnee5577vueV1SV5RIRAQoAYfVSIAUkNdPo5J7u2UCgO8RTVSxZupzbKQI6Mc/A/n7OAItZgIhYgLW3DP/OYnb0fqPPwEx2MlCjWJv8NJV5aQQ8WYCI2PX19Q3GmMqElQxSbLj6Kjkwmij4AhgAy7JSkUjkZV+Yy0EvNbmTOUB+aWnpdZ/P11BU6FU6eqj4evC8zqZytbEikUilJUvAlQBRVZmcnLwfeT7YyQl5E39HuG+MKCDBYHB7KBS6CwRcgyet2EBARBSYX9ZALcty/Xn8yaJ7hscA8gs89ITr8N4bGX6xpYTNhXlw5Nd3oqNDtLc2OytHAnBNxp3bl04n4tN22+PqLobGD2+s/X1y3RpTSdHxCQIlRYCsCqhZy7bqAg9b44N26XSUipowRycfUuvDLfQQx3csBhRlbVwuI6QBLjZx4Vy4jvjAfFfQ9UDHNTh18xbA6yneI7IspuMAqKqoqv1hmrhcoQoIsG/kI0/KDqz/EdPdnw896O2llqXdsDjrdIMokOeQ2Ti/39/S3Nz8SESMqtptjZXcqA52prypdOa1mKrOiIg30wyw4ADu3NzcHdd1d2W/Yozn0+wiC0k3ZpLJ2NTU1HjGrXwgHzVW5qotLAXHA9g5cgToGf7J4LN+THoGEcW2U4go6bRNsCqESSdob21xMqlK5oopIhbR0SFKyitAyv/1SAWTTjAz/RZYkNw45wD+F2sAF0j+BfZN96LjG/zsAAAAAElFTkSuQmCC",
            "caption": "Select your session",
            "closeable": !!window._enableSwitchSessionCancel || false,
            "height": 363,
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
            "width": 547
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        $export("0001-img", (new DOMImage({
            "src": "img/vector/jsplatform.svg",
            "displayMode": "best"
        })).setAttr("style", "top: 0px; left: 0px; right: 0px; bottom: 0px; position: absolute; border: none"));
    
        var sessionsList = $export("0001-holder", (new DOMPlaceable({
            "caption": "Select session",
            "appearence": "inset"
        })).setAttr("style", "top: 105px; left: 40px; right: 40px; position: absolute; bottom: 50px").chain( function() {
            
            disableSelection( this );
            
            var sessions = $_JSON_POST( 'load_sessions.php', []) || [];
            
            if (!sessions.length ) {
                this.insert( $('p').setHTML(
                    "Your user does not have any session access yet on this server. Please contact your administrator."
                ) );
            }
            
            for ( var i=0,len=sessions.length; i<len; i++ ) {
                this.insert( ( function ( cfg ) {
                    
                    var d = $('div', 'session');

                    var logo = d.appendChild( $('img') );

                    logo.onerror = function() {
                        logo.src = 'img/server.gif';
                    };
                    
                    logo.src = 'sessions/' + cfg.id + '/logo.png';
                    
                    d.appendChild( $('span') ).appendChild( $text( cfg.session_name || 'Unknown session name' ) );
                    
                    d.onclick = function() {
                        for ( var i=0, items = sessionsList.querySelectorAll( 'div.session' ), len = items.length; i<len; i++ ) {
                            items[i].removeClass('selected');
                        }
                        
                        d.addClass('selected');
                    }
                    
                    d.ondblclick = function() {
                        d.onclick();
                        dlg.startSelectedSession();
                    }
                    
                    d.sessionID = cfg.id;
                    
                    if ( ( typeof $_SESSION != 'undefined' && $_SESSION.UID && $_SESSION.UID == cfg.id) || sessions.length == 1 )
                        d.addClass('selected');
                    
                    return d;
                    
                } )( sessions[i] ) );
            }
            
        }) );
    
        $export("0001-btn", (new Button("Start selected session", dlg.startSelectedSession = (function() {
            var selected = null;
            if ( selected = dlg.querySelector('.session.selected') ) {
                if (self.loadSession( selected.sessionID ) ) {
                    dlg.closeable = true;
                    dlg.close();
                    dlg.purge();
                    dlg = null;
                }
            }
        }))).setAttr("style", "bottom: 10px; left: 40px; position: absolute; height: 30px; font-weight: bold"));
    
        $export("0001-css", (new JSIde_ApplicationCSS( [ 
            ".DOMPlaceable > div { overflow-x: hidden; overflow-y: auto; }",
            ".session { display: block; margin: 5px 7px 5px 5px; position: relative; background-color: white; }",
            ".session, .session * { cursor: default; }",
            ".session.selected { background-color: #D66235 !important; }",
            ".session > img { height: 48px; width: auto; max-width: 48px; border: none; }",
            ".session > span { position: absolute; left: 58px; font-size: 1.3em; top: 14px; }",
            ".session.selected > span { color: white; }"
        ].join("\n"))).toString("PID-" + $pid).chain(function() {
            dlg.addCss(this);
        }));
    
        if ( !!!window._enableSwitchSessionCancel )
            $export("0002-btn", (new Button("Logout", this.logOff )).setAttr("style", "right: 40px; bottom: 10px; position: absolute; height: 30px"));
        else
            $export("0002-btn", (new Button("Cancel", function() { dlg.close(); dlg.purge(); dlg = null; } )).setAttr("style", "right: 40px; bottom: 10px; position: absolute; height: 30px"));
    
        $import("0001-dlg").insert($import("0001-img"));
        $import("0001-dlg").insert($import("0001-holder"));
        $import("0001-dlg").insert($import("0001-btn"));
        $import("0001-dlg").insert($import("0002-btn"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);
    
        dlg.addContextMenu([
            {
                "caption": "LogOut",
                "handler": function() {
                    self.logOff();
                }
            }
        ]);
    
        return dlg;
        
    };
    
    this.loadSession = function(sessIndex) {
        var req = [];
        req.addPOST('sid', sessIndex);
        var rsp = $_JSON_POST('vfs/bin/jlogon.app/bin/start_session.php', req);
        
        if (rsp === null) { KernelLog('Could not preload session!'); return false; } else {

            if (document.body.taskbar || window.desktop) {
                window.location.reload();
            }
            
            window.$_SESSION = rsp.env;
            window.SID = sessIndex;
            
            var startup = rsp.startup.split('\n');
            
            for (var i=0; i<startup.length; i++) {
                if ((startup[i] != '') && (startup[i].toString().charAt(0) != '#')) AppExec(startup[i].toString());
            }
            
            return true;
        }
        
        return false;
    };
    
    this.startSession = function(forceMenu) {
    
        if ((this.uid > 0) && (typeof(forceMenu) == 'undefined')) { 
            if (!this.loadSession(this.uid)) this.showSessions();
        } else this.showSessions();

    };
    
    if (!this.sessionStarted()) this.doLogin(); else 
        this.startSession(showMenu);

}
