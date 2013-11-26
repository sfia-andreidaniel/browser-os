function HTMLEditor_toolbars( editor ) {
    
    return editor.chain( function() {
        
        this.toolbar.height = 20;
        var editorInstance = this;
        
        var colorPalette = [
            "white", "silver", "gray", "black", "red", "maroon",
            "yellow", "olive", "lime", "green", "aqua", "teal",
            "blue", "navy", "fuchsia", "purple"
        ];
        
        var createColorPane = function( defaultColor ) {
            return $('div', 'color-pane').chain(function() {

                this.addCustomEventListener('color-changed', function( color ) {
                    return this.parentNode.onCustomEvent('color-changed', color );
                } );

                this.appendChild( $('b', 'default').setAttr(
                    "style", "background-color: " + defaultColor + ' !important'
                ).setAttr(
                    "data-color", "default"
                ).chain( function() {
                    this.onclick = function() {
                        this.parentNode.onCustomEvent('color-changed', false );
                    }
                } ));

                for ( var i=0,len=colorPalette.length; i<len; i++ ) {
                    this.appendChild( $('b') ).setAttr(
                        "style", "background-color: " + colorPalette[i] + ' !important'
                    ).setAttr(
                        "data-color", colorPalette[i]
                    ).chain(function() {
                        this.onclick = function() {
                            this.parentNode.onCustomEvent('color-changed', this.getAttribute('data-color') );
                        }
                    });
                }
            });
        }

        this.toolbar.onmousedown = function(e) {
            e.preventDefault();
        }
                
        this.toolbar.onmouseup = function( e ) {
            e.preventDefault();
        }
        
        this.createToolbarGroup( 'Table' ).chain( function(){
            this.addButton( 'Insert Table', '',  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EDAgGMdS1Si0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAR0lEQVQoz+2PMQrAMAwDLyHPDhmM/q0OoZAtYHfsLUKDLa4BpsDYoeT5pFNkACiS+2unXxTyya0DLis0wAolFeav8JlC5cEDfWitWAG6BsQAAAAASUVORK5CYII=" ).chain( function() {
            
                var overlay = this.appendChild( $('div', 'table-overlay' ) ).chain( function() {
                    
                    var numRows = 1;
                    var numCols = 1;
                    
                    var maxRows = 10;
                    var maxCols = 10;
                    
                    var overlay = this;
                    
                    var setColsRows = function( cols, rows ) {
                        cols = parseInt( cols || '1' );
                        rows = parseInt( rows || '1' );
                        
                        var row, col;
                        
                        if ( cols > maxCols ) cols = maxCols;
                        if ( cols < 1 )  cols = 1;
                        if ( rows > maxRows ) rows = maxRows;
                        if ( rows < 1 )  rows = 1;
                        
                        for ( var j = 1; j <= maxRows; j++ ) {

                            row = overlay.childNodes[ j - 1 ];
                            
                            for ( var i=1; i <= maxCols; i++ ) {
                                col = row.childNodes[ i - 1 ];
                                ( col.style.backgroundColor = ( i <= cols && j <= rows ) ? addStyle : removeStyle )( col, 'hover' );
                                col.style.display = ( i <= cols + 1 && j <= rows + 1 ) ? '' : 'none';
                            }
                        }
                    }
                    
                    for ( var row = 0; row < maxRows; row++ ) {
                        overlay.appendChild( $('div', 'row' ) ).chain( function() {
                            var line = this;
                            line.setAttribute( 'row-index', row + 1 );
                            for ( var col = 0; col < maxCols; col++ ) {
                                line.appendChild( $('div', 'col' ) ).chain( function() {
                                    this.setAttribute( 'col-index', col + 1 );
                                    this.onmouseover = function( ) {
                                        setColsRows( this.getAttribute( 'col-index' ), this.parentNode.getAttribute( 'row-index' ) );
                                    }
                                    
                                    this.onclick = function() {
                                        overlay.style.display = 'none';
                                        setTimeout( function() {
                                            overlay.style.display = '';
                                        }, 100 );
                                        editorInstance.runHandler( 'insert-table', this.getAttribute('col-index'), this.parentNode.getAttribute('row-index') );
                                    }
                                    
                                } );
                            }
                        } );
                    }
                    
                    
                    setColsRows( 3, 3 );
                } );
            } );
            
            this.addSeparator();

            this.addButton( 'Align Text at Top inside Table Cell',     'table_align_top',     "data:image/gif;base64,R0lGODlhEAAPAMZTAAAAAAAAAgEAAAABAAEBAAEBAQEBAwICAgMCAAEDAgMDAwMDBQQEBAQEBgUFBwQGBQYGBgUHBgcHBwgJCwsLCQsLCwoMCwwMCg4ODBISEt3d2+Li4OTk5OXl5ebm5ufn5ebn6efn5+jo6Ojo6ujp6+np6erq6urr7evr6+zs7Ozs7u3t6+zt7+3t7e7u7O7u7u/v7+/v8fDw8PDw8vHx7/Dx8/Hx8fHx8/Ly8PLy8vLy9PPz8fPz8/Pz9fL08/T08vP09vT09PT09vX19fX19/X2+Pb29vf39ff39/b49/j4+Pn5+fn6/Pr6+vv7+fv7+/39+/39/f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAQAA8AAAfLgH8Cf4SFhoQIfwENAQEGAQsBDpCNjAGKMT1EIzpCMyoqNz03l38EOwAAF6kAFKyohAA/LjgfLjRQGytHThoYhAM+EQMDFgMPAwnESQOEEyQsNUwgQDUnQCwsRaUKLS82MDApTSImUyYyBbFG4SlDKChRKd48CoQQQSFLHUpILSlIbJSAAYAQgw48kAwJ8SIFD4FTWhT8A6BJjhYlkKR40kIGEhE81FE04cFGjhxSOMCQkUJEk4KpMhwAUIHVgQIFGACQUNDeoZ8FAwEAOw==");
            this.addButton( 'Align Text at Middle inside Table Cell',  'table_align_middle',  "data:image/gif;base64,R0lGODlhEAAPAMZUAAAAAAAAAgEAAAABAAEBAAABAwEBAQEBAwACAQICAgMCAAEDAgQDAAMDAwIEAwUEAAQEBAYFAQUFBQQGBQcHBwgICAkJCQwMDA0NCw0NDREQDOTk4uXl5eXl5+fn5+jo6Onp5+np6enp6+rq6urq7Ovr6err7evr6+vr7evs7uzs7Ozs7u3t6+zt7+3t7e7u7O7u7u7u8O/v7e/v7/Dw7u/w8vDw8PDw8vHx7/Hx8fHx8/Dy8fLy8PHy9PLy9PHz8vPz8fLz9fPz8/Pz9fT08vT09PT09vX19fX19/b29Pb29vb2+Pf39/j49vf4+vj4+vn59/v7+/z8+vz8/P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAQAA8AAAfPgH8Cf4SFhoSDEQICGgIMigIPiwqOgwFLHSskNz5LQzooQyQBhAFIKEZUIitGKDpPMUMHhAA8OCwbTS8sLCVAMi8YhAQlSUlELzQ4UiBJG1AAhAg7AwMIAwvVAxMOPwOlQSlOJjVBJik1LS09BbRKAAASAAnwDQAXHxCECSpTLkcjRgjJUWTGiSLR/jRQIeQDDBdUOMxQUWTEjAa0igg5kkPICCUzQgqJktBACBseonAIIQQGExcnYOizEA8egAoUDACAYA9AhmgJDgn9Ey0QADs=");
            this.addButton( 'Align Text at Bottom inside Table Cell',  'table_align_bottom',  "data:image/gif;base64,R0lGODlhEAAPAMZJAAAAAAAAAgEAAAABAAEBAQICAgMCAAICBAMDAwMDBQIEAwQEBAYFAQUFBQYFAwcHBwgIBggICAkJCQoKCgsLCwwMDA4ODhMTE+Hh4eLi4uPj4eTk4uTk5Ofn5+jo6Orq6Orq6uvr6+vr7ezs7Ozs7uzt7+3t7e3t7+zu7e7u7O3u8O7u7u7u8O/v7+7w7/Dw7u/w8vDw8O/x8PDx8/Hx8fHx8/Dy8fLy8PLy8vPz8/Pz9fP09vT09PT09vX18/X19fT29fb29vf39/j4+Pn5+fn5+/r6+Pr6+vz8+v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAQAA8AAAesgH8Mf4SFhoQOfwKLjI0GDI1/ATWUlZQsJD0iAYQJLJ+gnzosJ0UHhAAvqquqKUY+GgCEEKysNxsfSLJ/Ay6+v75ANjIoCoQBMMnKySUzKjucfwAxOCYtOR5DKzgcQjS70wAFABYADQAAFwAhE6ghQTRDGTggODEdITEFqEfoAAsLEBCQAIDCj31/Koz4wSMHDhwdcLQggmGFLIL+FqB7IK5gBASyCBwaKe1PIAA7" );
            
            this.addSeparator();
            
            this.addButton( 'Insert Table Row Above', 'table_insert_row_above', 'data:image/gif;base64,R0lGODlhEAANAMIDAE1NTU1Npk3//////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAQALAAAAAAQAA0AAAMwSLoM/iwSMGqVzV6sqH4QEUwgIAynACjBGKEw0M5Riq6i25QsCXIdHrCE4xCBvkcCADs=' );
            this.addButton( 'Insert Table Row Below', 'table_insert_row_below', 'data:image/gif;base64,R0lGODlhEAANAMIDAE1NTU1Npk3//////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAQALAAAAAAQAA0AAAMvSLoM/iySB+Wizl7MVZiYMIgC4H3RqAJB20bkaBJv1NEgpSnA4Pu7yQ+46w2DnAQAOw==' );
            this.addButton( 'Delete Table Row',       'table_delete_row',       'data:image/gif;base64,R0lGODlhEAANAKECAP8AAE1NTf///////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAMALAAAAAAQAA0AAAIrnI+hiz0hYnRJzgFQflYYsIHGwnzghlGmKTonimrhRiqfNtZqTu6PvqsFCgA7');
            
            this.addSeparator();
            
            this.addButton( 'Distribute rows evenly', 'table_distribute_rows_evenly', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAcYaAAHGGgBcvBr/QAAAAd0SU1FB90EEQcpIAU2ms0AAAIYSURBVCjPbZG9bhNBGEXPNzM7Y3sdY5MfCRSJgoYmNS8SgdLk5aDIDwoSOJSIjgqJAqWmQgpKYid2vLO7M/tRWIKCFKe9RzpXzqcfaNsaVaEoLJ22xBjxRY/+YEK9KmibAaIjXh3u6fGbCzGuBgG1BhX+MSyDBu8UCj05+ozzhf7HzewWAOccOWdEoWkioe8ZjR7jg3L27qt07ZD9gz09O/0hV7OfmOFwiKqSUgI1CA5rAzlnnLdkaegksmpuAGjSnMmmxyyXc3KuEclYJ6TUMdoYsVgsUM0gmVV1Rzn0AKhtqdMKU1UV4/EY7z11XRFCwe3ijt3dXXLucEWPlB0xFgCIDkH7uM3tHW7mcwC8s4iNrOI1chtBDaulMN54TrUoAYj3W0y2NgGMinEKRo1BkTVFD/WDUo9PvzxcdTa7JqVECAERQURpU02ba3a2d8l5yfuzbxKXJQeHL/To7YXU6RLnnMNai6pSVRUiltGopIsdvV4g9Aqq1RxEAMBUDDccLsaIMYYQAv1+ibOexWJBmxMpdaAGMITQByC1GVt0a6NzjpQSOSttkylc4NFkRGoyOWcGgwGxqgHoug5jHKYsS9q2RUQIIWCtoyxLfl9eYWyBtevRQT8AUA76tHWz/lRE1BijYNSankKhYNSHUk9OPj1YVabT6V9j10FOivceHxxX1zOePnnG/TLRdSX7r1/q+cfvMpv/4g/2eR7M454ZMAAAAABJRU5ErkJggg==');
            
            this.addSeparator();
            
            this.addButton( 'Cell background', '', "data:image/gif;base64,R0lGODlhDQAMAMIEAAAAAAAAe3t7e729vf///////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAcALAAAAAANAAwAAAM3eCoRojAG5aI8IIBnjx7O1gEDEQxMA5FERjYqSwwkCstDjqYTMOsCAcAzwQCFFA4miFxYNkNLAgA7" ).chain( function() {
                this.style.paddingRight = '20px';
                this.style.backgroundPosition = '2px 50%';
                this.color = this.appendChild( $('div', 'color') );
                this.color.appendChild( new createColorPane( 'white' ) );

                var currentColor = false;

                this.color.addCustomEventListener('color-changed', function( color ) {
                    currentColor = color;

                    this.style.backgroundColor = color ? color : 'white';
                    
                    editorInstance.runHandler( 'td-bgcolor', color );
                    
                    return true;
                } );
                
                this.color.style.backgroundColor = 'white';

                ( function( button ) {
                    button.addEventListener('click', function(e) {
                        if ( e.srcElement == button || e.srcElement == button.color ) {
                            button.color.onCustomEvent( 'color-changed', currentColor );
                        }
                    } );
                } )( this );
            });
        }).chain(function(){
            editor.toolbars._registerToolbar( this, "Table", true );
        });
        
        this.createToolbarGroup( "Objects" ).chain( function() {
            
        } ).chain( function() {
            editor.toolbars._registerToolbar( this, "Objects", true );
        });
        
        // this.createToolbarGroupSeparator();
        
        this.createToolbarGroup( 'Styles' ).chain( function() {
            
            var addOption = function( container, value, caption ) {
                container.appendChild( $('div', 'option') ).chain(function(){
                    this.value = value;
                    this.caption = caption;
                    this.appendChild( $text( caption ) );
                    this.onclick = function() {
                        this.parentNode.onCustomEvent('option-click', this.value );
                    }
                })
            }
            
            this.addPlaceholder().chain( function(){
                this.appendChild( $('div', 'dropdown') ).chain(function(){
                    addOption( this, '', '- Style -' );
                    addOption( this, '', '[ Clear Formatting ]' );
                    addOption( this, 'p', 'Paragraph' );
                    addOption( this, 'h1', 'Heading 1' );
                    addOption( this, 'h2', 'Heading 2' );
                    addOption( this, 'h3', 'Heading 3' );
                    addOption( this, 'h4', 'Heading 4' );
                    addOption( this, 'h5', 'Heading 5' );
                    addOption( this, 'h6', 'Heading 6' );
                    addOption( this, 'dd', 'Definition Description' );
                    addOption( this, 'dt', 'Definition Term' );
                    addOption( this, 'address', 'Address' );
                    addOption( this, 'pre', 'Computer code' );
                    
                    this.onclick = function() {
                        this.scrollTop = 0;
                        addStyle( this, 'collapsed');
                    }
                    
                    this.onmouseout = function() {
                        removeStyle( this, 'collapsed');
                        if ( this.offsetHeight < 30 )
                            this.scrollTop = 0;
                    }
                    
                    for ( var i=1, opts = ( this.childNodes || [] ), len = opts.length; i<len; i++ ) {
                        if ( opts[i].value ) {
                            opts[i].innerHTML = '<' + opts[i].value + ' style="padding: 0; margin: 0;">' + opts[i].caption + '</' + opts[i].value + '>';
                            opts[i].style.height = 'auto';
                        }
                    }
                    
                    this.style.maxWidth = '200px';

                    this.addCustomEventListener('option-click', function( value ) {
                    
                        editorInstance.runHandler( 'format-block', value );
                    
                        return true;
                    } );
                });
            } );
            
            this.addPlaceholder().chain( function() {
                this.appendChild( $('div', 'dropdown') ).chain(function(){
                    addOption( this, '', '- Font -' );
                    addOption( this, '', '[ Default ]' );
                    addOption( this, 'Arial, Arial, Helvetica, sans-serif',              'Arial' );
                    addOption( this, 'Arial Black, Gadget, sans-serif',                  'Arial Black' );
                    addOption( this, 'Palatino Linotype, Book Antiqua, Palatino, serif', 'Book Antiqua' );
                    addOption( this, 'Comic Sans MS, cursive',                           'Comic Sans MS' );
                    addOption( this, 'Courier New, Courier New, monospace',              'Courier New' );
                    addOption( this, 'Georgia, serif',                                   'Georgia' );
                    addOption( this, 'Impact, Charcoal, sans-serif',                     'Impact' );
                    addOption( this, 'Lucida Console, Monaco, monospace',                'Lucida Console' );
                    addOption( this, 'Lucida Sans Unicode, Lucida Grande, sans-serif',   'Lucida Sans' );
                    addOption( this, 'MS Sans Serif, Geneva, sans-serif',                'MS Sans Serif' );
                    addOption( this, 'MS Serif, New York, serif',                        'MS Serif' );
                    addOption( this, 'Symbol',                                           'Symbol' );
                    addOption( this, 'Tahoma, Geneva, sans-serif',                       'Tahoma' );
                    addOption( this, 'Times New Roman, Times, serif',                    'Times New Roman' );
                    addOption( this, 'Trebuchet MS, sans-serif',                         'Trebuchet MS' );
                    addOption( this, 'Verdana, Geneva, sans-serif',                      'Verdana' );
                    addOption( this, 'Webdings',                                         'Webdings' );
                    addOption( this, 'Wingdings, Zapf Dingbats',                         'WingDings' );

                    for ( var i=1, opts = ( this.childNodes || [] ), len = opts.length; i<len; i++ ) {
                        opts[i].style.fontFamily = opts[i].value;
                    }

                    this.onclick = function() {
                        this.scrollTop = 0;
                        addStyle( this, 'collapsed');
                    }
                    
                    this.onmouseout = function() {
                        removeStyle( this, 'collapsed');
                        if ( this.offsetHeight < 30 )
                            this.scrollTop = 0;
                    }

                    this.addCustomEventListener('option-click', function( value ) {
                    
                        editorInstance.runHandler( 'font-family', value );
                    
                        return true;
                    } );
                });
            } );

            this.addPlaceholder().chain( function() {
                this.title = "Font Size";
                
                this.appendChild( $('div', 'dropdown') ).chain(function(){

                    addOption( this, '', '- Size -' );
                    addOption( this, '', '[ Default ]' );
                    addOption( this, '1', '1 (XS)' );
                    addOption( this, '2', '2 (S)' );
                    addOption( this, '3', '3 (M)' );
                    addOption( this, '4', '4 (L)' );
                    addOption( this, '5', '5 (XL)' );
                    addOption( this, '6', '6 (XXL)' );
                    addOption( this, '6', '7 (XXXL)' );
                    
                    this.onclick = function() {
                        this.scrollTop = 0;
                        addStyle( this, 'collapsed');
                    }
                    
                    this.onmouseout = function() {
                        removeStyle( this, 'collapsed');
                        if ( this.offsetHeight < 30 )
                            this.scrollTop = 0;
                    }
                    
                    this.addCustomEventListener('option-click', function( value ) {
                    
                        editorInstance.runHandler( 'font-size', value );
                    
                        return true;
                    } );
                    
                });
            } );
            
            this.addSeparator();

            this.addButton( 'Text Color', '', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAALCAYAAACksgdhAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EDAgkKvlixeEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAcUlEQVQoz2M8dvgYAzZgZbvv/7HDTozY5JiwCe7bv+8/Mk2Uppo6VJqgJnTTsdnGhMsWmH+w2caEzVT0AEC3jRE59KxssXsc3SAWQrbADNq3f99/J0eIHBO6X9BBSxOmPBM+W3CFLCMDQ8t/XG7H5UcAtlZDh4XoahgAAAAASUVORK5CYII=" ).chain( function() {
                this.style.paddingRight = '20px';
                this.style.backgroundPosition = '2px 50%';
                this.color = this.appendChild( $('div', 'color') );
                
                this.color.appendChild( new createColorPane( 'black' ) );
                
                var currentColor = false;
                
                this.color.addCustomEventListener('color-changed', function( color ) {
                    currentColor = color;
                    this.style.backgroundColor = color ? color : 'black';
                    
                    editorInstance.runHandler( 'color', color );
                    
                    return true;
                } );

                this.color.style.backgroundColor = 'black';

                ( function( button ) {
                    button.addEventListener('click', function(e) {
                        if ( e.srcElement == button || e.srcElement == button.color ) {
                            button.color.onCustomEvent( 'color-changed', currentColor );
                        }
                    } );
                } )( this );
                
            } );
            
            this.addButton( 'Background Color', '', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EDAgiBp3gDoQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAfElEQVQY043OQQ6DMAxE0T+ISxE1N0NdFDhZpLmWWUQBtU2hXlnWG9tyMVeVcorWu1jjPzgikCBlxXiFI+pySUDth1u8iPW1AsLFGm4xK/NzxsX6ulB/DrZl6+K3QMOtevgIpJzCxcTpuxhAQLiY6TGdQ6mLj8Dn8BcG2AEQR0m0tIqwWQAAAABJRU5ErkJggg==" ).chain( function() {
                this.style.paddingRight = '20px';
                this.style.backgroundPosition = '2px 50%';
                this.color = this.appendChild( $('div', 'color') );
                this.color.appendChild( new createColorPane( 'white' ) );

                var currentColor = false;

                this.color.addCustomEventListener('color-changed', function( color ) {
                    currentColor = color;
                    this.style.backgroundColor = color ? color : 'white';
                    
                    editorInstance.runHandler( 'bgcolor', color );
                    
                    return true;
                } );
                
                this.color.style.backgroundColor = 'white';

                ( function( button ) {
                    button.addEventListener('click', function(e) {
                        if ( e.srcElement == button || e.srcElement == button.color ) {
                            button.color.onCustomEvent( 'color-changed', currentColor );
                        }
                    } );
                } )( this );
                
            } );
        } ).chain( function() {
            
            editor.toolbars._registerToolbar( this, "Styles", true );
            
        });

        this.createToolbarGroup( 'Edit' ).chain( function() {
            this.addButton( 'Undo', 'undo', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAHCAYAAAA8sqwkAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EDAgEGko/0e8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAWklEQVQY042PUQrAIAxDE9mpBD/s0aTnch+C1+o+RkeR4Za/hJeSco6JN+XSLXptgFQhAbU5hCsYM8+1AQT0AXLptoJrKUWzg11pt/uzsCv5D8efGf28j0gVXkSmK9daHTWQAAAAAElFTkSuQmCC" );
            this.addButton( 'Redo', 'redo', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAHCAYAAAA8sqwkAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EDAgELmuLJVoAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAX0lEQVQY042PMQqAMBAE58RXBVKYd4lFyLvOInDfOqtAjAadcpldWLFq6Km+H9ywmoQX1iaPQojqYzFEdYHis7UmWU3SBhY+6OVfhV4GWEp+hjMZQKwaIaqXDGmbf2lcOyMwBRNHqxwAAAAASUVORK5CYII=" );
            this.addSeparator();
            this.addButton( 'Bold',           'bold',            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc1DQTtFKcAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAQElEQVQY062QMQrAMAzE5NCH+en6mbNkKGkJHnKjuANxARSHqIHKKhZQ6ocNGmmVnh1kZu1O409UjffonlN0fppvqB2Mda2ztwAAAABJRU5ErkJggg==");
            this.addButton( 'Italic',         'italic',          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc1Iq88Kf4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAASUlEQVQY03WQuQ0AMAwCIZN5NEZjs6SKFD+hsYVOV0DbeBMRGyWrFrZ5f0mwzQnaj5WjSVK6DZosDZosCfpZEvSzAAABtF3qFAcZqCJSzishPwAAAABJRU5ErkJggg==" );
            this.addButton( 'Underline',      'underline',       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc1L9GNVUMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAQUlEQVQY082QMQoAMAjEzr7Mp+dndtEiDqVjA6Ich0MkKfoAmtkCTEndM1t64PsSEH0Xll7k7jE/lIpTumFp9coGVEgjS+Vm2yUAAAAASUVORK5CYII=");
            this.addSeparator();
            this.addButton( 'Left',          'justify-left',     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAALCAYAAABPhbxiAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc3Jppnj2UAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAKUlEQVQoz2NkYGD4z0AO+P//P8OBAwdIphmgNhLE6JrJtpFx1I+DyY8Ai/r3qBKU7tsAAAAASUVORK5CYII=");
            this.addButton( 'Center',        'justify-center',   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAALCAYAAABPhbxiAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc3ORdvgpAAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAALUlEQVQoz2NkYGD4z0AGYDxw4AA5+hhYYAwHBweibD5w4AAjRTYyjvpxMPkRAHniGlKm43yBAAAAAElFTkSuQmCC");
            this.addButton( 'Right',         'justify-right',    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAALCAYAAABPhbxiAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc4GjKQ7y0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAKElEQVQoz2NkYGD4z0AGYDxw4AA5+hhY0AUcHBz+09RGxlE/DiY/AgAapROPI4AomgAAAABJRU5ErkJggg==");
            this.addButton( 'Justify',       'justify-full',     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAALCAYAAABPhbxiAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc4NZlB0nQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAHUlEQVQoz2NkYGD4z0AGYDxw4AADWRpHbRzZNgIA54MRRusE3CwAAAAASUVORK5CYII=");
            this.addSeparator();
            this.addButton( 'Bullets',       'list-bull',        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc7DgNnaJMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAOElEQVQoz2NkYGj4zwAFBw44MDIQCViwCTo4OPwnS+OBAwcI2sx44MABBnIAEwOZgHE0cIZF4AAA2yMaYo246ccAAAAASUVORK5CYII=" );
            this.addButton( 'Numbers',       'list-num',         "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc7AZPYdQIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAUElEQVQoz92RsQ3AQAgDjZTBPFpGu834Kq+IJgEpTVwimcMmANkkONTQYZN1aDufjDElhnTu7R1zAJpoE9unXsR7zr+WMyLWjK/Lqa1++scF5HZBzlb/YnYAAAAASUVORK5CYII=" );
            this.addButton( 'Outdent',       'outdent',          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc7H2nXSGEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAYklEQVQoz92TQQ6AMAgEofFhPM2nzc/qqQnBlFKNF/cIAYZtUUBmMrMOqCTSrEFFh5/mE4DG2NcEdDCNHqwatFH8lEBFzltxJFl6MAiqK/inbbsT//0P5gTZPbwmaFmy4sEFcxU+GyqV+FgAAAAASUVORK5CYII=" );
            this.addButton( 'Indent',        'indent',           "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB90EDAc7NbJsgbcAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAZElEQVQoz92TQQ6AQAgDYePDeJpPm5/hyQQxi6jxYo+Q0tJdFJAZzMwBlQJaDehgiWqxAWiufe0AB9OcwdWAcSTgdx2oyHoiZSetDHb1SJ6tEJ92PFX+5z+YO6ju4bWDUTU7GWxDFT4bf4YaugAAAABJRU5ErkJggg==" );
            this.addSeparator();
            this.addButton( 'Increase Font', 'increase-font',    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EDAsYCF23Q6MAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABHklEQVQoz42SoY7CQBRFz2xW1OJAlgQxcuVU1iDrO7IWx2905SR8AbKuJAhGFomjgmRHFjmybtYsDSwLy3Mv75zk5uaJ3W7HS9P3HLIsfGy3AuCNF+eQZYHZjMN8Hl4WLzCnExf5/RG8WCxCkiTkeS7kaiWub9Fkwp/iZrMJbdsCoJQijuM75i6q956qqpBS0rYt+/0+9H3/v2itDc45tNbiZ8d7/1z03mOMoSxLIaVEKYVzjqZpwlPRWjsAXdcRx7EAMMbwO664PMD5fEZrHR61XBQFeZ4P7Q6tHo/HAFDXNVEUiesUxnx+WWunaZoyHo9vo1ZVRVmWNxJAkiRiNJpMO+eo63pIJIqiCE3TDKDWGqXUIK/X65s7wHK55Bs9NoJBtVaHmgAAAABJRU5ErkJggg==" );
            this.addButton( 'Decrease Font', 'decrease-font',    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAYAAADkZNYtAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EDAscJ5IKu/4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAqElEQVQY04XLoRGDQBSE4b3oFBAbSRXMIK8E6rgC6IAKzuI4eQ4sdPAkhhlw2ZmYcy+GCDJAfrXiW9N1HY5KpM51jfc4AgCeVQVzhrcD5rrWe56bR1Fc499u30ES3nudpuk/bttWm6ZB3/eaUrrGIoKyLBFjwLIs59h7ryQBwJAJMUY9xCQxDAOyLANJtdYihIDtvMfOOX29FogIrLVGRAAAzjld13WHP5u8XdOhv5euAAAAAElFTkSuQmCC" );
            this.addButton( 'SuperScript',   'superscript',      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EDAsyF7/Ugn4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA6klEQVQY04WPvWoCURCFv7tPsGVKmzR2doGAlVYphDxA2mCZJlhod0WTRjQY2zUkTYqIpEwWxB9wC7sYC9lHEIXANrJ30mjYu00GPpg5c2DOqPn6h//q7LQth1Y5xhhq5QsxxpDmqHv+tQIUIGROMgJIsZCX2WrHbLWj8fAMYOmgBTT0vHdrWe/Y5sn39mgW0KLGyw3LxZTyVUmSuYuFPLX2QKX/ccQI2dw5FX2vkuZq602JEdI4+zhm5A9pVm//Lnx8jtE3l7KPY9Jw9/hiZe4+Da159LUhibUMwoggjOi/+gDiuq6lB2HELwYdrQHrOHk6AAAAAElFTkSuQmCC" );
            this.addButton( 'SubScript',     'subscript'  ,      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90EDAszLWDDao0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA7UlEQVQY02NQkFD4z8DA8N/Vxe7/ybvfGE7e/cawcNVeBgYGBgzxk3e/MTB0TluKIjl10UYU/oErbxmQMeOeCy8Zjh7YwlBfkPyfAQm4utgxlPesZmRAA0yszMwMDs7+DBUtXYzIimv61zGyMjMzoGMmRiZGhmvnjzJ01JTBbdi95xBDS2HQf0YmRgZ0zDB9wWYUN7dOWoLCP3ztPQMDQ8t/BoaW/5XTTzOgSB69/oHh6PUPDO2TIZoEBATg4jO2PYZoPHbzI4Ori93/Yzc/MqBjmPiCva8ZGBha/s/efJ2B8cTtzwyEgIXqRLj/AEeHi5G/qed6AAAAAElFTkSuQmCC" );
        } ).chain( function() {
            
            editor.toolbars._registerToolbar( this, "Edit", true );
            
        } );

        this.addCustomEventListener( 'resize', function() {
            
            var groups = this.toolbar.querySelectorAll('.group');
            var lastY = 0;
            for ( var i=0,len=groups.length; i<len; i++ ) {
                if ( groups[i].visible )
                    lastY = ( groups[i].offsetTop + groups[i].offsetHeight );
            }
            this.toolbar.height = lastY;
            return true;
        });
        
        MakeSortable( this.toolbar );
        
        this.toolbar.addContextMenu( [
        
            {
                "caption": "Toolbars",
                "enabled": false
            },
        
            null, 
            
            {
                "caption": "Edit",
                "checked": function() {
                    return editor.toolbars.Edit.visible
                },
                "input": "checkbox",
                "handler": function( visibleState ) {
                    editor.toolbars.Edit.visible = !!visibleState;
                }
            },
            {
                "caption": "Objects",
                "checked": function() {
                    return editor.toolbars.Objects.visible
                },
                "input": "checkbox",
                "handler": function( visibleState ) {
                    editor.toolbars.Objects.visible = !!visibleState;
                }
            },
            {
                "caption": "Styles",
                "checked": function() {
                    return editor.toolbars.Styles.visible
                },
                "input": "checkbox",
                "handler": function( visibleState ) {
                    editor.toolbars.Styles.visible = !!visibleState;
                }
            },
            {
                "caption": "Table",
                "checked": function() {
                    return editor.toolbars.Table.visible;
                },
                "input": "checkbox",
                "handler": function( visibleState ) {
                    editor.toolbars.Table.visible = !!visibleState;
                }
            },
            null,
            {
                "caption": "Save toolbars",
                "handler": function() {
                    
                }
            }
        ], function(e) {
            
            return !e.shiftKey;
            
        } );
        
    } );
    
}