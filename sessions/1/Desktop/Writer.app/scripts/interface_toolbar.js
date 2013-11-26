function DocumentEditor_interface_toolbar( app ) {

    var availableColors = [
        "white", "silver", "gray", "black", "red", "maroon",
        "yellow", "olive", "lime", "green", "aqua", "teal",
        "blue", "navy", "fuchsia", "purple"
    ];
    
    app.toolbar = app.insert( $('div', 'DomDialogToolbar clearfix' ) ).setAnchors({
        "width": function(w,h) {
            return w - 4 + "px";
        }
    }).setAttr(
        "style", "position: relative; display: block; padding: 2px; margin-top: -4px; margin-bottom: 4px;"
    );
    
    app.toolbar.groups = {};
    
    MakeSortable( app.toolbar );
    
    app.toolbar.addGroup = function( groupName ) {
        
        var docked = true;
        
        var grp = app.toolbar.appendChild( $('div', 'group visible') );
        
        grp.setAttribute('data-name', groupName );
        
        app.toolbar.appendChild( grp );
        
        app.paint();
        
        Object.defineProperty( app.toolbar.groups, groupName.toLowerCase(), {
            "get": function() {
                return grp;
            }
        } );
        
        Object.defineProperty( grp, 'visible', {
            "get": function() {
                return grp.hasClass( 'visible' );
            },
            
            "set": function( b ) {
                grp[ !!b ? 'addClass' : 'removeClass' ]( 'visible' );
                app.paint();
            }
        } );
        
        grp.addItem = function( itemName ) {
            var btn = grp.appendChild( $('div', 'item' ) );
            
            if ( itemName )
                Object.defineProperty( app.toolbar.groups[ groupName.toLowerCase() ], itemName.toLowerCase(), {
                    "get": function() {
                        return btn;
                    }
                } );
            
            return btn;
        }
        
        Object.defineProperty( grp, "docked", {
            "get": function() {
                return docked;
            },
            "set": function( b ) {
                if ( !!b == docked )
                    return;
                
                docked = !!b;
                
                DialogBox("Not implemented", {
                    "childOf": app,
                    "caption": "Document Editor",
                    "type": "warning",
                    "modal": false
                } );
                
                switch ( docked ) {
                    case true:
                        break;
                    case false:
                        /* If the toolbar is not docked, we take all it's buttons and place them in a sepparate window */
                        break;
                }
            }
        } );
        
        return grp;
    };
    
    var toolbars = [
        'File',
        'Printing',
        'Edit',
        'Formatting',
        'Justify',
        'Font Style',
        'Media'
    ];
    
    for ( var i=0, len=toolbars.length; i<len; i++ )
        app.toolbar.addGroup( toolbars[i] );
    
    app.toolbar.get = function( GroupOrButtonPath ) {
        var g      = GroupOrButtonPath.toLowerCase().split( '/' ),
            cursor = app.toolbar.groups[ g[0] ],
            i      = 1;
        
        if ( !cursor )
            return false;
        
        while ( i < g.length ) {
            if ( !cursor[ g[i] ] )
                return false;
            cursor = cursor[ g[i] ];
            i++;
        }
        
        return cursor;
    }
    
    app.createSimpleButton = function( groupPath, buttonName, appCommandOrFunction, buttonIcon ) {
        return app.toolbar.get( groupPath ).addItem( buttonName ).chain( function() {
            
            this.addClass( 'simple' );

            this.addEventListener( 'click', function() {
                if ( typeof appCommandOrFunction == 'string' )
                    app.appHandler( appCommandOrFunction );
                else
                if ( appCommandOrFunction instanceof Function )
                    appCommandOrFunction();
            } );
            
            if ( buttonIcon )
                this.appendChild( $('img').setAttr('src', buttonIcon ) );
            else
                this.appendChild( $text( buttonName ) );
            
            this.title = buttonName;
            
        } );
    }
    
    app.createSeparator = function( groupPath ) {
        return app.toolbar.get( groupPath ).addItem( null ).chain( function() {
            this.addClass( 'separator' );
        } );
    }
    
    app.createDropdown = function( groupPath, dropdownName, appCommandOrFunction, availableOptions, icon ) {
        return app.toolbar.get( groupPath ).addItem( dropdownName ).chain( function() {
            
            var drop = this;
            
            this.addClass( 'dropdown' );
            
            if ( icon )
                this.appendChild( $('img') ).src = icon;
            else
                this.appendChild( $text( dropdownName ) );
            
            this.appendChild( $('div', 'overlay') ).chain( function() {
                
                for ( var i=0, len=availableOptions.length; i<len; i++ ) {
                    
                    ( function( option, overlay ) {
                        
                        overlay.appendChild( $('div', 'option' ) ).chain( function() {
                            this.appendChild( $text( option.name ) );
                            
                            this.value = option.id;
                            this.text  = option.name;
                            
                            this.addEventListener( 'click', function() {
                                drop.addClass( 'clicked' );
                                setTimeout( function() { drop.removeClass( 'clicked' ); }, 10 );
                                
                                if ( typeof appCommandOrFunction == 'string' ) {
                                    app.appHandler( appCommandOrFunction, option.id );
                                } else
                                if ( appCommandOrFunction instanceof Function ) {
                                    appCommandOrFunction( option.id );
                                }
                                
                            } );
                            
                        } );
                        
                    } )( availableOptions[i], this );
                    
                }
                
            } );
        } );
    }
    
    app.createColorDropdown = function( groupPath, dropdownName, appCommandOrFunction, icon ) {
        return app.createDropdown    ( groupPath, dropdownName,  appCommandOrFunction, ( function() {
            var out = [];
            for ( var i=0, len=availableColors.length; i<len; i++ ) {
                out.push({
                    "id": availableColors[i],
                    "name": availableColors[i]
                });
            }
            return out;
        } )(), icon ).chain(
            function() {
                for ( var i=0,items=this.querySelectorAll('.option'), len=items.length; i<len; i++ ){
                    items[i].style.backgroundColor = items[i].value;
                    items[i].innerHTML = '';
                    items[i].addClass('color');
                    if ( !( ( i + 1 ) % 4 ) )
                        items[i].addAfter($('br'));
                }
            }
        );
    }
    
    app.createSimpleButton( 'file',     'New',           'cmd_new',           'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICA4mIouQKbUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAYElEQVQ4y2N8//YeAyWABcaIS8j/j0/hogUTGfEawMDAwLBp0yasmv38/BjiEvL/YzOEiVinbtq0CasriTbAz88Pq1dZiLUd3SCSXYALjBowGAxgwZZYSAGMlOZGir0AAD5+G93XrjLJAAAAAElFTkSuQmCC' );
    app.createSimpleButton( 'file',     'Open',          'cmd_open',          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICA4oKYLB3bMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAoElEQVQ4y6VTwQ3DIAw8o6xn/vlU3SCzZIMoH/4eKBtEGYE+CFEtGWjBEjosfCefhek6D4zE9EvR673EfN+3ldTjdR7Vw8zRyjNSj4Xc0b6tNDVbrNgBAGLmKAIAAsDD+zLZEr+HmMiAQMSrPKMvKLsENkmjHbcFXVyzUbCgyfPcJoaQZuK+Z/AvWc2gh/wI9JLVLoTQFrD+AY1uo8NgfACuQm8O81xMnQAAAABJRU5ErkJggg==' );
    app.createSimpleButton( 'file',     'Save',          'cmd_save',          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICA4qBhsmgmgAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAfklEQVQ4y8WTwQmFQAxEX2Sb3IvYgfcUMHc7EC92ZQefX4IeZEFUFHcRcwtkJpkkY//fREkEgLpp5xzw0HcWUhIjjCNIugS5O5JwdwCqnM4JnE0QI2UE2/ieIOy1bRd0p/9AcFbwaAJYf+GVK0g6fbLvr2DJjTmGGvrOrNTOC0vmIx4jTocNAAAAAElFTkSuQmCC' );
    
    app.createSimpleButton( 'printing', 'Print',         'cmd_print',         'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICA41IXN2OZ0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAzUlEQVQ4y6VTsQ3EIAw8S1mHUUyfJsoG6RmAPhtEab5nFVKzAWIEvniB4JMn/L8bIwv7zmebgnf4x4ar4DQv8S5x31a6LDDNSzTGNJOllG0G75+SGWMgpczopwIl+h2LJoMWeqnRvq2E4B2Cd2DmeGfMHK21lafgXZfqAKC1hlIqewAgZo5a665+y+TkiZnjt8uTAJVSLxE/MbDW5rcQIiclv28rDS2kcXzk93GIqpVqjGWgocBJTADIU+gRshQvbSOla+wdZXlIVYFf7QmNdZeQUHH5uQAAAABJRU5ErkJggg==' );
    app.createSimpleButton( 'printing', 'Print Preview', 'cmd_print_preview', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICA42A407K7oAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAyUlEQVQ4y6VTsQ3DIBA8rIxj+mwQpYD+G8sbuGcA+mwQpfmeVXCdDaKMQJqAiWJjSF6ieXQHd/cvlFIBO3W7XsTWnVBKBefcJlhrXSTpUFHWWgzjFH4mMMYAwCrJYQ+cy4tymgjWQNUEWmsQEaSUAADvPYZxCrmh3R6YiWD6PvWJ6MOLoonxZTvPX73qFHJwc4ze+yXKt4y8VyRwzoGZEyD+hJlBRO2jnJvIzGm8u5pBigcAzqdjinAYpyBqtnFtM2OU4vm44596AafCWJX0tbCUAAAAAElFTkSuQmCC' );
    
    app.createSimpleButton( 'edit',     'Undo',          'cmd_undo',          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQY1Nd8D2z0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAXUlEQVQ4y2N8//YeAyWAiYFCMPAGsBBSEJdw4j+62KIFFowwNiMsEOMSTvxHloBpRBbDJs6ETRJmGLpmbAYyYXMyNo0kBSI2f5McC7gMQRdnJCUlYgtYxtGkTLkBAGiONBErgyCSAAAAAElFTkSuQmCC' );
    app.createSimpleButton( 'edit',     'Redo',          'cmd_redo',          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQY2Hy+VQSgAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAZUlEQVQ4y2N8//YeAyWAiYFCMPAGsCBz4hJO/EdXsGiBBSNRBsA0o2vAJh6XcOI/jM9EyLZFCywYFy2wYIQZhO5KosMA2RCyDMCmGcMAXIpwiTMwMDAwIqdEXAGJDzCOJmXKDQAArswxWrIawecAAAAASUVORK5CYII=' );
    app.createSeparator   ( 'edit' );
    app.createSimpleButton( 'edit',     'Cut',           'cmd_cut',           'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQYuKvs9HVIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAd0lEQVQ4y2N8//4eAyWACZtgdFzOf3x8ggZQ7AKqGABzNj7n4zRg6aIpjPj4RHuBkO14DYDZis92AmFw/D8yTZYXYLZHxx3/j8sgFlw2oxpkCTcIxsbqApgCdEU0TUgshBQsXWTJCPMWNpcxoudGfIqxAUZKszMAUhQ9VMLIyAwAAAAASUVORK5CYII=' );
    app.createSimpleButton( 'edit',     'Copy',          'cmd_copy',          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQYvDt4lyMIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAtklEQVQ4y6WT4QnDIBCFn8GlsoJiBojgBB2nEwTMAIJZIVtkBUe4/iihWr3Ukgf+uSfn9zwVKR24IwkA1j2oZfrlKboaAEAMsTD0pLsIhiuTI2sS5Ke+aTYAHtbtVMYay1gpHVBG0beU8c2aMp5SOnAuyefeAMwVcgwz9LTSSSJLM2bN1kasT926nfwyip8EedMY5uqAbgJun+TnXhOwY2y9OOtW+ouAUxcBp/MeriTu/sYBN/UCk1t5qVqHtuwAAAAASUVORK5CYII=' );
    app.createSimpleButton( 'edit',     'Paste',         'cmd_paste',         'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQYvKXsvfakAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA3ElEQVQ4y6WTsQ3DIBBFP5GnsxX39kmeICVVBnDlMhNEwu4teQYvECmdV2AEUhCcI0BQ5GsODt3j3xcIrTcciSJWpO5i+F7dbyIFEFpvQQMALLPNVR02caAoz6WhBgAIgIKabLNrdGtq7DlAUJPaIe8RyJInYOgHPB/A0NsTt5ZXySCBB2qHyKvM2OZDCl7kMuMZOQWKeUHg4/k5ocDPwDK3wQBVPTIYcEop+BXL3IK61WQVfG6Ep8jVqFtNkVYQH4Pvq3r8T0EMlHzKAEVN/DZUpH6jMykX4uh3fgF6Imz1g6+FqwAAAABJRU5ErkJggg==' );
    app.createSeparator   ( 'edit' );
    app.createSimpleButton( 'edit',     'Clear Formatting', 'cmd_clear_formatting', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQYwF3cUbpwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABFklEQVQ4y52TvW3DMBBGHw0P4DUMxIXWoKD0soBM4NJVBnClUhMYINUL4BwqbNidMgK1waWQqViO5Mj5Gv6A7zvyeKe8b3hV2cdOAMyxUOpVgw7ObivDck6kEG0Id1o+g/NDPhG5i26OhVpMwa6C+lT3e/khJ0uHMMAgB+HKrgJwQIwtM6JN1J/Zf+57GEDpRPfvdJXjer5Sn2q2qZllsggTVzlsaVm/rYk2EbbMgBhwbFMzeM5A3jd436ATLSIixhoREbmcLrd5ty+ixVgjOtESGO+bH4M5Jo/wL4Mxk2ew9w2jldh9o+tzEL/Hg8zfa7KUH6twquBGDVarnYCjbb/UX72hRLSE/w5j2xZqbnOp/7Tzvb4BomYDmNClGhIAAAAASUVORK5CYII=' );
    
    app.createDropdown    ( 'formatting','Size',    'cmd_font_size', [
        { "id": 1, "name": '1 (XS)' } , 
        { "id": 2, "name": '2 (S)'  } , 
        { "id": 3, "name": '3 (M)'  } , 
        { "id": 4, "name": '4 (L)'  } , 
        { "id": 5, "name": '5 (XL)' } , 
        { "id": 6, "name": '6 (XXL)'} , 
        { "id": 7, "name": '7 (XXXL)' }
    ] );
    
    app.createDropdown    ( 'formatting', 'Style',  'cmd_font_style', [
        {
            "id": "p",
            "name": "Paragraph"
        } , {
            "id": "div",
            "name": "Div"
        } , {
            "id": "blockquote",
            "name": "Quoted Text"
        } , {
            "id": "pre",
            "name": "Preformatted Text"
        } , {
            "id": "h1",
            "name": "Heading 1"
        } , {
            "id": "h2",
            "name": "Heading 2"
        } , {
            "id": "h3",
            "name": "Heading 3"
        } , {
            "id": "h4",
            "name": "Heading 4"
        } , {
            "id": "h5",
            "name": "Heading 5"
        } , {
            "id": "h6",
            "name": "Heading 6"
        }
    ] );

    app.createColorDropdown ( 'formatting', 'Color',  'cmd_font_color', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQgRH//O3kcAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAjklEQVQ4y2N8//YeAzYQl3Di/6IFFowMBAATNsHtO0/8R6ZJNmD5clSaJAPQbSXkCiZctsP8T8gVTNhsQw88fK5gRI6FuATcCnHFCAsh22GGbt954r+nO6YhTOh+RweRkfjlmfDZTiiGGBgYGBh9fZf9x+VXXGGCrIYRV1ImFrC8f/fqPyUGMDFQCAbeAADmv021pI9AzwAAAABJRU5ErkJggg==' );
    app.createColorDropdown ( 'formatting', 'Background Color',  'cmd_back_color', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQgSHE3q3D4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA4ElEQVQ4y8WSsQ3DIBRED+RxcJ8NojTu3SA2cM8A9N7AcvNHsLwBvd1FygZRRiAFATsIrEQpchVCvIcOPnvcb0gzzdYR+XXbApfziaGQKrdJBIyDh6SyDrCuJOE4iFSd80LCNFv3lUCqzhljXjXaoqTK4wRjDIQQABbUdR2rEXlJqMhLNwsh0DQNAEBrHSXbOS/iJRgAfAXCVuXgDVJ4XdedBFiWBYePOA4901q/wSEBJqLYPfsL49Cz0DsP9xEOdVhuEqXqXLsrnMLTvA1WVrCXpHAadrvmJ+zTcPyY/wueDMl5dpRvQHAAAAAASUVORK5CYII=' );
    
    app.createSimpleButton( 'justify', 'Left',   function() { app.appHandler('cmd_justify', 'left' ); },   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkCJ7fhTXwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAOElEQVQ4y2N8+OwFAyWAiYFCwMLAwMDw9+uD/+RoZuZWYGSBMejiAmwW0dcFo2EwbMOA4sxEsQEAmu4cAbJubzgAAAAASUVORK5CYII=' );
    app.createSimpleButton( 'justify', 'Center', function() { app.appHandler('cmd_justify', 'center' ); }, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkDEBZH2TIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAPElEQVQ4y2N8//YeAyWAiYFCwMLAwMDw/t2r/+RoFhQSY2SBMShyAQwQ6xJkC1lwSYyGwWgY0DUzUWwAANrkHE4b0ZGMAAAAAElFTkSuQmCC' );
    app.createSimpleButton( 'justify', 'Right', function() { app.appHandler('cmd_justify', 'right' ); },   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkCOtTnIaUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAPklEQVQ4y2N8//YeAyWAiYFCwMLAwMDw/t2r/+RoFhQSY2SBMShyATog1kVwF2CTGA2D0TAgxUUUZyaKDQAAdXQcTsJjoc0AAAAASUVORK5CYII=' );
    app.createSimpleButton( 'justify', 'Full', function() { app.appHandler('cmd_justify', 'full' ); },     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkCEuFSiV8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAM0lEQVQ4y2N8//YeAyWAiYFCwMLAwMDw/t2r/+RoFhQSY2SBMUZdMOqCoe0CijMTxQYAADWDHE42l1BhAAAAAElFTkSuQmCC' );
    
    app.createSimpleButton( 'font style', 'Bold', function() { app.appHandler('cmd_font_style', 'bold' ); }, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkKMPzrQrMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAATklEQVQ4y2N8//YeAyWAiYFCQLEBLMic9+9e/cenWFBIjBGvC9AVCAqJMSKLYbNgkIUBOkB3MsEwwBZoQywM0J1ITBiwEFIw+PMCxQYAAAlZG5BCE7fHAAAAAElFTkSuQmCC' );
    app.createSimpleButton( 'font style', 'Italic', function() { app.appHandler( 'cmd_font_style', 'italic' ); }, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkKHM4zLlAAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAbElEQVQ4y2N8//YeAyWAiYFCQLEBLIQUvH/36j+6mKCQGCPRLkBWfOL0PRQ+UQZs33kC7gJPdwtGksPAwlQJbjvJgUjIdoIGELIdrwHE2I7XAGJsZ2BgYGBET8rY4h09OvEmJFwKB29eoNgAAKCBJbZbAa7zAAAAAElFTkSuQmCC' );
    app.createSimpleButton( 'font style', 'Underline', function() { app.appHandler( 'cmd_font_style', 'underline' ); }, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkKDj2KXxgAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAVUlEQVQ4y2N8//YeAyWAiYFCQLEBLOgC79+9+o/MFxQSY8QmhtMFyJIwNjaxwRMGw92A7TtP/EemsQFGXEkZPe6xRSHWhIRPMVkpkZDhLOTaTLVYAACMnB1lh4BI6gAAAABJRU5ErkJggg==' );
    app.createSeparator   ( 'font style' );
    app.createSimpleButton( 'font style', 'Superscript', function() { app.appHandler( 'cmd_font_style', 'superscript' ); }, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkPNfH2QnkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABEElEQVQ4y2NgGPKAEcY4cfszQcUWqhP/I/TVMDAwMDAwwST//fvHUJvp/f/fv38M6BgmvmBvOiPUUphBCAMkmK7/nzm9i6E+2/f//3//Gf7/+89wcNdmFHFVKVYGqGZGDOdNX7CZ4d7tE//v3T7x39XF7n/rpCUo/MPX3jMwMLT8R2C0MDh09S3D1bNHGNwtxf8jG5yeWcZQO3E9ho122sKoXvj/7z+DlqE1w6yVhxiRNdf0r2OEeQkZY4TB779/GQ7s3ciQFm4Hl505vYuhpTDo/++/fxnQMYYBZ4/tYYj11v4Ps3n78ZeMMEM6S0L/s7CwMCBjDIAcYCfvfmM4efcbw8JVe7GKn7z7jWEUIAAA6WK6iJiPjd8AAAAASUVORK5CYII=' );
    app.createSimpleButton( 'font style', 'Subscript', function() { app.appHandler( 'cmd_font_style', 'subscript' ); },     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkQHpAQtacAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABKElEQVQ4y+1SPUvDABB9l9DJH9Bf4JRFNx0MQlMUHEQXJ1dDJ3GpQ7MZEIqg4hCri4IgWtBBsUNbkEJCgoIuGkpMFidxaRGS8ZwSYiK6iw8eHA/u7t0H8HcQeDYHns1lRWbHD+H4IY7Pu9/qjh8meUIcNNs+AUDDqENTZ/nebGNqfIQBQK1UUdu5pCiKEDMGxUHn8Q3m7TWW5yROO1MrVaxvNSnrWBkrfnVQEEVMl+ZxcNajdLK2fUEFUUSWuRFIIDw/mFhZkhMHDaMOfW2RSSBkmSvwdGdhZrKYzHzaekl2srG6wEQCZMlgWTK41Qt+voLpDmC6A2zuneT0/ZtXADrnClj9IcqKzFZ/iCxj/aj7DkDnwys3fwXb+/j1VyZGd1OdNcI/AACf/zSfvQI092EAAAAASUVORK5CYII=' );
    app.createSeparator   ( 'font style' );
    app.createSimpleButton( 'font style', 'Strike Through', function() { app.appHandler( 'cmd_font_style', 'strikethrough' ); },     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkWEs/8XgoAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAyklEQVQ4y2NgGPKAEcY4cfszQcUWqhOReDUMDAwMDEww7r9//xhqM71h9P9///4xwDBM3NVl13+cLrh3+wSM+Z+BgYEhPbOMwck/jTHcQwVDfPceN0YMF+w8+hrF0JnTuxj2bZz1H7tmNBe8SDb7T04ASsw9xchEtVjYc+Elw9EDWxhivbVR/AwD6ZllDOU9q+HqXQzEUcPg7LE9GJrTM8tQwqSzJPQ/CwsLAwsLC9xguAGhrsoYmmPS6hnRA7a1IPA/JycnwyhAAAA3rVLYSxj8NAAAAABJRU5ErkJggg==' );
    
    app.createSimpleButton( 'media', 'Link', 'cmd_hyperlink', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB90ICQkrB8jJ8l8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABNElEQVQ4y52STYrCQBCFv4iCdzG6CHiMyr6uEXATXEo2Ax5jep9rCEJMC5F4FnsWmU5ifhyYgqaT6tevXr3qoK4KfFyud8dE7KNNwEwshpcNsN1u2Ucb9tEGgyE5HN0cQVBXBZfr3akq1lrCMOT5uJFcj+9IA+ev00jJ0leOY8jzEGstaboD8g6lMWijctjOAsAYJcssz8eN9erVlNO4WX0RxoxaWPqP9erVyVZ/Q0FNt38yMTnsOEen91M1v7YqmPwzgSeZBM5U7xHMA9pWMKjq9BibOfcrx0MJoyLtSOuqoK4KRMSJfDsRcWVZOudcu4vI239Zlk5EXF0VjYLOg6PLsow0TfkrPG4xPAjDsBGtGnigX/28xy2HBNZa/2gcMFLj8x7XetD34t8e9L0YOj6VA/gBWOzfdfqCxAUAAAAASUVORK5CYII=' );
    app.createSimpleButton( 'media', 'Picture', 'cmd_picture', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkkI3NSCkEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAxElEQVQ4y6WTsQ3CMBBFXxDr+ffXIDagzwBe5XoPlA2ijGCKJNgYAoH85iTL9+78JHfTOHAkZ4DL9Zb/JkzjQAgh5xzynP01hJBPBZUAbVZ3QxISuPtyDhVAHyHujhmYrQC1gPQF0iYViXs2MPNlMphZgRaJ+WeRjcTniauwb89660ASZoaZPSASSC3kjYO1GVjMG5ITY5xvSaS0sUHdXGTNte97AGKM1SYVoJ28pjb/CqkA7eS6cQsC0E3jcOgzdUe/8x3Uo9QMo4dUUAAAAABJRU5ErkJggg==' );
    app.createSimpleButton( 'media', 'Video', 'cmd_video', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALawAAC2sBAA3gSgAAAAd0SU1FB90FFwokGIhJuSEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA2UlEQVQ4y52TwU7DMBBE30aV4IYKlXrjH7jyc5n8ISfoF/TApRIScBwOsY2dJiV0pWi80cx41paDxVIH3KVmL/GW1u+S9pm1mRFu0+JR4iX/7fsegIj4rNkxEd9KfM+IToUhHSQ9Twx+hZUoc07APRdm3UqyjW0MGPhifekBaAwk/YXH2mA3JrBHo3WYRqPL5xAR2F6Fksr2XfoYjddjbdBeZSy3McTZCZYEhW0X1aSdrTZBZpe4TbtocDHBzFRNbc4SVDjd2b2XDYZh4JrKb+EG9PpP7Qfw9APV9Jvgm9qjqAAAAABJRU5ErkJggg==' );
    
    var ctxMenu = [];
    
    for ( var i=0, len=toolbars.length; i<len; i++ ) {
        ( function( toolbarName ) {
            ctxMenu.push( {
                "caption": toolbarName,
                "input"  : "checkbox",
                "checked": function() {
                    return !!app.toolbar.groups[ toolbarName.toLowerCase() ].visible;
                },
                "handler": function( bool ) {
                    app.toolbar.groups[ toolbarName.toLowerCase() ].visible = !!bool;
                },
                "items": [
                    {
                        "caption": "Customize this toolbar",
                        "handler": function() {
                            app.appHandler( 'cmd_customize_toolbar', toolbarName.toLowerCase() );
                        },
                        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQk3KfJoos0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAsklEQVQoz62TsQ2DMBBFj4j1Pv01iA3oGYA+G0Qpzqukp/cGlkf4qQyGgEFJTjpZ3/Z/+pbtKgYvv1RdWmy7nnvzz8e9arsXi4C26zmOYwGsIiJyK5mHYdgF5OA6RVnKSTLn41Hdrpi3SVYaAEkSAKdp4p5OY+oYvABGwDgDzIwAaGYrnZtj8JL3CnBUeaItIAa/XKNzbj6Wqs5aVa89pO3GM+MH4CjBGew/CZqm+fozvQGzPcQzOEFmaQAAAABJRU5ErkJggg=="
                    },
                    {
                        "caption": "Docked",
                        "handler": function( bool ) {
                            app.toolbar.groups[ toolbarName.toLowerCase() ].docked = !!bool;
                        },
                        "input" : "checkbox",
                        "checked": function() {
                            return !!app.toolbar.groups[ toolbarName.toLowerCase() ].docked;
                        }
                    }
                ]
            } );
        } )( toolbars[i] );
    }
    
    ctxMenu.push(null);
    
    ctxMenu.push({
        "caption": "Save toolbar",
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICA4qBhsmgmgAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAfklEQVQ4y8WTwQmFQAxEX2Sb3IvYgfcUMHc7EC92ZQefX4IeZEFUFHcRcwtkJpkkY//fREkEgLpp5xzw0HcWUhIjjCNIugS5O5JwdwCqnM4JnE0QI2UE2/ieIOy1bRd0p/9AcFbwaAJYf+GVK0g6fbLvr2DJjTmGGvrOrNTOC0vmIx4jTocNAAAAAElFTkSuQmCC",
        "handler": app.appHandler,
        "id": "cmd_save_toolbar"
    });
    
    app.toolbar.addContextMenu( ctxMenu );
    
}