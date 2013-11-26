function JFreeCell() {
    
    var dlg = new Dialog({
        "caption": "FreeCell | JSPlatform",
        "width": 1280,
        "height": getMaxY() - 50,
        "y": 5,
        "minWidth": 1280,
        "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADDElEQVQ4jX2TXWibdRTGf/9/3vdN06ax1q5Luw+2bKLNUpuLDjcpdQ6nHVNRtiHsYgwmiODHQJDpnc7B8JO6KghF3WoNbqwDQdfaizpmi3Xt1I521WpfUuuS9HNr01j7Ju/ZRdPdzQMP51yc58cDhwNw9EmYBkJPw6QBx33w4YOQAg7uhXkg/DD8ZULMgjfy+/eLCADBz8F5BSaHfcibcPOkl4VvQZ73kPoN5BDEu0De0fzbDM4eGATWighKRKgLqYsdh/31zVfS7A2ZdIw5PBby0vP3ErVBk6tTDpFVJn0Jh3CpQc1JZw/wvYhkNUC3TSw2n+O7OFwq8nLWhu5Ck9ZRYWi1SasN/QEP58bh1KQzBwyJSBZYTqCUWv/EI9X2QzV36YmZHJYB2Zxgmh7mMy7FhZrMokuJ36L5bN9wYnphl4iMAxgAIjIWDQfdX62kBo0oA8kuMjObwSwoRCsXj1K4KNKZhQzgki8DQCm1+cTR3frIa29xzf6P5HWbLZEo8b6P2JD7jPFZH0sO+AoUTQUET3cu+wB0voc72y/o3y/HsEZf5szpD+i/MsS2ugbu9uXYtt2hak2Ge3xp6h+gHLBWAIgINev49FLL4zKXuCwiQzKf/FmW64Z8c0yLDFqy2G6J/ZVH4jEtu2tpBEpEZDlBXTUNgfItFAdrgSr8q7fm8QGmsxthwsG7SjN1w2X9OpNNlTy3f4cKKaW0Vkrt2P8oawd6Whlo28kPX+5jwW7JAxRPHWqk5YLAoovhgWQiy3svWIXxpDQC5fq+Cp6NbEDPzaQYGb6GM/MTg+2HGe1+HZwJxnpPMJuGnv4ltIb+P3J4KyC6SVcClmc6TaLrakFFTtyNji/sCYQOcO/Wg/x45lVuDr/PmuIxiooUWkFpQDPwp/B1h3G96Xz2mEAvIoKI0Pz29snZc0iqzRS5WCZTbab0fIy8uJOUFzpDpYwESzi/75mGI4B/xXcbEK2u/2XkC6TvE8RuRZpeQiqhy8g/zZ10eyiL9vqrIgdOVW8u+6c2UpYC3l051f/pFi8Xk94Ib/ELAAAAAElFTkSuQmCC"
    });
    
    dlg.body.style.backgroundColor = 'green';
    
    dlg.toolbars = [{
        "name": "Game",
        "items": [{
            "name": "tlbutton1",
            "caption": "New",
            "id": "cmd_init_game",
            "icon": "data:image/png;base64,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",
            "handler": dlg.appHandler
        } /*, {
            "name": "tlbutton2",
            "caption": "Restart",
            "id": "",
            "icon": "data:image/png;base64,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"
        }, {
            "name": "tlbutton3",
            "caption": "Save",
            "id": "",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAB3RJTUUH2AMIBAkpJNTtJAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAARnQU1BAACxjwv8YQUAAAU1SURBVHja1ZpfaBxFHMd/115yd7nkNmka7DXNRXMXMdGjaGmFig8Kavtgqb4IlZKI4ItgC0Zb8NEHC9oHFXzwqTUqCOKf9iFYBJFCQQsRS9uQVFqq0ChH0vyxSe5ud8eZ2Z3d3+zd7u3d7V28H2xuZ36zs5/v/H4z+ycL0OIWYn8IIRA6dPoM3R3bbCAfdpace3M8FArZAuD5Dzj89MevQH+fQgVRUYYy/ivK0j7hLVAZ/8rHQY0+8xSWb2l5FQ6cnOQi4PzEOBZABPw7P+bg+9l/YfnSdch/e4i7Hz31SzBjR4xhMH50tG8OD68zBufi8T2gKAmIvHAOlP2j8PRQBxx7vAeWV1bhIBNxfoKzh0XfDP70pUX47e88pJQ2uBG1XHD84EMBsBMOqhMDlJXFxtlRndWOWpRyMJ4/FooweWUFXs4mpH7D9gkA5hYKMKAYVX/FtlqNxnYrdcOzTdeJBcoAiS5E6FJZN+u4AMohmOZX1ZK+bQF0G6RKhU3HwhCE1QrPyoaAsMQl5kWJAOYZSNjFaMSOwMzMTF3weBOwRv47xJh1rDw8PGxxYC5jmrtEINVtK4122AeNjIw0deQJngOUA3O5RoA5UihUsTpSKAh4kUKMA3NtqLp7BHCoImgVqiaF6kkbfEwmk7E4MNfcYsFdwM5OJKDdngN+UyiokRftBEcScc0uuAmg7ddReDRdr8TbUHhxpWccmMsxBeQIrBVtt4b4K6VQUGljC6MplM5YHJgL3CcxoUptL0ER8EqhRow8K4sUIiURcFlGma3jCKgEKlkj4cWVmHFgLs9lFEdA0+39cinUiLQBtJ9Opy0OKTPATQCPgB0qXXNPoUaPPLEGwuDAXO4CHBHQ9fIp1Cx4MQd0ZwRcUwjYbEfLqFaaQo1OG9x2SKQQ5cBcW7eEfM4BJIClUDNHXvQnODBXZ5ubACBSruEL2WbAixTmFzLEFW/b4jGJCwjaVF1UVZibnW1K2ohjGXw2+4jFIXHF3G6naf29gv3Eo6kafHd5Hg7vTdJ78weBvQRo1sjHO2Kwa1c/Pz/jwFwE2lwE8AholuOB/gS89flV3vmL+3ZCs+2bX+/AiS+uQSbVI3G5LqPMs4aU7snu4Okz8dkVvm2GDQ10cw7M5bmM3kNKmWUfTvJtM83J5H0hczT+P5pHBIgUqlYx+UrcEhHwWEb9CPjzxj9wN7fSFNievgSkhu+TBTjayBHIV06h3J278NFre+GlJwcDA/3q4m1449PLMDjab9Ut0UFi59qe6vUnAHxGQKNPRww+n88HJuDwvh3w+if0ahttt+q6B7bD4vxyCZP33agPAar5nLCxYQg4duZ3+Gl6Xmrz1GNJ+HB8d1UiWL/O85er83wi87MKqarRplAwXm98/fNtiG7rglhvFy+vL6zyuvePVPc2j/XrPH+5Oo85QPylkGa0KRSLVjmc3AZF0SHd13JLlt+vsX6c5y9X5/lu1FcKmbe2N2/essoload1wu/X3PqpKoWKWuWXWeJBIxJpt8rO41id8Ps1t34qMUkRqMbi8Xhd/lrNMwLVmKIodflrFuAo1/wOvVtJ1OWvWUBQEYhGo3X5axbgKEvL6HOjffDD9ZyvjsLhcF3+wAWwfyKfeDbDG1zwKUJY8Vp1S2attj/d63o3evbAycmxqVNH4e1nMlzmhRl/ItSpV5sGP/7E/UDya1J9ybcSU+8dhc6uLvMVR+knBiA+CXD1me+RHD4xcCU+qx+C2jiOFcdR+LF3v+QDLn1qIMLSIh98SB97tLz9Bxvb+EmBWmPhAAAAAElFTkSuQmCC"
        }, {
            "name": "tlbutton4",
            "caption": "Load",
            "id": "",
            "icon": "data:image/png;base64,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"
        }*/]
    }  ];
    
    dlg.toolbars.chain( function() {

        this.setIconSize( "normal" );
        this.setButtonLabels( true );
        this.setTitles( false );

    } );
    
    dlg.cards = [
        { "value": 1,  "type" : "c" }, { "value": 2,  "type" : "c" }, { "value": 3,  "type" : "c" },
        { "value": 4,  "type" : "c" }, { "value": 5,  "type" : "c" }, { "value": 6,  "type" : "c" },
        { "value": 7,  "type" : "c" }, { "value": 8,  "type" : "c" }, { "value": 9,  "type" : "c" },
        { "value": 10, "type" : "c" }, { "value": 12, "type" : "c" }, { "value": 13, "type" : "c" },
        { "value": 14, "type" : "c" }, { "value": 1,  "type" : "d" }, { "value": 2,  "type" : "d" },
        { "value": 3,  "type" : "d" }, { "value": 4,  "type" : "d" }, { "value": 5,  "type" : "d" },
        { "value": 6,  "type" : "d" }, { "value": 7,  "type" : "d" }, { "value": 8,  "type" : "d" },
        { "value": 9,  "type" : "d" }, { "value": 10, "type" : "d" }, { "value": 12, "type" : "d" },
        { "value": 13, "type" : "d" }, { "value": 14, "type" : "d" }, { "value": 1,  "type" : "h" },
        { "value": 2,  "type" : "h" }, { "value": 3,  "type" : "h" }, { "value": 4,  "type" : "h" },
        { "value": 5,  "type" : "h" }, { "value": 6,  "type" : "h" }, { "value": 7,  "type" : "h" },
        { "value": 8,  "type" : "h" }, { "value": 9,  "type" : "h" }, { "value": 10, "type" : "h" },
        { "value": 12, "type" : "h" }, { "value": 13, "type" : "h" }, { "value": 14, "type" : "h" },
        { "value": 1,  "type" : "s" }, { "value": 2,  "type" : "s" }, { "value": 3,  "type" : "s" },
        { "value": 4,  "type" : "s" }, { "value": 5,  "type" : "s" }, { "value": 6,  "type" : "s" },
        { "value": 7,  "type" : "s" }, { "value": 8,  "type" : "s" }, { "value": 9,  "type" : "s" },
        { "value": 10, "type" : "s" }, { "value": 12, "type" : "s" }, { "value": 13, "type" : "s" },
        { "value": 14, "type" : "s" }
    ];
    
    Object.defineProperty( dlg, "freeCells", {
        
        "get": function() {
            var ret = 0;
            
            for ( var i=0, len=dlg.decks.cells.length; i<len; i++ ) {
                if ( dlg.decks.cells[i].cards.length == 0 )
                    ret++;
            }
            
            return ret;
        }
        
    } );
    
    dlg.decks = {
    
        "cells": [
            dlg.insert(
                new Game_Stack({ "stackMethod": "none", "stackPadding": 0, "moveable": true })
            ).setAttr('style', 'top: 10px; left: 10px;'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "none", "stackPadding": 0, "moveable": true })
            ).setAttr('style', 'top: 10px; left: 158px;'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "none", "stackPadding": 0, "moveable": true })
            ).setAttr('style', 'top: 10px; left: 306px;'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "none", "stackPadding": 0, "moveable": true })
            ).setAttr('style', 'top: 10px; left: 454px;')
        ].chain( function() {
            
            for ( var i=0, len=this.length; i<len; i++ ) {
                ( function( cell ) {
                    
                    cell.canAcceptCard = function( card ) {
                        return cell.cards.length == 0 && !card.nextCard;
                    };
                    
                    cell.canMoveCard = function( card ) {
                        return true;
                    }
                    
                    cell.addCustomEventListener( 'pull-up', function(card) {
                    
                        if ( card.nextCard )
                            return true;
                    
                        for ( var i=0, len=dlg.decks.foundations.length; i<len; i++ ) {
                            if ( dlg.decks.foundations[i].canAcceptCard( card ) ) {
                                dlg.decks.foundations[i].add( card );
                                break;
                            }
                        }
                        
                        return true;
                    } );
                    
                })( this[i] );
            }
            
        } ),
        
        "foundations": [
            dlg.insert(
                new Game_Stack({ "stackMethod": "both", "stackPadding": 0.3 })
            ).setAttr('style', 'top: 10px; right: 10px;'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "both", "stackPadding": 0.3 })
            ).setAttr('style', 'top: 10px; right: 158px;'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "both", "stackPadding": 0.3 })
            ).setAttr('style', 'top: 10px; right: 306px;'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "both", "stackPadding": 0.3 })
            ).setAttr('style', 'top: 10px; right: 454px;')
        ].chain( function() {
            
            for ( var i=0, len=this.length; i<len; i++ ) {

                ( function( foundation ) {
                    
                    foundation.canAcceptCard = function( card ) {
                        if ( foundation.cards.length == 0 ) {
                            return card.value == 1;
                        } else {
                            
                            return foundation.cards.last().sign == card.sign &&
                                   foundation.cards.last().value + 1 == card.value;
                            
                        }
                    }
                    
                })( this[i] );
            }
            
        } ),
        
        "columns": [
            dlg.insert(
                new Game_Stack({ "stackMethod": "y", "stackPadding": 20, "moveable": true })
            ).setAttr('style', 'top: 220px; left: 10px; height: auto; bottom: 10px'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "y", "stackPadding": 20, "moveable": true })
            ).setAttr('style', 'top: 220px; left: 10px; height: auto; bottom: 10px'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "y", "stackPadding": 20, "moveable": true })
            ).setAttr('style', 'top: 220px; left: 10px; height: auto; bottom: 10px'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "y", "stackPadding": 20, "moveable": true })
            ).setAttr('style', 'top: 220px; left: 10px; height: auto; bottom: 10px'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "y", "stackPadding": 20, "moveable": true })
            ).setAttr('style', 'top: 220px; left: 10px; height: auto; bottom: 10px'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "y", "stackPadding": 20, "moveable": true })
            ).setAttr('style', 'top: 220px; left: 10px; height: auto; bottom: 10px'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "y", "stackPadding": 20, "moveable": true })
            ).setAttr('style', 'top: 220px; left: 10px; height: auto; bottom: 10px'),
            dlg.insert(
                new Game_Stack({ "stackMethod": "y", "stackPadding": 20, "moveable": true })
            ).setAttr('style', 'top: 220px; left: 10px; height: auto; bottom: 10px')
        ].chain( function() {
            
            for ( var i=0, len=this.length; i<len; i++ ) {
                ( function( column, columnIndex ) {
                    
                    column.canMoveCard = function( card ){
                        var cursor   = card.nextCard,
                            prevCard = card,
                            cardsQueue = 1;
                        
                        while ( cursor ) {
                        
                            cardsQueue++;
                        
                            if ( cursor.color == prevCard.color )
                                return false;
                            
                            if ( cursor.value +1 != prevCard.value )
                                return false;
                            
                            prevCard = cursor;
                            cursor = cursor.nextCard;
                        }
                        
                        if ( cardsQueue > dlg.freeCells + 1 ) {
                            DialogBox("Not enough free cells to do this operation. You need at least " + ( cardsQueue - dlg.freeCells ) + " free cells.", {
                                "type": "error",
                                "childOf": dlg,
                                "modal": true
                            });
                            return false;
                        }
                        
                        
                        
                        return true;
                    }
                    
                    column.canAcceptCard = function( card ) {
                        
                        console.log( "Column: ", columnIndex, ". Can accept: ", card.color, card.value);
                        
                        if ( column.cards.length == 0 )
                            return true;
                        else {
                        
                            console.log( "Can place over a: ", column.cards.last().color, column.cards.last().value, " a ", card.color, card.value );
                        
                            var ret =
                                   column.cards.last().color != card.color &&
                                   ( column.cards.last().value - 1 ) == card.value;
                            
                            console.log( ret );
                            return ret;
                        }
                    }
                    
                    column.addCustomEventListener( 'pull-up', function( card ) {
                        
                        if ( card.nextCard )
                            return true;
                        
                        for ( var i=0, len=dlg.decks.foundations.length; i<len; i++ ) {
                            if ( dlg.decks.foundations[i].canAcceptCard( card ) ) {
                                dlg.decks.foundations[i].add( card );
                                break;
                            }
                        }
                        
                        return true;
                        
                    } );
                    
                } )( this[i], i );
            }
            
        } )
    
        /*
        "initial": dlg.insert(
            new Game_Stack( { "stackMethod": "both", "stackPadding": .3 } )
        ).setAttr("style", "top: 10px; left: 10px;").chain( function() {
            
            this.addCustomEventListener( 'card-clicked', function( card ) {
                dlg.decks.rotator.add( card );

                dlg.decks.rotator.repaint();
                
                card.flipped = true;
                
                return true;
            } );
            
        } ).addClass( 'final restart' ).chain( function() {
            
            this.addEventListener( 'click', function() {
                
                if ( dlg.decks.initial.cards.length == 0 && dlg.decks.rotator.cards.length > 0 ) {
                    
                    while( dlg.decks.rotator.cards.length ) {
                        
                        dlg.decks.initial.add( dlg.decks.rotator.cards.last().chain( function() {
                            
                            this.flipped = false;
                            
                        } ) );
                        
                    }
                    
                }
                
            }, false);
            
        } ),
        
        "rotator": dlg.insert(
            new Game_Stack( { "stackMethod": "x", "stackPadding": 5, "moveable": true } )
        ).setAttr("style", "top: 10px; left: 180px; right: 635px; width: auto;").addClass('final').chain( function() {

            this.canMoveCard = function( card ) {
                return card == dlg.decks.rotator.cards.last();
            }

            this.addCustomEventListener( 'pull-up', function( card ) {
                
                if ( card == this.cards.last() ) {
                
                    for ( var i=0; i<4; i++ ) {
                        
                        if ( dlg.decks.final[i].canAcceptCard( card ) ) {
                            
                            dlg.decks.final[i].add( card );
                            
                            return true;
                        }
                        
                    }
                
                }
                
                return true;
                
            } );
            
        } ),
        
        "final": [
            
            dlg.insert(
                new Game_Stack({ "moveable": true })
            ).setAttr("style", "top: 10px; right: 10px;").addClass('final'),
            
            dlg.insert(
                new Game_Stack({ "moveable": true })
            ).setAttr("style", "top: 10px; right: 160px").addClass('final'),
            
            dlg.insert(
                new Game_Stack({ "moveable": true })
            ).setAttr("style", "top: 10px; right: 310px").addClass('final'),
            
            dlg.insert(
                new Game_Stack({ "moveable": true })
            ).setAttr("style", "top: 10px; right: 460px").addClass('final')
            
        ].chain( function() {
            
            for ( var i=0, len=this.length; i<len; i++ ) {

                this[i].chain( function() {
                    
                    this.canMoveCard = function( card ) {
                        return card == this.cards.last();
                    };
                    
                    this.canAcceptCard = function( card ) {
                        if ( this.cards.length == 0 ) {
                            return card.value == 1;
                        } else {
                            return card.sign == this.cards.last().sign &&
                                   card.value == this.cards.last().value + 1;
                        }
                    }
                    
                } );
                
            }
            
        } ),
        
        "transitional": [
            dlg.insert(
                new Game_Stack( { "stackMethod": "y", "stackPadding": 20, "moveable": true } )
            ).setAttr("style", "top: 220px; left: 10px; bottom: 10px;"),
            
            dlg.insert(
                new Game_Stack( { "stackMethod": "y", "stackPadding": 20, "moveable": true } )
            ).setAttr("style", "top: 220px; left: 160px; bottom: 10px;"),
            
            dlg.insert(
                new Game_Stack( { "stackMethod": "y", "stackPadding": 20, "moveable": true } )
            ).setAttr("style", "top: 220px; left: 310px; bottom: 10px;"),
            
            dlg.insert(
                new Game_Stack( { "stackMethod": "y", "stackPadding": 20, "moveable": true } )
            ).setAttr("style", "top: 220px; left: 460px; bottom: 10px;"),

            dlg.insert(
                new Game_Stack( { "stackMethod": "y", "stackPadding": 20, "moveable": true } )
            ).setAttr("style", "top: 220px; left: 610px; bottom: 10px;"),
            
            dlg.insert(
                new Game_Stack( { "stackMethod": "y", "stackPadding": 20, "moveable": true } )
            ).setAttr("style", "top: 220px; left: 760px; bottom: 10px;"),

            dlg.insert(
                new Game_Stack( { "stackMethod": "y", "stackPadding": 20, "moveable": true } )
            ).setAttr("style", "top: 220px; left: 910px; bottom: 10px;")
        ].chain( function() {
            
            for ( var i=0, len=this.length; i<len; i++ ) {
                
                this[i].chain( function() {
                    
                    this.canMoveCard = function( card ) {
                        
                        //console.log( "Canmovecard: ", this.cards.length );
                        
                        if ( !card.flipped ) {
                            // console.log( "Cannot move: card not flipped");
                            return false;
                        }
                        
                        if ( card == this.cards.last() )
                            return true;
                        
                        var cursor = card.nextCard,
                            value  = card.value,
                            color  = card.color;
                        
                        console.log( "My next card: ", cursor );
                        
                        while ( cursor ) {
                            
                            if ( color == cursor.color ) {
                                console.log( "same color" );
                                return false;
                            }
                            
                            if ( value != cursor.value + 1 ) {
                                console.log( "bad value" );
                                return false;
                            }
                            
                            value = cursor.value;
                            color = cursor.color;
                            
                            cursor = cursor.nextCard;
                        }
                    
                        return true;
                    }
                    
                    this.canAcceptCard = function( card ) {
                        
                        if ( this.cards.length == 0 )
                            return true;
                        
                        var lastCard = this.cards.last();
                        
                        if ( !lastCard.flipped || lastCard.color == card.color || lastCard.value != card.value + 1 )
                            return false;
                        
                        return true;
                    }
                    
                    this.addCustomEventListener( 'card-clicked', function( card ) {
                        
                        if ( card == this.cards.last() && !card.flipped ) {
                            card.flipped = true;
                        }
                        
                        //console.log( "Card clicked: ", card );
                        
                        return true;
                        
                    } );
                    
                    this.addCustomEventListener( 'pull-up', function( card ) {
                        
                        if ( card == this.cards.last() ) {
                        
                            for ( var i=0; i<4; i++ ) {
                                
                                if ( dlg.decks.final[i].canAcceptCard( card ) ) {
                                    
                                    dlg.decks.final[i].add( card );
                                    
                                    return true;
                                }
                                
                            }
                        
                        }
                        
                        return true;
                        
                    } );
                    
                } );
                
            }
            
        })
        */
    }
    
    dlg.addCustomEventListener( 'paint', function( ) {
    
        var ColWidth = dlg.decks.columns[0].offsetWidth;
        
        var diff     = ( ( dlg.body.offsetWidth - ( ColWidth ) * ( dlg.decks.columns.length ) - 20 ) / ( dlg.decks.columns.length + 1 ) ) >> 0;
        
        for ( var i=0, len=dlg.decks.columns.length; i<len; i++ ) {
            dlg.decks.columns[i].style.left =  20 + ( ( diff + ColWidth )  * i ) + "px";
        }
    
        return true;
    } );
    
    dlg.isGameWon = function( force ) {
        if ( dlg.decks.foundations[0].cards.length +
             dlg.decks.foundations[1].cards.length +
             dlg.decks.foundations[2].cards.length +
             dlg.decks.foundations[3].cards.length == 52
             
             ||
             
             force
        ) {
            
            DialogBox("Congratulations, you won", {
                
                "childOf": dlg,
                "caption": "FreeCell",
                "modal": true,
                "buttons": {
                    "New Game": function() {
                        dlg.appHandler('cmd_init_game', true);
                    },
                    "Quit Solitaire": function() {
                        dlg.close();
                    }
                }
                
            } );
            
        };

        return false;
    };
    
    dlg.closeCallback = function() {
        setTimeout( function() {
            dlg.purge();
        }, 10);
        return true;
    }
    
    
    dlg.onCustomEvent('paint');
    
    JFreeCell_cmd_init_game( dlg );
    dlg.appHandler( 'cmd_init_game', true );
    
    return dlg;
    
}