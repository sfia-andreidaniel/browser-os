function JMineSweeper() {
    
    var dlg = new Dialog({
        "width": 48,
        "height": 48,
        "caption": "MineSweeper | JSPlatform",
        "resizeable": false,
        "maximizeable": false,
        "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADTAAAA0wB/Z14fgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHwSURBVDiNhZM9ixpRFIaf6+hMNCMrgVELTaOFUWRdEFIEF8E/kCKksE2V32KdLUyRJlV+QSqLLCEGwUJYP2BSCn5gbCYYdceTIuPn7rIHDlzOfc/He+97EBHucyADiOeZh3A+PFNKmUqpHI+YUiqnlDJ3Aa+bCVwDM+AcuAS+HEzwFXgPXHiYa8AUEZSI4HX+BjwD/kYiEaNYLKpYLIau60ynU/r9PrZt3wJ+4DdwKSI3ypsApdQ58COVSgXL5TKapt0Z37ZtGo2GC7wSkZ/A/g2AJ6ZpGqVSCU3TiEQixONxTHNPN51Ok81mNeDtNuZXSmW887tMJuPTdR2AarWKZVm4rstkMqFerwOQz+fpdrtvlFIf8fj0ttWi0ejRyKPRCMdxSCaTu9jZ2RmGYTxfLpe9Uwq4rntUIBgMomkaoVAIn+8/VETYbDY7jA944fmHyWRyVMBxHKbTKeFwmEAgAMB8Pme9Xv/a5vlEpC8ifeCq1+utF4sFAK1Wi/F4zGq1olarsVwuAWi32wCftnmn3/g9kUg8rVQqGIbBqXU6HZrN5i3wUkTawL1C+hMKhfRCoRCwLAtd15nNZgwGA4bD4QrQORDSQ1LOAlfspfwZeO3dHUn5cPtMIPfYNgK5bbKI4N/yExEHuLlD/MRE5AjzDwd7Br+JNkiZAAAAAElFTkSuQmCC"
    });
    
    dlg.toolbars = [{
        "name": "Game",
        "items": [{
            "name": "tlbutton1",
            "caption": "New",
            "id": "cmd_init_game",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAAXNSR0IArs4c6QAAAv1QTFRFAAB7AAAAAAD/AHsAAP8AMTExOQAAOTkAOTk5Y2NjewAAezkAezk5e3sAe3s5e3t7e3u9lJSUvQAAvTkAvXt7vb29xsbG3t7e/wAA/wD//3sA/3t7/729//8A////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2afaJQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QcBBjcM9dSOiQAAAQVJREFUSMftVUkOwyAMxPkDEhf+/0sr3liSmJpDVfWQoVRInWE8hqQpvfg/QHUAOwoYA9JXBQmMVvoIYwitA+LcRuxY1zJAfDSsFThAirFGiA0IsjXKai2YPWgcIHNZ0rw7gsk+lTRvvyGg3zRo2RZQ75lP302g2bcE2iEL78e+lAQ5GxNRpydozQfms6J3AL2qdFdULq+hRV7cD6HJh2ZucVXgnneGw8CC3AMLvdKihALh84PED92zprtAFcKtct8jB92VDSoHKKGDvAaaAW44XA02MtRayjDYyWCCliDu0jUyvdric5gihw56xFNFdNYPQYfcpJvAc8gd8ITTpZn2/k/+HiecqOXfzHSTpQAAAABJRU5ErkJggg==",
            "handler": dlg.appHandler
        },{
            "caption": "Options",
            "id": "cmd_game_options",
            "icon": "data:image/png;base64,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",
            "handler": dlg.appHandler
        }]
    }];
    
    dlg.toolbars.chain( function() {

        this.setIconSize( "normal" );
        this.setButtonLabels( true );
        this.setTitles( false );

    } );

    
    
    var hTrash = dlg.offsetHeight - dlg.body.offsetHeight + 105;
    var wTrash = dlg.offsetWidth  - dlg.body.offsetWidth + 20;
    var cols   = 0,
        rows   = 0,
        mines  = [],
        bombs  = 0;
    
    var display = dlg.insert(
        new DOMLabel("Bombs Left: 0", {"x": 10})
    ).setAttr(
        "style", "bottom: 10px; left: 10px"
    );
    
    dlg.updateBombs = function() {
        var remaining = bombs;
        for ( var i=0, len=mines.length; i<len; i++ ) {
            if ( mines[i].state == 'flagged' )
                remaining--;
        }
        display.label = "Bombs left: " + remaining;
    }
    
    dlg.body.oncontextmenu = function(e) {
        cancelEvent(e);
    }
    
    Object.defineProperty( dlg, "cols", {
        "get": function() {
            return cols;
        },
        "set": function(_int) {
            cols = _int;
            dlg.width = wTrash + ( _int * 20 );
        }
    } );
    
    Object.defineProperty( dlg, "rows", {
        "get": function() {
            return rows;
        },
        "set": function( _int ) {
            rows = _int;
            dlg.height = hTrash + ( _int * 20 );
        }
    } );
    
    Object.defineProperty( dlg, "mines", {
        "get": function() {
            return cols * rows;
        },
        "set": function( str ) {
            var o;
            if ( o = /^([\d]+)x([\d]+)$/.exec( str ) ) {
                dlg.cols = parseInt( o[1] );
                dlg.rows = parseInt( o[2] );
                dlg.init();
                dlg.center();
            } else throw "Invalid mines string. Requesting: <cols>x<rows>";
        }
    } );
    
    Object.defineProperty( dlg, "bombs", {
        "get": function() {
            return bombs;
        },
        "set": function( _i ) {
            bombs = _i;
            
            var plant = Math.min( bombs, cols * rows ),
                rnd   = 0;
            
            for ( var i=0, len=dlg.mines; i<len; i++ ){
                
                mines[i].value = 'empty';
                mines[i].covered= true;
                
            }
            
            for ( var i=0; i<plant; i++ ) {
                do {
                    rnd = ~~( Math.random() * dlg.mines );
                    //console.log( mines[rnd].value );
                } while ( mines[rnd].value != 'empty' );
                mines[rnd].value = 'bomb';
            }
            
            // Compute numbers
            for ( var i=0, len=mines.length; i<len; i++ ) {     

                // alert( i + '=>' + mines[i].value );

                if ( mines[i].value == 'bomb' ) {
                    continue;
                }

                ( function( mine ) {
                    
                    var neighbourBombs = 0, 
                        ngbrs = mine.neighbours;
                    
                    // console.log( ngbrs );
                    
                    for ( var i=0, len=ngbrs.length; i<len; i++ ) {
                        if ( ngbrs[i].value == 'bomb' )
                            neighbourBombs++;
                    }
                    
                    // console.log( neighbourBombs );
                    
                    mine.value = neighbourBombs == 0 ? 'empty' : neighbourBombs;
                    
                    // console.log( mine );
                    
                } )( mines[i] );
            }
            
            dlg.updateBombs();

        }
    });
    
    dlg.getMineXY = function( x, y ) {
        return mines[ y * cols + x ];
    }
    
    dlg.init = function() {
        // remove existing mines
        for ( var i=0, len=mines.length; i<len; i++ ) {
            mines[i].parentNode.removeChild( mines[i] );
        }
        
        mines = [];
        
        // add other mines
        for ( var y = 0; y<rows; y++ ) {
            for ( var x = 0; x<cols; x++ ) {
                mines.push( 
                    dlg.insert(
                        new JMineSweeper_Mine()
                    ).chain( function() {
                        this.style.left = 10 + x * 20 + "px";
                        this.style.top  = 10 + y * 20 + "px";
                        
                        this.x = ( x );
                        this.y = ( y );
                        
                        this.dlg = dlg;
                    } ) 
                )
            }
        }
        
    }
    
    dlg.mines = '10x10';
    dlg.bombs = 10;
    
    dlg.handlers.game_over = function( mine ) {
        for ( var i=0, len=mines.length; i<len; i++ ) {
            if ( mines[i].value == 'bomb' ) {
                mines[i].covered = false;
            }
        }
        
        if ( mine )
            mine.failed = true;
    }
    
    dlg.handlers.cmd_init_game = function() {
        DialogBox("Start new game?", {
            "buttons": {
                "Yes": function() {
                    dlg.bombs = dlg.bombs;
                },
                "No": function() {
                }
            },
            "childOf": dlg,
            "type": "question",
            "caption": "MineSweeper"
        });
    }
    
    JMineSweeper_cmd_game_options( dlg );
    
    window.ms = dlg;
}