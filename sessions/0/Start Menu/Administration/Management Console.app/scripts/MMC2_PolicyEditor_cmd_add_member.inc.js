function MMC2_PolicyEditor_cmd_add_member( app ) {

    app.addCss([
        '.members-list > .member { display: inline-block !important; width: auto !important; height: 16px !important; background-color: white; padding: 2px 2px 2px 20px !important; border-radius: 3px !important; margin: 3px !important; background-position: 2px 2px; background-repeat: no-repeat; cursor: default; white-space: nowrap; }',
        '.members-list > .member.group.access-0 { background-image: url(data:image/gif;base64,R0lGODlhEAAQAOe7AKRng457rjw8i0VFfb+/3pyco3p6f3p6fa6usLe3uH9/gDg6kCwxoVFXm4iNuV5lihs2o4GOwCVHpMLO8oaj6wZAxRdQyYeYvKe86JS8+xZh1KzH7pG57Rxu0xZsyR2E8hF12hJ12mu2/3S6/xB52hF52ySX/yWX/224/3S7/3K0733A/3qlzp7Q/7bc/8Th+y2e/y6f/zSi/zWj/1+2/7Xd/8Pj/9Dr/0at9aPZ/8bn/9bu/zZ6pmDB/8Xo/069/9Tw/9b2/3ivoSFjPcr92RqgKL3yvjaINjqBOjdZN050TmmTacHNwcvTy/v8+9PU046PjjKDL1mXUnKpahyrANP3yyrOAi1pHmG8SDHOA6npl9Puyz23DXi6YGG7OGDnF5/ef7PvksDzpmrOK5XjZHbWMtnpzKjShJGzZ3eSGf//8f/+693bv//znpKNcJp6Dv/hge/grv/wvf/st9++bcWMD//GRndTCPzGVPzHWP/NatmeL+yqNfGxOvGyPv3FXv/Zl8J/DP/Qf7KGRMehZ593QbZlAraOW+nf1NFrDbyQZrxWAMmlh+Ghcv/Yu9OXcv/Qsselj//Gp6M4ALJ5XfjCpvjDqf3ayP69nvW6n/3HrsqrnPq2m8SPefrIs+SdhP+6of/JtfvNu7yflPqVcv/i2NhpStt1WO6plaxrW7tuXv+/scFYRLRyabejoOWEe/mWjbwNA81+et6CgtqUlI1mZuPKys26uvLl5ejj4/j19f////v7+/f39+/v7+3t7eXl5dnZ2dbW1tLS0sXFxbm5ubW1tZ+fn5ycnJmZmZeXl5OTk4GBgf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAP8ALAAAAAAQABAAAAjyAP/90zXqEKFCx3oJXMhwEyNEcegMesKQIa5HctbMgWOnFi1Yr24xtNWoDSBBf/jsWsly5b9civDoydMn0a5YOHPuEuimjp89gRbdzIlzlxMmUtIYmnTnTcuWTaYYIUIpFpoznzhVwkQqFbB/S7qIqWKGzRYWAWSdMgWgAYJ/SLyQARNGixAKEwg4iIBhwwViSbh8GVMGC48MN3a8sAEkCIcHUK5QsZKliIcVLWr40OEihwoJv5IpORJlSIUfNFCkGCGiBw4IAn0RK1ZgwQcTMWbIgHGiw4CK/xIw0ACiBIkQFgQYA85rmDIFBg4wOybsX0AAOw==); } ',
        '.members-list > .member.group.access-1 { background-image: url(data:image/gif;base64,R0lGODlhEAAQAPcAAKRng457rjw8i0VFfb+/3pyco3p6f3p6fa6usLe3uH9/gDg6kCwxoVFXm4iNuV5lihs2o4GOwCVHpMLO8oaj6wZAxRdQyYeYvKe86JS8+xZh1KzH7pG57Rxu0xZsyR2E8hF12hJ12mu2/3S6/xB52hF52ySX/yWX/224/3S7/3K0733A/3qlzp7Q/7bc/8Th+y2e/y6f/zSi/zWj/1+2/7Xd/8Pj/9Dr/0at9aPZ/8bn/9bu/zZ6pmDB/8Xo/069/9Tw/9b2/3ivoSFjPcr92RqgKL3yvjaINjqBOjdZN050TmmTacHNwcvTy/v8+9PU046PjjKDL1mXUnKpahyrANP3yyrOAi1pHmG8SDHOA6npl9Puyz23DXi6YGG7OGDnF5/ef7PvksDzpmrOK5XjZHbWMtnpzKjShJGzZ3eSGf//8f/+693bv//znpKNcJp6Dv/hge/grv/wvf/st9++bcWMD//GRndTCPzGVPzHWP/NatmeL+yqNfGxOvGyPv3FXv/Zl8J/DP/Qf7KGRMehZ593QbZlAraOW+nf1NFrDbyQZrxWAMmlh+Ghcv/Yu9OXcv/Qsselj//Gp6M4ALJ5XfjCpvjDqf3ayP69nvW6n/3HrsqrnPq2m8SPefrIs+SdhP+6of/JtfvNu7yflPqVcv/i2NhpStt1WO6plaxrW7tuXv+/scFYRLRyabejoOWEe/mWjbwNA81+et6CgtqUlI1mZuPKys26uvLl5ejj4/j19f////v7+/f39+/v7+3t7eXl5dnZ2dbW1tLS0sXFxbm5ubW1tZ+fn5ycnJmZmZeXl5OTk4GBgf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAM0ALAAAAAAQABAAAAj/AJs10zXqEKFCx3oJXMhwEyNEcegMesKQIa5HctbMgWOnFi1Yr24xtNWoDSBBf/iwmrUKVStXC3MpwqMnT59EoHbtUgNJVbCFbur42RNokahSlzw5irSsmRMmUtIYmnTnTaZQmixJ6oSsWZMpRohQioXmzCdOlTCRSgWs2ZIuYqqYYbOFRQBZp0wBaICgGRIvZMCE0SKEwgQCDiJg2HCBWBIuX8aUwcIjw40dL2wACcLhAZQrVKxkKeJhRYsaPnS4yKFCwq9kSo5EGVLhBw0UKUaI6IEDgkBfxIoVWPDBRIwZMmCc6DCgYrMEDDSAKEEihAUBxpzzGqZMgYEDzI4JA2sWEAA7); } ',
        '.members-list > .member.user.access-0 { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90CHBQQO+Kd7s8AAAJeSURBVDjLnZLLTxNRFIe/O9OZttTSB1TAgsYIiMWExIgEtTHGROIGF4adxMR0Q9y5UBf+AerCqImyURbGHXEBxhhMDCoiCQsMiSAq4aFWU2vTh2XaTjuti5aHiI/4JWdx7zn33N/v5MCvmICAopqH7W5PyO72hBTVPAwESrmfEOvOVSZFHayt37VvR2MTbpcTgEg0xty7GT7NvhnPZfVOILRRA0U2KaM123e2ltlsCCGYmRjjb6yVFLA5XK1pLUlGS67RKH7/ulBAWq0T3bmsTup7HJFL0d7s5V9YVnCqYVv13otdDRw73Ibb24hU5ln55U8IwNZ1qCF84oDXenRPLa66ZijfCtZKkJRilaFDKgyJD0Q/TvH41WfujwZT/c/eeyRA8Vh1c0t9NRZVBlFyVQCQSiGKISQsqkxLfTUeq24GFBlITy4knG5lqd231YndvQUUG5jMIMlAHnJpyCZBTxAOznH30QTXHy5eM/IMyABGnqGnU7GhRFLr7vQ3mbA4QJTGk8+BkYGcBlqIszeGMlcfLPqNPHeWNS4T7Hv+bbZ/bB7SMZCVoh0hFWeRidE/Nk/fSGQWCK5fJL9lt3/AE7jsarJkudcWwZV6i4RRFIFM1NLIyfFKZtIK4dvno+nXI8eBEQHUqb6DkxU9N11ClilkdfqObCaq6Zx7GQHgyv4KXGUqp598RSgqBcMg0nsmqk+/aBFIpluOC4M9srNqxYvDlCehFyhIclFm3qBcFcRzq46NWIj4pc5ek/D6OjKSHRLaSlLbYGGW1l9IdoTX1yHYVLFAjc/B//BlOv4DpxfM0MZp+E4AAAAASUVORK5CYII=); } ',
        '.members-list > .member.user.access-1 { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACv0lEQVR42p2Sa0iTURzGn3fb++6mbnNT826myzQyirwmJWEkhEKxChKM0g8qQvWhJCqIILIP+aHUD0okGURSkRGVFBnewooocnkpm640HWOXdJf33fZ2toVN65MH/nB4nnN+5385FP5dIhJHaEZ8WBIWkekXXAt2Pce6b5PtTRKe0MPUissxIprpTkjbkLNOm4FIlTIgmi1WTI6P4vuXz8Meji0j0tz/ALRQRA/Erl2/TSaXg6KWs3meh2NxEbPfxt54PVwhkbiVgJoIdXQLI5EtE7VJGjQey0P99V4YTQtgXQ7YzfO1xGpdBiAvDkrDFfkUkeRSBnnZaThYmg9dyWbQvAvGKQOONz1Cz9tpLNqtQySjglBApTYltu2sLp0uLc5FZLwWAlkUKUoWdDkH4JwH7EY8eNaPhluj3Lhhtpo4HX6AXLcj3bS/MF66e0sCVIlZQEQSINUAAjoI8LIEYCKAaViMI+h5P4N7Az+cXa8movwAZe2eZHP9gXxBskYM6RoyufAEQEIAQvEfgDsI+GWE86ceU2YO1+4O+VqeTqkDJTAi6uqZfSknqvdmI06bA4TFkQzU5EdI/5bgMgMLM5gZG0bb44+4dN/QxHr4k6ENz6sqSeptO18hhjKVUBUEIAk6HhfgtgK2SVRf6HS3PzfuJOrrlWNMFIhlT+5cLM/SFW8FVGkhPSAjt06g6+U7HDrXPeJzO0qJagwFFEk2Fj2MqmpUZUg4dOaaoXKOQQBvwPRBCItEi4phDUZdNEztpy2uT33lxOrzAxKZzO0f1DXNKkooBM+xuLErGhYHi1OD5gDgSoEaKhmDoy/mQdEMeK8X5tY6C6vvz6YgELUoGrprhMqYpVoUIh/sLA9eIAx+Mp8XEQwFm0ewdMZrnYPtclkrRSVu+iqubE7FKpa7o26SQpjagNhMxWoAmNXbfgP9tPsNjXnSyQAAAABJRU5ErkJggg==); } ',
        '.members-list > .member.selected { background-color: #ec723f; -webkit-user-select: none; }'
    ].join('\n'));

    app.createMember = function( memberInfo ) {
        memberInfo = memberInfo || {};
        var holder = $('div', 'member');

        (function() {
            var entityType = 'group',
                entityId   = 0,
                access     = '1';
            
            Object.defineProperty( holder, "entityType", {
                "get": function( ) {
                    return entityType;
                },
                "set": function( typeStr ) {
                    entityType = typeStr;
                    holder.removeClass( 'user' ).removeClass( 'group' ).addClass( entityType );
                }
            });
            
            Object.defineProperty( holder, "entityId", {
                "get": function() {
                    return entityId;
                },
                "set": function( intVal ) {
                    entityId = intVal;
                }
            });
            
            Object.defineProperty( holder, "access", {
                "get": function() {
                    return access;
                },
                "set": function( accessType ) {
                    access = accessType;
                    holder.removeClass('access-0').removeClass( 'access-1' ).addClass( 'access-' + access );
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
            },
            null,
            {
                "caption": "Allow",
                "handler": function() {
                    holder.access = 1;
                },
                "input": "radio",
                "checked": function() {
                    return holder.access == 1;
                },
                "icon": "img/mmc2/pa.png"
            },
            {
                "caption": "Deny",
                "handler": function() {
                    holder.access = 0;
                },
                "input": "radio",
                "checked": function() {
                    return holder.access == 0;
                },
                "icon": "img/mmc2/pdi.png"
            }
        ])
        
        holder.entityType = memberInfo.entityType || 'user';
        holder.entityId   = memberInfo.entityId   || 0;
        holder.access     = memberInfo.access     || 0;
        
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
            return {
                "entityType": holder.entityType,
                "entityId": holder.entityId,
                "access": holder.access
            };
        }
        
        return holder;
    }

    app.handlers.cmd_add_member = function() {
        var member = {
            "entityType" : app.chooseFrom.value,
            "entityId"   : parseInt( app.members.value ),
            "access"     : parseInt( app.rightType.value ),
        };
        
        // determine member's name
        member.name = (function(){
            for ( var i=0,len=app.entities[ app.chooseFrom.value ].length; i<len; i++ )
                if ( app.entities[ app.chooseFrom.value ][i].id == member.entityId ) {
                    return app.entities[ app.chooseFrom.value ][i].name;
                    break;
                }
            return 'unknown';
        })();

        
        /* Loop to existing members in order to see if there is another
           member with the same combination type => id added. If it
           is added, we only change it's access */
        
        for ( var i=0,items=app.membersList.querySelectorAll('div.member'), len=items.length; i<len; i++ ) {
            if ( items[i].entityType == member.entityType &&
                 items[i].entityId == member.entityId
            ) {
                items[i].access = member.access;
                return;
            }
        }
        
        // Create a new member and append it to the app.membersList
        app.membersList.appendChild(
            new app.createMember( member )
        );
    }
}