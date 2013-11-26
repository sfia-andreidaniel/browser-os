// The KeyRing is a system utility that is used to store
// user credentials until he logout

function JKeyring() {
    
    if ( typeof window.keyRing != 'undefined' )
        return;
    
    var KeyRing = function() {
        
        var cache = {
        };
        
        this.requestAuth = function( sourceName, forApplicationName, onSuccess, onError, notFromCache, forceUserName, forcePassword ) {
            
            forceUserName = forceUserName || '';
            forcePassword = forcePassword || '';
            
            if ( forceUserName && forcePassword ) {
                return onSuccess({
                    "user": forceUserName,
                    "password": forcePassword
                });
            }
            
            return ( function( keyring ) {
            
                notFromCache = !!notFromCache;
                
                sourceName = ( sourceName || '' ).toString().trim();
                forApplicationName = ( forApplicationName || '' ).toString().trim();
                
                if (!sourceName)
                    throw "Keyring.requestAuth: `sourceName` not specified!";
                
                if (!forApplicationName)
                    throw "Keyring.requestAuth: `forApplicationName` not specified!";
                
                if (!onSuccess || !( onSuccess instanceof Function ) )
                    throw "Keyring.requestAuth: `onSuccess` should be a function!";
                
                onError = ( onError && ( onError instanceof Function ) ) 
                    ? onError 
                    : function( reason ){ console.log("KeyRing.requestAuth: Error: " + reason); };
                
                if ( typeof cache[ sourceName ] != 'undefined' && !notFromCache ) {
                    // if allready cached the auth, we call directly the onSuccess callback
                    onSuccess( cache[ sourceName ] );
                    return {};
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
                    "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EBwYkF3yVI/sAAAKFSURBVDjLndJBSJNxGMfx37u3d2vLpqXByjmLHNa23ExtGa0RgrqCrFNUlA55hcDYKIIQLOggREUdgg6dGiyI6FAmq2Y4Z6RJpnOhZum2Gu+rNpm2Nd3c9u/SwdJS+h6fw4eH5/+n8SuKouRms1mlVqtlXq93AUAMq4gCAIVCcdVut1s4jpNSFIXZ2dlplmWbAAwD8AKY+augUqnUTqczybLsF6VS2aLTFT+83Hwpcef2FbIQbCKOBydI9YG8UwAg30QvBWpqai5aLBYCIAMA8mUwfHhSHr/e0kz49gpCBgxktOsMAVC63AKCRCIhjsViADAPIPdso8WtLsoRqpXr0PW1ABBnQrk9hZMGQf1ywJpQKPRaq9XCZDL1+Hw+f11dLeK0nVTsm6QEwhyQiVFQiTQ+fkprANAAUosBmuO4IMMwJXq93mg0GlV7SsvwnXMiM1tIIRkGEVCI8HJy7LAkf5rjn3p8Kf43AEDa7/c/CgaDvZ2dndEMac5umfwgNdR2F+LwCD4Ph7GtKEXN8UIMTjDFb/qn7v0JAEA6HA6PRiKRZx6PZ7Bgh64yLTsqDmedRt9wFFMD3WRnSZoyle/P/ZFMHOp+P2kHkFxyEJFIBABgGGZzVVVVrc1mI263O33j5i1SuQtDoRcKEnIeIedZ3dvVfLK1AOptNhtxOBykzsy+0ubB5rq2fibpaSQXGkp6AIjofwBJAP2BQGCDwWDYm70xK69v5FvD/dbxDqN6/HjZlkx5bB6P6ZXW4Hm+XSqVVmg0mq2J+Jy+o+ud9aUrNj82xg+09kbbsMpkVquVuFwuUlhYeG65V1ipaDweF0gkklK/3x/gOO45/iNaLBYrAIgWD38CY2IKt/VQuagAAAAASUVORK5CYII=",
                    "caption": "Authentication Required",
                    "closeable": true,
                    "height": 266,
                    "maximizeable": true,
                    "maximized": false,
                    "minHeight": 266,
                    "minWidth": 412,
                    "minimizeable": false,
                    "modal": false,
                    "moveable": true,
                    "resizeable": true,
                    "scrollable": false,
                    "visible": true,
                    "width": 412
                })).chain(function() {
                    Object.defineProperty(this, "pid", {
                        "get": function() {
                            return $pid;
                        }
                    });
                    this.addClass("PID-" + $pid);
                }));
            
                $export("0001-img", (new DOMImage({
                    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH0ggNFSEPV/XtcQAAC8dJREFUeNrtmXtw01d2xz962ZIf8s8vZGOwlHX8AmKEeTkBr+UMMdkGxk7DNFmSLm7/WWbbCU6mM93utGW7TWa2syGh07QTkt0JTZoG2sIIZ5kxNbORbWq8AYxs/JBtYiywbCu2kOSXZD1+t39I5pGyCWRNSGZ6Zs7cGekn/X6f+z33nHPvD77lprrH643xceGbAqD4ku+rgHrAUlRUZFr80OPx4PF47MDhuPu/aQBrgYNFRUWW2tpa6urqUKvVyLJMNBpFlmUuXrxIS0sLLS0tPo/HcxD4u2+KKnuSkpK8r776qnC5XCISiYixsTHR19cnWlpahN1uF/39/WJ0dFT09fWJ9957T1RWVgrgYyDtQStQu2LFCuuhQ4fYvn07DoeD8+fP4/f7kWX5hgsh0Ol05OfnYzQamZmZ4e233+b9999fDCsLIMX/0w5YgZb7DWBMSkqyHz16VKqqqqK5uRmXy0U0GqW7u5vR0VGEEAghKC0txWAw3ABZt24dGo2Gg6/9jO8WX8W8fhWWzTmMTESwn+vh4K86aekO24AGoOt+Abzb0NBQ/8orr3DixAkmJyfp6uriyJEjvkAgYAVswAhgBiySJNXV1NRQXFzMwsICmZmZzM3N0dBQRnp64u13CUxh+8/3+cM/+9jnnRX1wImlBjBmZmaOtLe3Mz4+jt1u59ixY7S1tVnjWcj/O1KqdVt1hXlt+RYUCgUajYbyh2fZVdIMchRUCZCxBozfg8R0fAMfY9nxJl2fRixLFVLK+Fi3Y8cOkpKS6O3tZWBggLa2Nhvw9BekSF9Gmlr6xQ/n2bBOQghBNBrlE4eWQFQLKjXIEZi8AJ2/AJ8DqWAdx959lvQUhXWpFvwigKWsrAyXy0UgEODUqVPEZ/6L7PDf/Ohh09qyXGqLmknXazAYDIRCIRyDgFINmaWxUYTA8R7MXqNg/UZe/8vVEnBwKQGkVatWMTk5STQaZXh4eARw/o7fpAEfP1W9sm7fj7YCAp0OSvOmWL16NeFwmP9oTWCoawJMtWDYBEoNiAgMHQc5TP0PNmHMUdUvhQqLAITDYUKhEJFI5Mt+Y923b59l1/Z0SH0IhUKAUk3E5yQ/P59wOEw4u5KfWTPgek9sDajUMSUiAbjeB/oc6ramEE+3SwewGMcGg8F0S99zq+1//vnnLcXFxdQ9aQRVIkKtBZUGjT4FlUpFOBxGp9PxUFEuaNNBXog9vCru09dADlNRpF5SAF9HRwc6nQ5Zltm0aRPxnH2b6fX6hpdeegm3201aVhYIGZJyQaliR5UO78T5mAK+c7z8wyLIWAvenpsKKNWxUBIhSnKVxFPykgDYurq6bvQ7ZWVlZGdnNwB7bm3sampqJJMp3tMpBCBDUh4iQY8mcZ7NhTb+7edJ/PzvH0cq3Rl7+MDY7Qpo9RAJkJMqWMpFbP3kk0/o7OxElmV0Oh0vvPACWVlZh4H9i5nKZDKRlJSExWLBedULchgUCkgrQiQsQ6hTIMOMSMxA+DqR5/oRqoS4AprYqNGCf5Tz3dNLCuD0+XyHbTYbsiwDUFBQwN69eykvL/9pQkKCF6gzmUyo1WosFgvHfj0CkelYGAkZEjNBqUaev4yY6UYsTIA6EaHPjUEo1czJlTDrJzQ1TlNnaHENXIx3v7/3hsbmcrn2mkwmrUIRK9AlJSVUVVWxZs0abXp6ek5iYiIWiwWVSoW95TesXxNAkaC/ASFEFEQUWHQZEKBJgGiI0fZu9I++gSZ8juXGZN76iYmnNuly3mm8ngMcXYpudK3BYLDt3LlT0ul0CCEoKCigsLAQo9FIcnIyOTk56HQ6bDYbk83fZ1dDLaikOEAkVn3F5z0KkQU+O3ueeb+E8Y9+iWp8P0T8XL/sIvOZkbvZXN3VltI9NzfX1Nvb+5wkSdqUlBTGxsbo7u6mo6OD/v5+MjMzycvLw2QyYfutkzT3aTIfzo1FoxA3Z1/c4nIUFILkvGyC45/isZ9G/+gbKOc7GDzbx1unwz7gH5ZqT+yORqNHhoaGzGNjY6aEhAQSExOJRCJMTU0hyzIbNmxAoVCwen0V73x4nvQrv0bKk1DrEuPhdBNCIUdQRiMIBChkUlYuIzh+JQZR8To6/TBNbRNatyc08lVa7S+TbW28Hlg0Go0pLS2NtLQ0GhsbMZlMhMNhgsEgb77y56yL/BcbHzWSvDyXxMxYSC1MefANfkp4do6Hn/kDFBpALICQmfifXoLzWRif/SUzQ/ux/KCVLsdsPfCvSwlwJ3u3tra2/sCBA2RkZBAIBAgEArS1tTF65k2kuQtsNIFeBy4vXJhIY0Eq4W9/8h0QUWR5DiEHQZZxdwwSnMvC+OyvmLm8H8sft9wzhOorANiuXr36XDQalXJzc8nNzUUIQU5ODoUbd6IrfoYhVRUjSU/hTtvOlUAeZSUPsbpwmunhq3j7r5C60gAiSEpeBgufjeG52Myy777B7monTa3jde6puw+nrwKwEIlEbF1dXc+53W6t1+slGAwyMzODz+cjFAphNpvJzs5mxYoVyLLM8ROnMHx6EsVno7xz0sfqjGgMQp4nJS+NhUl3HOJ1dldfpal17K4hVF+xfrgjkchbDoejZGBgoGRiYoLLly/T19dHf38/q1atIjU1lXA4TFZWFu4pHxd9JvpmTLQ402lt7WFrbgg5EkKbpo5DfHZTicev0tRydxCq36OKLwBHfT6f1eFwTNjtdux2uy8ajea8/PLLaDQa5ufnUSqVSJJEMCRTv/cviEQi/Mu//4YrzmkMiVC43gjR2TjEZAyi8nV2Pz5KU4vrSyGUS9COdMUPtaqBOoVCgSzL2O12VKrY/BiNsc7c6XRSXV2N2WzGasf6/QNen+vMZQKeCOGZaQwbDGhTruM88qekfuevsX34BGtL9Yc/11QumQJ3Mr/b7a5Xq9XS4OAgXq+XwsJCIpEIBoOBxsZGtm3bxvLly7FardqFCEeujExXiLFJpp1eTGaJlDw9C1MePJ3/HVNimyuuxMIdlVhqAICRM2fOPNnR0THR1dUl7dq1C6VSiVarZXp6Gr/fzyOPPILX65V6e3uPOCZwWO0ErReE9L1HVFq134dUlEl42o+n8xTLth5g9xPjNLWM3hHifgAMxNuCf5ydnTX5/X5zQUEBKSkp5Ofn89FHH1FZWUlRURHHjx+vCIVCdcChhQgl6ulZ8/zkPC6Hh7JteTchKl9j9xMTNNn+L8T9ALitZgwPD++1WCza5cuXx26oUtHZ2UlFRQWyLGvPnj2rBU4BvnMjmKx2Ro78VlBbnSgVlqcTvO7Dc+EUy7a+xu4a9yKEPT5RS7KIv3BNBIPB+kOHDpGcnIwQgvLyctxuN16vl/r6enJzcxvi+++WeCKoBg63nprEPzxBTnka2lQfzg//hNT8H3Pwp4/dduRzvxUAGHC5XPVqtVqSZZns7GxWrlzJyZMnqaqqIj8/n8bGRvPn2gfJ64s+Nz48x5aNGqSCNILXp/FcaCJFX8o/He2cWLz+6wAAsDscjvrBwUG2bdtGeno6TqeTaDRKYWEhnZ2dprGxsRthAQyM+eDMZVieKkwPJc6iTFQzNzpCdPwc/2zD9KDeR1z84IMPRGtrq7hw4YLYt2+fmJycFM3NzQK4cofrazeaED9+EnG4PuZ1ZgTw7tcZQrdaxfz8vHlmZoakpCQkSWJoaIji4mIUCoV07tw5PnfoGxzz4TtzGZvVHnPHBFbgrx7U25+1wBvAlT179ohLly6JF198UQwPD4v29nah1+u993rc+HUr4I6nTGnz5s0Ws9lMeno67e3t1NTUkJycrD19+nTOvbw/UD4gJUa6u7sZHBykqKiImZkZenp6ePrppyktLa2/l2MW1QMC8E1NTdUHAgHtli1bMJlMnDx5ksceewyVSsXp06eDcaW+sQo4g8Gg+dKlS1y7dg2lUklOTg5nz54lFArd05npg1IAwO/z+eoVCoXk9/tRq9U4nU4GBgbo6emx3q0CD9qq4jndW1JSIioqKhbrQRXfQlsL7OP/7Vtm/wuLBYnUar15uwAAAABJRU5ErkJggg==",
                    "displayMode": "best"
                })).setAttr("style", "top: 10px; left: 10px; width: 48px; height: 48px; position: absolute; border-color: transparent"));
            
                var lbl1 = $export("0001-lbl", (new DOMLabel(
                    "Application %appName% is requesting you the right to access the %sourceName%. Please provide required credentials:"
                        .replace( "%appName%", "<b>" + ( forApplicationName || 'Unknown Application' ) + "</b>" )
                        .replace( "%sourceName%", "<b>" + ( sourceName || 'Unknown Source' ) + "</b>" )
                )).setAttr("style", "top: 10px; left: 70px; height: 48px; position: absolute; overflow: hidden; white-space: normal").setAnchors({
                    "width": function(w, h) {
                        return w - 80 + "px";
                    }
                }));
                
                lbl1.innerHTML = lbl1.innerHTML.replace(/\&lt;/g, '<').replace(/\&gt;/g, '>');
            
                $export("0002-lbl", (new DOMLabel("Username:")).setAttr("style", "top: 80px; left: 10px; width: 70px; position: absolute; text-overflow: ellipsis"));
            
                $export("0003-lbl", (new DOMLabel("Password:")).setAttr("style", "top: 120px; left: 10px; width: 70px; position: absolute; text-overflow: ellipsis"));
            
                var remember = $export("0001-check", (new DOMCheckBox({
                    "valuesSet": "two-states",
                    "checked": "true"
                })).setAttr("style", "top: 160px; left: 10px; position: absolute"));
            
                $export("0004-lbl", (new DOMLabel("Remember this permission untill I log out")).setAttr("style", "top: 162px; left: 40px; position: absolute; text-overflow: ellipsis").setAnchors({
                    "width": function(w, h) {
                        return w - 60 + "px";
                    }
                }));
            
                $export("0001-btn", (new Button("Ok", (function() {
                    dlg.auth();
                }))).setAttr("style", "bottom: 10px; left: 10px; position: absolute"));
            
                $export("0002-btn", (new Button("Cancel", (function() {
                    dlg.err("User aborted");
                }))).setAttr("style", "bottom: 10px; left: 50px; position: absolute"));
            
                var userName = $export("0001-text", (new TextBox(forceUserName || "")).setAttr("style", "top: 75px; left: 80px; position: absolute; margin: 0").setAnchors({
                    "width": function(w, h) {
                        return w - 100 + "px";
                    }
                })).setProperty('placeholder', "JohnDoe");
            
                var password = $export("0002-text", (new PasswordBox(forcePassword || "")).setAttr("style", "top: 115px; left: 80px; position: absolute; margin: 0").setAnchors({
                    "width": function(w, h) {
                        return w - 100 + "px";
                    }
                })).setProperty('placeholder', "my secret password");
            
                Keyboard.bindKeyboardHandler( dlg, 'alt u', function() {
                    userName.focus();
                } );
                
                Keyboard.bindKeyboardHandler( dlg, 'alt p', function() {
                    password.focus();
                });
            
                $import("0001-dlg").insert($import("0001-img"));
                $import("0001-dlg").insert($import("0001-lbl"));
                $import("0001-dlg").insert($import("0002-lbl"));
                $import("0001-dlg").insert($import("0003-lbl"));
                $import("0001-dlg").insert($import("0001-check"));
                $import("0001-dlg").insert($import("0004-lbl"));
                $import("0001-dlg").insert($import("0001-btn"));
                $import("0001-dlg").insert($import("0002-btn"));
                $import("0001-dlg").insert($import("0001-text"));
                $import("0001-dlg").insert($import("0002-text"));
            
                setTimeout(function() {
                    dlg.paint();
                    dlg.ready();
                    userName.focus();
                }, 1);
                
                dlg.auth = function() {
                    var userStr = userName.value.toString().trim();
                    if ( !userStr ) {
                        DialogBox("Please provide a valid userName!", {
                            "type": "error",
                            "childOf": dlg
                        });
                        return;
                    }
                    var pwd = password.value.toString();
                    if ( !pwd ) {
                        DialogBox("Please provide a non-empty password!", {
                            "type": "error",
                            "childOf": dlg
                        });
                        return;
                    }
                    var remval = remember.value;

                    dlg.close();
                    dlg.purge();

                    if ( remval )
                            onSuccess( keyring.addAuth( sourceName, { "user": userStr, "password": pwd } ) );
                    else
                        onSuccess( { "user": userStr, "password": pwd } );
                    
                };
                
                dlg.err = function( reason ) {
                    dlg.close();
                    dlg.purge();
                    onError( reason || "Authentication was canceled by the user" );
                }
                
                Keyboard.bindKeyboardHandler( dlg, "enter", dlg.auth );
                Keyboard.bindKeyboardHandler( dlg, "esc", dlg.err );
                
                return dlg;
                
            }) (this);
        };
        
        this.addAuth = function( sourceName, userPassword ) {
            cache[ sourceName ] = userPassword;
            this.updateCacheTray();
            return userPassword;
        }
        
        var trayIcon = false;
        
        this.updateCacheTray = function() {
            var cacheSources = [];
            
            for ( var key in cache ) {
                if ( cache.hasOwnProperty( key ) && cache.propertyIsEnumerable( key ) )
                    cacheSources.push( key );
            }
            
            if ( !trayIcon && cacheSources.length ) {
                trayIcon = Notifier.addNotification({
                    "name": "KeyRing",
                    "views": {
                        "default": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EBwYkF3yVI/sAAAKFSURBVDjLndJBSJNxGMfx37u3d2vLpqXByjmLHNa23ExtGa0RgrqCrFNUlA55hcDYKIIQLOggREUdgg6dGiyI6FAmq2Y4Z6RJpnOhZum2Gu+rNpm2Nd3c9u/SwdJS+h6fw4eH5/+n8SuKouRms1mlVqtlXq93AUAMq4gCAIVCcdVut1s4jpNSFIXZ2dlplmWbAAwD8AKY+augUqnUTqczybLsF6VS2aLTFT+83Hwpcef2FbIQbCKOBydI9YG8UwAg30QvBWpqai5aLBYCIAMA8mUwfHhSHr/e0kz49gpCBgxktOsMAVC63AKCRCIhjsViADAPIPdso8WtLsoRqpXr0PW1ABBnQrk9hZMGQf1ywJpQKPRaq9XCZDL1+Hw+f11dLeK0nVTsm6QEwhyQiVFQiTQ+fkprANAAUosBmuO4IMMwJXq93mg0GlV7SsvwnXMiM1tIIRkGEVCI8HJy7LAkf5rjn3p8Kf43AEDa7/c/CgaDvZ2dndEMac5umfwgNdR2F+LwCD4Ph7GtKEXN8UIMTjDFb/qn7v0JAEA6HA6PRiKRZx6PZ7Bgh64yLTsqDmedRt9wFFMD3WRnSZoyle/P/ZFMHOp+P2kHkFxyEJFIBABgGGZzVVVVrc1mI263O33j5i1SuQtDoRcKEnIeIedZ3dvVfLK1AOptNhtxOBykzsy+0ubB5rq2fibpaSQXGkp6AIjofwBJAP2BQGCDwWDYm70xK69v5FvD/dbxDqN6/HjZlkx5bB6P6ZXW4Hm+XSqVVmg0mq2J+Jy+o+ud9aUrNj82xg+09kbbsMpkVquVuFwuUlhYeG65V1ipaDweF0gkklK/3x/gOO45/iNaLBYrAIgWD38CY2IKt/VQuagAAAAASUVORK5CYII="
                    },
                    "title": "Automatic authentication. Click to cancel"
                });
                trayIcon.viewName = 'default';
                
                ( function( keyring ) {
                    trayIcon.onclick = function() {
                        setTimeout( function() {
                            keyring.forgetEverything();
                        }, 1 );
                    }
                })( this );
            }
            
            if ( !cacheSources.length && trayIcon ) {
                trayIcon.close();
                trayIcon = false;
            }
        };
        
        this.forgetEverything = function() {
            for ( var key in cache )
                if ( cache.propertyIsEnumerable( key ) )
                    delete cache[ key ];
            this.updateCacheTray();
        }
        
        this.unvalidate = function( sourceName ) {
            delete cache[ sourceName ];
            this.updateCacheTray();
        }
    }
    
    var k = new KeyRing();
    
    Object.defineProperty( window, "keyRing", {
        "get": function() {
            return k;
        }
    });
}