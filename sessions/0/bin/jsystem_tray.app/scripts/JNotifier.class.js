function JNotifier() {
    var holder = $('div');
    
    disableSelection(holder);
    
    holder.id = 'jTaskbarNotifier';
    
    var icons = [];
    
    holder.addNotification = function( settings 
        /**
         *
         * {
         *    "views": {
         *          "<view_name>": "<icon_path_or_resource>"
         *    },
         *    "defaultView": "<a_view_name>",
         *    "name": "<string>",
         * }
         *
         **/
    ) {
        var icon = $('div');
        
        icon.addEventListener('mouseover', function() {
            icon.style.backgroundColor = 'transparent';
        }, true);
        
        icon.settings = settings || {};
        
        if (typeof icon.settings.name == 'undefined')
            throw "JNotifier.addNotification: Missing notification .name property!";
        
        var tmp = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAewQAAHsEBw2lUUwAAAAd0SU1FB9sIHg0wLNHd5GIAAAMdSURBVDjLXZNLTJxVAEbP/Z/3f8wMM4wUbEutNbHEYEzUVmNFlyq0Nd3W+oorTUzqqpFo2LA1Ltxru3LhAiW2qSXRRAhWqQZBOii2yqMwzjDMMM//MXNdNBL1rL7N+XZH8C+KO2U1k5vmky8/ZfnXTRwSIKDZCjnce5BXTp3h2ePH6cl2iX+cvZFbXVHvTbxLLr/I2Sde4/nB5+hL9yGAfLnA1Nw0lya+4IDbz/j58wwefWDPZen2ijo2+qQ6c3FYzRanVVPV1f8JVF3d2LmuXvrwTfXQi6fVz7kVBaAXSmV14dIoZW+L14ffIGNmaYUBnU4HhSLshFTCCluNAo1Ok/0DCX7JL/L1lQW+vXJ1zJjNzfHZ/AQPn+inUNvG6khiJ0ahqLfrAASdgJ3WDvlmns2gRNiXZ/qbm1z77hR6cMga2zR/5462RibZTdbJErdjwk5II25QjauUWiUKzQLbwTY3tn5kauUqrinJLyn06EExFh2uUnEqrEV/ogkNXRgEUYvd6K5cbBRZb6zzQ/E6lzcmKasaXtKitmhhNKw6UaqFZWp0jICZ8hSr8TL7ZT8JIwVALa5yJ1hlrbZKpLewkzphFGDaIYaQEaZj4muStEzi2iaBWWFdLGFiANDWYgIzJum52IZFOaiiDB0lBIZraWhmgqYZ40ubhHTwpI20bAxdu3vQ7tCKQupGQFU0CbUWVquLMLIwBtKD3Nq9iXWfj6vb+K5DwrZxpcQ2TEARtts0AgNNCNpKEcsAfa2HexP9aOeOvcruvEHGTmM7Oq5p4zsOKdcl47lkfJ+U4+DbEseysaVGt5Wh9r3L2ZFhtKGBp3hMPk00u4900sdyFdIw8GxJyvNIez6+dJCWiSUF6S4X5g5yP0d5YegExr5st1hY/k29fOF9qpak53SIlwJpg+eYCCDQwLM0OpUkf1w2KV2z+Xj8bQ703SP2gljIrajRDz7iVrzMIyeTHHlckshoCAHVkuL2T03mJ3fpDY8w/s5bPDo4IP5TI0D+r5L6amaWi59PsrG7gekr0CCuCrJOD+dOjjDyzBB9vd173t8JY2MdKCJYmwAAAABJRU5ErkJggg==";
        
        icon.settings.views = settings.views || {
            "default"  : tmp,
            "active"   : tmp,
            "inactive" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAewQAAHsEBw2lUUwAAAAd0SU1FB9sIHg0xAPoeucAAAAKuSURBVDjLXZO/T8JaGIaf00NLW4olKgR1dXFhc3AydnLzx1/hbnQ2jrL7B7hrnDVxMUQTR0IgGoIKLg6tQoFiKecONzbX+yUn+fImz3u+L+e8gv+U7/uqXq9zfX3N8/MzUkqEEERRxPLyMvv7+2xsbLC4uCh+mbTpdDrq4uKCXq+H53msr6+zsLAAQBAEPD4+cnl5ieu6HB0dsba2lrK02211cHCgzs7O1Nvbm0qSRP2/kiRRHx8f6vT0VG1vb6tms6kApO/76vz8HCkle3t7WJbFZDJBKQVAkiREUUS/32c6nbK6ukq32+X29pabm5sTrV6v8/DwgK7r9Pt9giBgNBoxGo0Iw5AwDNPe932CIMB1XRqNBrVaDVkqlU7iOGYymVAoFMjn8yRJwnQ65VcfDoep0evrK/V6HcMwaLfbyJWVlZNSqYSmaYRhiBACTdOI45goihgOhwwGA76/v3l/f6fZbBLHMY7j0Ol0yAghsCwLACkl3W6XMAyZm5vDMAwAfn5+GAwGBEGAEIJcLodSCiklGcMwME0TANu2MU0TIQTj8Zg4jgGYzWYIIXAcB13XGY/HqfbHwLKs9BiGgZQyfYnflTRNS7XZbEamXC4TRRGlUgld17FtG8uyME0TXdcBmE6nRFGEEOJfKJOh1+sxPz+P5nkeLy8v6fjZbBbLssjlcjiOQz6fT01/p7Vtm1arxc7ODlqlUqFYLNJqtXBdN73ZNE0cx8FxnD+w67q0221s22Zra4tMsVgUrVZLHR4eks1m2dzcZG5uDtM0yeVy6Xf/DVatVuPp6YlqtcrS0pJIA9FsNlW1WmUwGOB5HpVKhUKhgBCCr68vGo0Gd3d3SCk5Pj6mUqmIP2kE+Pz8VPf391xdXeH7PpZloWkao9EIx3HY3d3F8zzK5XLK/QOXaFl84ad/dAAAAABJRU5ErkJggg=="
        };
        
        var _viewName = '_default_';
        
        icon.setViewName = function( viewName ) {
            icon.style.backgroundColor = 'green';
            
            setTimeout(function() {
                if (typeof icon.settings.views[ viewName ] == 'undefined' ) {
                    _viewName = '_default_';
                    icon.style.backgroundImage = 'url(' + tmp + ')';
                } else {
                    _viewName = viewName;
                    icon.style.backgroundImage = 'url(' + icon.settings.views[ viewName ] + ')';
                }
                
                icon.style.backgroundColor = 'transparent';
                
            }, 500);
        };
        
        Object.defineProperty( icon, 'viewName', {
            'get': function() {
                return _viewName;
            },
            'set': icon.setViewName
        });
        
        icon.setViewName( icon.settings.defaultView || '' );
        
        icons.push( holder.insertBefore( icon, holder.firstChild ) );
        
        if (icon.settings.title)
            icon.title = icon.settings.title;
        
        icon.close = function() {
            for ( var i=0, len=icons.length; i<len; i++ ) {
                if ( icons[i] == icon ) {
                    icons.splice(i,1);
                    break;
                }
            }
            if ( icon.parentNode )
                icon.parentNode.removeChild( icon );
        }
        
        return icon;
    }
    
    holder.getNotificationByName = function(notificationName) {
        
        for (var i=0; i<icons.length; i++) {
            if (icons[i].settings.name && icons[i].settings.name == notificationName)
                return icons[i];
        }
        
        return null;
    };
    
    document.body.appendChild( holder );
    
    Object.defineProperty(
        window,
        "Notifier",
        {
            'enumerable': false,
            "get": function() {
                return holder;
            }
        }
    );
    
    /* Install clock inside notification area */
    
    var NotificationClock = holder.appendChild($('div', 'NotificationClock'));
    
    Object.defineProperty(
        window,
        'NotificationClock',
        {
            'enumerable': false,
            "get": function() {
                return NotificationClock;
            }
        }
    );
    
    holder.updateClockTick = function() {
        NotificationClock.innerHTML = '';
        
        if (typeof $_SESSION != 'undefined') {
            NotificationClock.appendChild(
                $text((new Date()).toString( $_SESSION.CLOCK_DATETIME_FORMAT || '%H:%i' ))
            );
        } else 
            NotificationClock.appendChild(
                $text((new Date()).toString( '%H:%i' ))
            );
    };
    
    if (typeof $_SESSION != 'undefined'  && !$_SESSION.DATETIME_FORMAT) {
        console.warn("window.NotificationClock: Using default date / time format (%H:%i). Override this thorough $_SESSION.CLOCK_DATETIME_FORMAT");
    }
    
    NotificationClock.title = 'Date / Time';
    
    window.setInterval( holder.updateClockTick, 10000 );
    
    holder.updateClockTick();
    
    /* Install Ajax Notification */
    
    holder.addNotification({
        'name': 'AJAX',
        'views': {
            "loading": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfZJREFUeNqkUr9rE1Ec/7x37y53l1yTQk20QhcF6yAYnLt16NJBzBJwcjHikLVQnFwKThnUSKCTNKODf4Kbdu6SoeBgTQxBSMhdcsmd3+9rLqTlEMEvfHjf933fn5/3FZVKBSxCiH06NvFv8iOO48+sqCiKEuPtZrP5PgzDv0aapolarfYiuavZbJboMggCPHn3FVEmzx3BMAwdkGDdBt7sbYBiZFoCwfpEuniwvZ1anQuwD0EsE6y0LFlnDAYDzOdzhJfOiPmRusmvrdF7xD6pHRgcbCiFgE5BAVY2i2wmA4tgEmyyheEFJzWWCabT6ZUObhUcxJTEdl3YjgPbtmFZFhRx4CHQHVKMTB2B2z7azRNhEkrNiMQxkemDf4o7ZV/6visjiHK5nOhVetxKLvV6/WiVwEajcbAMEuI7HW3dwWg0Qi6X48ztpNJkMnnFtlUZDodERea1ovGklPqbOVZ1Oh14nodSqaSNvV6P/Z1Wq3Xi+/5NfXGcn/1+32G9WCzqMbrdLidN3zSXCDSrBb4eMljXNnq7Luq6IdkF7Gc/4G7hkbbdN7fC9u/nacvFCTYIdwgPCczoPYKHkxEeH1d1gk/PNF+nhDnhfKF/I5zxSnJfPF9uAZeXCi/dp7ghdnSZX/EXvB1/XBT1mdMFxoIJ+R/5I8AAYdrcYy9H+s8AAAAASUVORK5CYII=',
            "idle"   : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAXNSR0IArs4c6QAAAAJiS0dEAP+Hj8y/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wgfCx8MRJ7nEAAAAS1JREFUKM990L1rFVEQBfDf3b37nru8GATxE20sYmkIpLNJHwJiaRmIVpYGgpWNgo2VCbYh+QPSa2Fp6jQWVhENIsgLJube99YiiS4KOdUwc+acMxPuI8y75n98breIY7i++jr9M608fAQxQ3HopUpQqlQqjXty8ZcQMm539g9lOUBMUCTJdyNZRum8JHUUyiRKCo2evr4oySXEoxOFC0qN2jk9USk5KjoWIwsqUSkYy5L21CLB7uIyPH5+HPHVMoRdiPsG2s2x7NfTwckNw17/WVQI9sWPJlwW7FG/2Ti4Qv3lW80lra+G3c815lixMqdR/enH0yJJZteuznDj5tslHcJFt9wxbcrEOy9meMK2kU+2fbATVGoDA41y/sHkXX6831rHgaGhn6F1Nn4D/o5YS5PqqioAAAAASUVORK5CYII='
        },
        'title': 'Transfers'
    }).viewName = 'idle';
    
    return holder;
}