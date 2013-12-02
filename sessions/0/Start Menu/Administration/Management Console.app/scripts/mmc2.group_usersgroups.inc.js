var MMC2_ConfigRoot = MMC2_ConfigRoot || [];

MMC2_ConfigRoot.push({
    "name": "Users and Groups",
    "id"  : "grp_usersgroups",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfVJREFUeNpiYKAQMBKrkLmo1x5IOQDxgr99xQ9JMgCouT5EVb7BQkKUYc3thwwnXrx2ABpyECTHgqSIX5Lz5wRv2TcBJ1/zHbj8njcBKKwAxAI2UmIFTrKSYHVxWsoMj798LXjEwIBqABAUbHa9kGAg/IXhw0+WAJO1xg8iGa8K2LA8ZTjyTpph9S1/hlA1BbBCLhYWAZgmuAEhCi8dQJpBYOMjUYaprLsEbIGaQQBET3v7k+Hi6xQGThYWhtsfPh2A6WOCMW5+5PoAY5+/z8IA0wwDWewXGZ69vMsgw8PFIMfLXQD0sjyKAS+/szFceMsDZvMz/sIamKL/3jNwsbIw5BloCvCzsTbADQCa1r/N7UIAzAuP/vFiNeApqwwkDICGGIkJJ4D1gkI/T+vRhnjVF3CFD39yMzx/8Z9Bjfk9XKz9hxnDORY1hpfffoDCgOHFt+8Mr/XtDoAC0cBf7jVcIcgb567+Z2hneYJiOyg2Zr59duHSG05QGvgIj34mS3eHh184BbY/EX6w9K7EhwNX2STms21n4GD8i2KAPNNnBifWRxI7fitwfDp+YCfWlAhKcZf5FjSAFOMCIK+0/zBXgCVnJmTJMNabCfg0g0AU23UQFYCRDkBAmfmDAqF8AbJAg+ltAEZKBOW2S3/vgp1ICgAIMAA4EK/gLFJExgAAAABJRU5ErkJggg==",
    "context": {
        "cmd_users": [
            {
                "caption": "Add User",
                "id": "cmd_user_add",
                "icon": "img/mmc2/ua.png"
            }
        ],
        "cmd_users:": [
            {
                "caption": "Edit User",
                "id": "cmd_user_edit",
                "icon": "img/mmc2/u1.png"
            },
            {
                "caption": "Delete User",
                "id": "cmd_user_del",
                "icon": "img/mmc2/ud.png"
            },
            null,
            {
                "caption": "Enable User",
                "id": "cmd_user_enable",
                "icon": "img/mmc2/ue.png"
            },
            {
                "caption": "Disable User",
                "id": "cmd_user_disable",
                "icon": "img/mmc2/u0.png"
            }
        ],
        "cmd_groups": [
            {
                "caption": "Add Group",
                "id": "cmd_group_add",
                "icon": "img/mmc2/ga.gif"
            },
            {
                "caption": "Delete Group",
                "id": "cmd_group_del",
                "icon": "img/mmc2/gd.gif"
            },
            {
                "caption": "Edit Group",
                "id": "cmd_group_edit",
                "icon": "img/mmc2/g.gif"
            }
        ]
    },
    "create": function( app ) {
        // console.log("Create context users and groups");
        return [
            {
                "name": "Users",
                "id"  : "cmd_users",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACv0lEQVR42p2Sa0iTURzGn3fb++6mbnNT826myzQyirwmJWEkhEKxChKM0g8qQvWhJCqIILIP+aHUD0okGURSkRGVFBnewooocnkpm640HWOXdJf33fZ2toVN65MH/nB4nnN+5385FP5dIhJHaEZ8WBIWkekXXAt2Pce6b5PtTRKe0MPUissxIprpTkjbkLNOm4FIlTIgmi1WTI6P4vuXz8Meji0j0tz/ALRQRA/Erl2/TSaXg6KWs3meh2NxEbPfxt54PVwhkbiVgJoIdXQLI5EtE7VJGjQey0P99V4YTQtgXQ7YzfO1xGpdBiAvDkrDFfkUkeRSBnnZaThYmg9dyWbQvAvGKQOONz1Cz9tpLNqtQySjglBApTYltu2sLp0uLc5FZLwWAlkUKUoWdDkH4JwH7EY8eNaPhluj3Lhhtpo4HX6AXLcj3bS/MF66e0sCVIlZQEQSINUAAjoI8LIEYCKAaViMI+h5P4N7Az+cXa8movwAZe2eZHP9gXxBskYM6RoyufAEQEIAQvEfgDsI+GWE86ceU2YO1+4O+VqeTqkDJTAi6uqZfSknqvdmI06bA4TFkQzU5EdI/5bgMgMLM5gZG0bb44+4dN/QxHr4k6ENz6sqSeptO18hhjKVUBUEIAk6HhfgtgK2SVRf6HS3PzfuJOrrlWNMFIhlT+5cLM/SFW8FVGkhPSAjt06g6+U7HDrXPeJzO0qJagwFFEk2Fj2MqmpUZUg4dOaaoXKOQQBvwPRBCItEi4phDUZdNEztpy2uT33lxOrzAxKZzO0f1DXNKkooBM+xuLErGhYHi1OD5gDgSoEaKhmDoy/mQdEMeK8X5tY6C6vvz6YgELUoGrprhMqYpVoUIh/sLA9eIAx+Mp8XEQwFm0ewdMZrnYPtclkrRSVu+iqubE7FKpa7o26SQpjagNhMxWoAmNXbfgP9tPsNjXnSyQAAAABJRU5ErkJggg==",
                "create": function(){
                    var req = [];
                    req.addPOST('do', 'get-users-list');
                    var rsp = $_JSON_POST( 'vfs/lib/mmc2/handler-users.php', req );
                    return rsp || [];
                }
            },
            {
                "name": "Groups",
                "id"  : "cmd_groups",
                "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAKRng457rjw8i0VFfb+/3pyco3p6f3p6fa6usLe3uH9/gDg6kCwxoVFXm4iNuV5lihs2o4GOwCVHpMLO8oaj6wZAxRdQyYeYvKe86JS8+xZh1KzH7pG57Rxu0xZsyR2E8hF12hJ12mu2/3S6/xB52hF52ySX/yWX/224/3S7/3K0733A/3qlzp7Q/7bc/8Th+y2e/y6f/zSi/zWj/1+2/7Xd/8Pj/9Dr/0at9aPZ/8bn/9bu/zZ6pmDB/8Xo/069/9Tw/9b2/3ivoSFjPcr92RqgKL3yvjaINjqBOjdZN050TmmTacHNwcvTy/v8+9PU046PjjKDL1mXUnKpahyrANP3yyrOAi1pHmG8SDHOA6npl9Puyz23DXi6YGG7OGDnF5/ef7PvksDzpmrOK5XjZHbWMtnpzKjShJGzZ3eSGf//8f/+693bv//znpKNcJp6Dv/hge/grv/wvf/st9++bcWMD//GRndTCPzGVPzHWP/NatmeL+yqNfGxOvGyPv3FXv/Zl8J/DP/Qf7KGRMehZ593QbZlAraOW+nf1NFrDbyQZrxWAMmlh+Ghcv/Yu9OXcv/Qsselj//Gp6M4ALJ5XfjCpvjDqf3ayP69nvW6n/3HrsqrnPq2m8SPefrIs+SdhP+6of/JtfvNu7yflPqVcv/i2NhpStt1WO6plaxrW7tuXv+/scFYRLRyabejoOWEe/mWjbwNA81+et6CgtqUlI1mZuPKys26uvLl5ejj4/j19f////v7+/f39+/v7+3t7eXl5dnZ2dbW1tLS0sXFxbm5ubW1tZ+fn5ycnJmZmZeXl5OTk4GBgf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAM0ALAAAAAAQABAAAAj/AJs10zXqEKFCx3oJXMhwEyNEcegMesKQIa5HctbMgWOnFi1Yr24xtNWoDSBBf/iwmrUKVStXC3MpwqMnT59EoHbtUgNJVbCFbur42RNokahSlzw5irSsmRMmUtIYmnTnTaZQmixJ6oSsWZMpRohQioXmzCdOlTCRSgWs2ZIuYqqYYbOFRQBZp0wBaICgGRIvZMCE0SKEwgQCDiJg2HCBWBIuX8aUwcIjw40dL2wACcLhAZQrVKxkKeJhRYsaPnS4yKFCwq9kSo5EGVLhBw0UKUaI6IEDgkBfxIoVWPDBRIwZMmCc6DCgYrMEDDSAKEEihAUBxpzzGqZMgYEDzI4JA2sWEAA7",
                "create": function() {
                    var req = [];
                    req.addPOST('do', 'get-groups-list');
                    var rsp = $_JSON_POST( 'vfs/lib/mmc2/handler-groups.php', req );
                    return rsp || [];
                }
            }
        ];
    }
});