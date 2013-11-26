function DialogBox( message, config ) {

    var currentFocusedElement = document.activeElement;

    config = config || {};
    
    config.details = (config.details || '').toString().trim();
    
    var detailsHeight = config.details ? Math.min( 150, config.details.visualHeight() ) + 20 : 0;
    var messageHeight = Math.min( (message || '').visualHeight(), 300 );
    var appHeight = messageHeight + ( detailsHeight ? 20 : 0 ) + 100;
    
    var dlg = new Dialog({
        "width"        : config.width ||
                         Math.min(
                            getMaxX() - 100,
                            Math.max(
                                ( config.labelDetails || 'More Details...' ).visualWidth(),
                                message.visualWidth(),
                                200
                            ) + 100
                         ),
        "height"       : Math.min( getMaxY() - 50, appHeight ),
        "caption"      : config.caption || "Dialog",
        "closeable"    : false,
        "minimizeable" : false,
        "maximizeable" : true,
        "modal"        : typeof config.modal != 'undefined' ? !!config.modal : true,
        "childOf"      : typeof config.childOf != 'undefined' ? config.childOf : null,
        "minHeight"    : 135,
        "minWidth"     : 300
    });
    
    dlg.closeCallback = function() {
        try {
            currentFocusedElement.focus();
        } catch( e ) {}
        return true;
    }
    
    config.icon = "img/dialog/" + ( (function() { 
        var stdIcon = config.icon || config.type;
        if (['info', 'error', 'warning'].indexOf( stdIcon ) == -1 )
            return null;
        return stdIcon;
    })() || "info") + ".png";
    
    
    config.buttons = config.buttons || {
        "Ok": function() {
        }
    };
    
    config.keyboard = config.keyboard || {
        "enter": [
            "yes", "ok", "retry"
        ],
        "esc": [
            "no", "cancel", "abort", "ignore"
        ]
    };
    
    var icon = dlg.insert(
        $('img', "Dialog_Icon").
            setAttr("src", config.icon )
    );
    
    if (config.details) {
        
        var imgExpand   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdtJREFUeNqkUzsvBFEUPjNzZhY7az3CFh4RkfWqNKJFolDoyIaCTlR0SqGhEp0oNKqlEgkRCX6ARIdEZLWWwdrZsY95ufeuO3Zssgon+XLP6ztz7jl3BNd14T+Cc2tPIIpiGBFXiR0jiPzBSRLELctacRznAx3HBoLVgai8GBurhaY6qSL7JWVH4mfpxatbk5pLomEYQBCbGg1CveoCqVwRNGdypIZxKBd1XaeVIo1hkSWUysTSDTuPtvp9/sawBITHroqZTJo5yX3KCvDYbz8dPI+hYXwyxbZtBi6maQKPJRKPJFYsIkkIqqp6Mczlcl4HFEPTF2WDm1y+9/SDjSjk83ngPLQs12srm81De/uIl5xInLOzs3P0Z+/4TNYuAeehICBTstkCaasA++s1XvJgrBjbX/9ZraZVkQICcB55P9VMKRQckGUF0unPkq8VY6U+RQn4Yqgooe/hKNT03b2tbZCdsiyUzYXzMBBgSlJLiZGmesWXdLgpf6/T9L/lVxMIL8k+bGjX0NIz0/quw1B3RzWEgsiGVBwUMHCbQksB7B1n4OlV3L07nz2lvTUE66JdfcM7C2pD7ziA0Fz5X3KfM293J7eX89tG6v6BFqDTCJUN4G+hL0v/EmAAoNXlG97vnHoAAAAASUVORK5CYII=";
        var imgCollapse = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZ1JREFUeNqkkr1OAkEQx+fuhkPgkK8ghYZYGPzo7GjFxMJeQ7TQzljhGxhs9A2MhY0V2muMifoAJpaQGB+Aw0NPjuOA+3J34eg8ME7yT2Y3+/vv7OxwruvCfwL3T+rA83wMEctkXSTKjGFkooplWceO43yj49hAVF7NBUrFjWlIxwVf+kO1M5WHVumlatLlEa/rOhAVt9cjkJBcIM6+ome2CmHGUBY1TaNOmVSMZwcmiVRMAMKxp2K73WKb5D0TG9DGexzqeocltm0zeWGaJi0TOh2D5bY9MBcEBEmSwOOw2+2OKqDK7zz53n5zloNerwceh5bljsoyjB5kswX/f8cG+XYBPA45DlliGH1SVh+uT8O+BooyRQw48DgyPyGW9PsOBAIitFodXwNRDA7BAYeiGB02R6TLiUfY4zAYZImsqHwmnRAnguWmCYST2cW68gqzS7tzXxrkF+dDEI0ga9JvUlSAq9s21Jv8Ze1x754jJslIPLewsnZxKCWXNwG4mTFj1Gh/1u6qzwfnuvr2Tg1oN6J/asAg6GRpPwIMAFcAzawVzQR4AAAAAElFTkSuQmCC";
        
        dlg.details = dlg.insert(
            $('div', "Dialog_MoreDetails")
        );
        
        dlg.details.appendChild(
            dlg.details.expand = $('img').setAttr('src', imgExpand).setAttr(
                "style", "vertical-align: middle; margin-right: 5px"
            )
        );
        
        dlg.details.appendChild(
            $text( config.labelDetails || "More Details..." )
        );
        
        dlg.detailsBody = dlg.details.appendChild(
            $('div', "Dialog_MoreDetailsBody").setAttr("style", "height: " + detailsHeight + 'px;')
        );
        
        dlg.detailsBody.appendChild( $text( config.details ) );
        
        (function() {
            var expanded = false;
            
            function setExpanded( boolVal ) {
                boolVal = !!boolVal;
                if (boolVal == expanded) return;
                
                expanded = boolVal;
                
                var prDetailsHeight = -dlg.detailsBody.offsetHeight;
                
                dlg.detailsBody.style.display = boolVal ? 'block' : 'none';
                dlg.details.expand.src = boolVal ? imgCollapse : imgExpand;
                
                dlg.height += boolVal ? dlg.detailsBody.offsetHeight : prDetailsHeight;
                
                dlg.height = Math.min( dlg.height, getMaxY() - 50 ) + "px";
                
                dlg.details.style.height = 16 + (dlg.detailsBody.offsetHeight ? dlg.detailsBody.offsetHeight + 4 : 0 ) + 'px';
            };
            
            dlg.details.onclick = function() {
                setExpanded( !expanded );
                dlg.paint();
            }
            
        })();
        
    }
    
    var msg = dlg.insert(
        $('div', "Dialog_Message").
            setAnchors({
                "height": function( w,h ) {
                    return dlg.height - 90 - ( dlg.details ? dlg.details.offsetHeight: 0 ) + 'px';
                }
            })
    );

    msg.appendChild($text( message ));
    
    var buttonsHolder = dlg.insert(
        $('div', "Dialog_ButtonsHolder")
    );
    
    for (var i in config.buttons) {
        if (config.buttons.propertyIsEnumerable( i )) {
            (function( btnName ) {
                buttonsHolder.appendChild(
                    (new Button( btnName, function() {
                        config.buttons[btnName]();
                        dlg.closeable = true;
                        dlg.close();
                    } )).setAttr(
                        "style", "margin: 0px 5px 0px 5px; min-width: 50px;"
                    )
                )
            })( i );
        }
    }
    
    for (var key in config.keyboard) {
        if (config.keyboard.propertyIsEnumerable( key )) {
            (function(sct) {
                Keyboard.bindKeyboardHandler( dlg, sct, function() {
                    for (var btn in config.buttons) {
                        if (config.buttons.propertyIsEnumerable( btn ) && 
                            (config.keyboard[ sct ].indexOf( btn.toLowerCase() ) >= 0 ||
                             config.keyboard[ sct ].indexOf( btn )
                            )
                        ) {
                            //config.buttons[ btn ];
                            dlg.closeable = true;
                            dlg.close();
                        }
                    }
                });
            })( key );
        }
    }
    
    addStyle( dlg, 'DOMModalDialog' );
    
    dlg.paint();
    dlg.focus();
    
    return dlg;
}