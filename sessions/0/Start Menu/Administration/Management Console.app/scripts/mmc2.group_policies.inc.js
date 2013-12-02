var MMC2_ConfigRoot = MMC2_ConfigRoot || [];
MMC2_ConfigRoot.push({
    "name": "Policies",
    "id"  : "grp_policies",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2lpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM0M0I1MkY0MDNCRDExRTE4QTIwOThENzVDNTcwNzRCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM0M0I1MkYzMDNCRDExRTE4QTIwOThENzVDNTcwNzRCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzMgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOkFDMUYyRTgzMzI0QURGMTFBQUI4QzUzOTBEODVCNUIzIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkM5RDM0OTY2NEEzQ0REMTFCMDhBQkJCQ0ZGMTcyMTU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+uELhUwAAAixJREFUeNqkk89rE0EUx78zmd1uTLbaVKhELHgRlYqgRC9q1FpB+gd4yKF4EQVBDz141YMXT+JNQVEQ1IuCglBQGyqKBAWtPwpFA7GGpjHENE032R8Z3zSbmMRLwIEvvHkz773PezvLpJT4nyUSBzl2DTOMDDccAc5g6NjLgDhth/x7OSqTrNp459UbBT9lgNmMBHtykXdk5IzFzMHo6R1HTh3PLv4KKl9000br68vbU+VC9kZdylQHgWV3Q8mxPQcmxt88nyp++fD2sfLs3L3/WOzQxPjMwytp2nYk4LpgaKpsQWmLZMZQZv79gi5wXknZyqfO1B0RYNB8iQ0hvy6JMYZ0rh6ulJY5pFMLUwOFZUDXnJpVXuFlS4ajEQYzqFr1W2ijORvUsW21JrXS7yIEh0OXHrie3Co4+zH3eRbqjEhv0t2PpOsqiE1fCjQJrh4+c3fSWbVgV6uwLVLNQrEwjz4dWGc0FAwLTN+/c42SX+gmQCqZpMocQghqh8PzXBSLFgJUw9AomBKFTK3zHbRvYvE4ugn69JV/CL69bkvguK0hyl4JKEa2hriQaz1lb+xcbwQv8tJhTYLLjyQS+9ZsvVeC9E+pqQT36EmJdF7i1iuGE9sxGBsdhWc7cInAJQKXCPr7XegUaBh/tVjAwLM5IFuSa0OMkBH9vgSeOHryKWHmI+tZJTIAHg7BnEnJzf47QxN7qQIrW8IImVnlUz+M2f1Felhq/OU/AgwAUhb7sEqcK1oAAAAASUVORK5CYII=",
    "create": function( app ) {
        var req = [];
        req.addPOST('do', 'get-policies-list');
        return $_JSON_POST('vfs/lib/mmc2/handler-policies.php',req) || [];
    },
    "context": {
        "grp_policies": [
            {
                "caption": "Flush Policies",
                "icon": "img/mmc2/pf.png",
                "id": "cmd_policy_flush"
            },
            null,
            {
                "caption": "Add Policy",
                "icon": "img/mmc2/pa.png",
                "id": "cmd_policy_add"
            },
        ],
        "grp_policies:": [
            {
                "caption": "Edit Policy",
                "icon": "img/mmc2/p1.png",
                "id": "cmd_policy_edit"
            },
            {
                "caption": "Delete Policy",
                "icon": "img/mmc2/pd.png",
                "id": "cmd_policy_del"
            },
            null,
            {
                "caption": "Enable Policy",
                "icon": "img/mmc2/pe.png",
                "id": "cmd_policy_enable"
            },
            {
                "caption": "Disable Policy",
                "icon": "img/mmc2/pdi.png",
                "id": "cmd_policy_disable"
            }
        ]
    }
});