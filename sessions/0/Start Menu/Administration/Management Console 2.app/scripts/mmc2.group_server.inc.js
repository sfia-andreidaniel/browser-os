var MMC2_ConfigRoot = MMC2_ConfigRoot || [];

MMC2_ConfigRoot.push({
    "name": "Server",
    "id"  : "grp_server",
    "icon": "data:image/gif;base64,R0lGODlhEAAQAPecAISEhJ6entvc39vb3n5+frCwsM3O05GRkd/f4ld8sXl5ec7P1N7f4bW1tdze4dzc326Vy5Gv2Xh4eIuLi7q6utTV2cPEytHT19PT08DAwMrKysjIyKWlpXCYzoqKiqysrHGZz1l/tHR0dFqAtc7OznBwcJiYmGRkZMLDyJGu2JqamlapUHNzc3NzdMnKz7u9w3eg1tfY3N3d3crKzKTIoMjJzcnKzM/Pz42NjW+XzZOTlHWe1LO0u1h9s+zs7t/g4q6urtfX18HCxHZ2dtzd4Nnb3tTV2miOxNjZ3NbX28XGy1h9ss/Q1Li5wIWFhVZ7sMXFxbGyurGzu9XW2lh+s9bW293d4MHDyGuRx1Z7sW2TyaqqqmqQxmtra+Pj5mhoaM3O0ZycnMHBx9XV12uSyHCXzW+WzPz8/G1tbTeUN2dnZ4CAgOLi5K+xuerq6uXl6La2tq6vt9zc3HOb0czMzODg4LS0tN3e4a6xuUKhO9/f39DQ0NLT1ZGv2pGRkqmpqdbW2MPDw/Hx8Z+fn7m7wevs7XKb0Z+gotDR1vb29tPT122UytHR0dPT1XSc0u/v8ZKSktPU12NjY8TExL+/v7u7u4aHh9/f4b6/xf7+/oWGh01yp////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAJwALAAAAAAQABAAAAj6ADkJHCiwjoZJGSrBKbCBoMAzMuR4cfBAwAAfHBwKYqTHjQslFq6IQRIgCIY9dDYEokShQYEtHHT4SWICwyMECBjcIWKxSKEAmF5MOUACwZMsCZZQCTFiUwwTODxUmKCBQYIjXMgsMtNhU5UDhJooAgDFQQ8sWiCUATFn01QaKy4QyPAgBIQcIAw52rEpEoA8aRBJoDBgRIcUESL0gbFJLg8pTFjYsbKpsuXKRiREabMADRA2Y/iAsYCixgwbgFrgiWPgCwmXHwYFUOEEgCVNhwwYeHNi4I0/Qhas+XBARIkuaiQpEJgIUqMfAi4NcUgwUxgCCox7oM4pIAA7",
    "context": {
        "cmd_server_info": [
            {
                "caption": "Refresh",
                "id": "cmd_server_info_refresh",
                "icon": "img/mmc2/serveri.gif"
            }
        ],
        "cmd_packager:": [
            {
                "caption": "Build Package",
                "id": "cmd_package_build",
                "icon": "img/mmc2/pkbuild.png"
            },
            {
                "caption": "Download Package",
                "id": "cmd_package_download",
                "icon": "img/mmc2/pkdl.png"
            },
            {
                "caption": "Install Package",
                "id": "cmd_package_install",
                "icon": "img/mmc2/pkinstall.png"
            }
        ]
    },
    "create": function( app ) {
        return [
            {
                "name": "Server Information",
                "id"  : "cmd_server_info",
                "icon": "img/mmc2/serveri.gif"
            },
            {
                "name": "Software Packages",
                "id"  : "cmd_packager",
                "icon": "img/mmc2/serverp.png",
                "create": function() {
                    var req = [];
                    req.addPOST('do', 'enum-packages');
                    var rsp = $_JSON_POST( 'vfs/lib/mmc2/handler-packager.php', req );
                    return rsp || [];
                }
            }
        ];
    }
});