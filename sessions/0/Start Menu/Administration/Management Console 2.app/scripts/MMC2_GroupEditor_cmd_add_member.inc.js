function MMC2_GroupEditor_cmd_add_member( app ) {

    app.addCss([
        '.members-list > .member { display: inline-block !important; width: auto !important; height: 16px !important; background-color: white; padding: 2px 2px 2px 20px !important; border-radius: 3px !important; margin: 3px !important; background-position: 2px 2px; background-repeat: no-repeat; cursor: default; white-space: nowrap; }',
        '.members-list > .member { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACv0lEQVR42p2Sa0iTURzGn3fb++6mbnNT826myzQyirwmJWEkhEKxChKM0g8qQvWhJCqIILIP+aHUD0okGURSkRGVFBnewooocnkpm640HWOXdJf33fZ2toVN65MH/nB4nnN+5385FP5dIhJHaEZ8WBIWkekXXAt2Pce6b5PtTRKe0MPUissxIprpTkjbkLNOm4FIlTIgmi1WTI6P4vuXz8Meji0j0tz/ALRQRA/Erl2/TSaXg6KWs3meh2NxEbPfxt54PVwhkbiVgJoIdXQLI5EtE7VJGjQey0P99V4YTQtgXQ7YzfO1xGpdBiAvDkrDFfkUkeRSBnnZaThYmg9dyWbQvAvGKQOONz1Cz9tpLNqtQySjglBApTYltu2sLp0uLc5FZLwWAlkUKUoWdDkH4JwH7EY8eNaPhluj3Lhhtpo4HX6AXLcj3bS/MF66e0sCVIlZQEQSINUAAjoI8LIEYCKAaViMI+h5P4N7Az+cXa8movwAZe2eZHP9gXxBskYM6RoyufAEQEIAQvEfgDsI+GWE86ceU2YO1+4O+VqeTqkDJTAi6uqZfSknqvdmI06bA4TFkQzU5EdI/5bgMgMLM5gZG0bb44+4dN/QxHr4k6ENz6sqSeptO18hhjKVUBUEIAk6HhfgtgK2SVRf6HS3PzfuJOrrlWNMFIhlT+5cLM/SFW8FVGkhPSAjt06g6+U7HDrXPeJzO0qJagwFFEk2Fj2MqmpUZUg4dOaaoXKOQQBvwPRBCItEi4phDUZdNEztpy2uT33lxOrzAxKZzO0f1DXNKkooBM+xuLErGhYHi1OD5gDgSoEaKhmDoy/mQdEMeK8X5tY6C6vvz6YgELUoGrprhMqYpVoUIh/sLA9eIAx+Mp8XEQwFm0ewdMZrnYPtclkrRSVu+iqubE7FKpa7o26SQpjagNhMxWoAmNXbfgP9tPsNjXnSyQAAAABJRU5ErkJggg==); } ',
        '.members-list > .member.selected { background-color: #ec723f; -webkit-user-select: none; }'
    ].join('\n'));

    app.createMember = function( memberInfo ) {
        memberInfo = memberInfo || {};
        var holder = $('div', 'member');

        (function() {
            var entityId   = 0;
            
            Object.defineProperty( holder, "entityId", {
                "get": function() {
                    return entityId;
                },
                "set": function( intVal ) {
                    entityId = intVal;
                }
            });
            
        })();
        
        holder.addContextMenu([
            {
                "caption": "Remove from list",
                "handler": function(){
                    holder.parentNode.removeChild( holder );
                    holder.purge();
                },
                "icon": "img/mmc2/deny.png"
            }
        ])
        
        holder.entityId   = memberInfo.entityId   || 0;
        
        holder.appendChild( $text( memberInfo.name ) );
        
        holder.addEventListener('click', function(e) {
            e.ctrlKey 
                ? ( holder.hasClass('selected') ? holder.removeClass('selected') : holder.addClass('selected') )
                : (function() {
                    for ( var i=0,items=holder.parentNode.querySelectorAll('.member.selected'),len=items.length; i<len; i++ ) {
                        items[i].removeClass('selected');
                    }
                    holder.addClass('selected');
                })()
        } );
        
        holder.toObject = function() {
            return holder.entityId;
        }
        
        return holder;
    }

    app.handlers.cmd_add_member = function() {
        var member = {
            "entityId"   : parseInt( app.users.value )
        };
        
        // determine member's name
        member.name = (function(){
            for ( var i=0,len=app.entities.length; i<len; i++ )
                if ( app.entities[i].id == member.entityId ) {
                    return app.entities[i].name;
                    break;
                }
            return 'unknown';
        })();

        
        /* Loop to existing members in order to see if there is another
           member with the same id. If it is added, we do nothing */
        
        for ( var i=0,items=app.usersList.querySelectorAll('div.member'), len=items.length; i<len; i++ ) {
            if ( items[i].entityId == member.entityId ) {
                return;
            }
        }
        
        // Create a new member and append it to the app.membersList
        app.usersList.appendChild(
            new app.createMember( member )
        );
    }
}