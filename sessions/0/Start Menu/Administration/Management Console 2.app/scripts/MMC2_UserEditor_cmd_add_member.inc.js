function MMC2_UserEditor_cmd_add_member( app ) {

    app.addCss([
        '.members-list > .member { display: inline-block !important; width: auto !important; height: 16px !important; background-color: white; padding: 2px 2px 2px 20px !important; border-radius: 3px !important; margin: 3px !important; background-position: 2px 2px; background-repeat: no-repeat; cursor: default; white-space: nowrap; }',
        '.members-list > .member { background-image: url(data:image/gif;base64,R0lGODlhEAAQAPcAAKRng457rjw8i0VFfb+/3pyco3p6f3p6fa6usLe3uH9/gDg6kCwxoVFXm4iNuV5lihs2o4GOwCVHpMLO8oaj6wZAxRdQyYeYvKe86JS8+xZh1KzH7pG57Rxu0xZsyR2E8hF12hJ12mu2/3S6/xB52hF52ySX/yWX/224/3S7/3K0733A/3qlzp7Q/7bc/8Th+y2e/y6f/zSi/zWj/1+2/7Xd/8Pj/9Dr/0at9aPZ/8bn/9bu/zZ6pmDB/8Xo/069/9Tw/9b2/3ivoSFjPcr92RqgKL3yvjaINjqBOjdZN050TmmTacHNwcvTy/v8+9PU046PjjKDL1mXUnKpahyrANP3yyrOAi1pHmG8SDHOA6npl9Puyz23DXi6YGG7OGDnF5/ef7PvksDzpmrOK5XjZHbWMtnpzKjShJGzZ3eSGf//8f/+693bv//znpKNcJp6Dv/hge/grv/wvf/st9++bcWMD//GRndTCPzGVPzHWP/NatmeL+yqNfGxOvGyPv3FXv/Zl8J/DP/Qf7KGRMehZ593QbZlAraOW+nf1NFrDbyQZrxWAMmlh+Ghcv/Yu9OXcv/Qsselj//Gp6M4ALJ5XfjCpvjDqf3ayP69nvW6n/3HrsqrnPq2m8SPefrIs+SdhP+6of/JtfvNu7yflPqVcv/i2NhpStt1WO6plaxrW7tuXv+/scFYRLRyabejoOWEe/mWjbwNA81+et6CgtqUlI1mZuPKys26uvLl5ejj4/j19f////v7+/f39+/v7+3t7eXl5dnZ2dbW1tLS0sXFxbm5ubW1tZ+fn5ycnJmZmZeXl5OTk4GBgf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAM0ALAAAAAAQABAAAAj/AJs10zXqEKFCx3oJXMhwEyNEcegMesKQIa5HctbMgWOnFi1Yr24xtNWoDSBBf/iwmrUKVStXC3MpwqMnT59EoHbtUgNJVbCFbur42RNokahSlzw5irSsmRMmUtIYmnTnTaZQmixJ6oSsWZMpRohQioXmzCdOlTCRSgWs2ZIuYqqYYbOFRQBZp0wBaICgGRIvZMCE0SKEwgQCDiJg2HCBWBIuX8aUwcIjw40dL2wACcLhAZQrVKxkKeJhRYsaPnS4yKFCwq9kSo5EGVLhBw0UKUaI6IEDgkBfxIoVWPDBRIwZMmCc6DCgYrMEDDSAKEEihAUBxpzzGqZMgYEDzI4JA2sWEAA7); } ',
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
            "entityId"   : parseInt( app.groups.value )
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
        
        for ( var i=0,items=app.groupsList.querySelectorAll('div.member'), len=items.length; i<len; i++ ) {
            if ( items[i].entityId == member.entityId ) {
                return;
            }
        }
        
        // Create a new member and append it to the app.membersList
        app.groupsList.appendChild(
            new app.createMember( member )
        );
    }
}