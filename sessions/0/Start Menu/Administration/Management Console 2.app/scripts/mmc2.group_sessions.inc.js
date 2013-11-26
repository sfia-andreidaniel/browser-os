var MMC2_ConfigRoot = MMC2_ConfigRoot || [];
MMC2_ConfigRoot.push({
    "name": "Sessions",
    "id"  : "grp_sessions",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1AsBEAo4RNxRiQAAAjxJREFUeNp9kk9IVFEUxn+mEtaigjQhXESLqFZRSfRHs3QRYpKbCEPSKCKrTdoiK6YUghiDQrKFMRIIWhq2GAmfjBJMCwOjnAql/Msza6DplaO+N++902L0MS+HDhwunPN95373uwcgG5B/MpeVcTkZLgWQnsAgEW0OgKGhIRrra0gWPYFBRsdUAKYnv9JYX0MawOiYSvDtRyLhGTLMzwyHBhySLYJpGAjQ1tbEnkNn6H71hkh4BiA+ACASniFn/Szlpyv4/mPcdXN0fg5D19m9dxvlJ44AUFh20enL1Zteqawqk76AT255qiXJW+X6jXMCSOzbAfndU5LYIxcQpa9T+gI+AcS2bbFtWyzLkomJCVEUxUU+e3LXMrnbUTEcGnAN0DRNNE2TqakpAWT+Q64s+AsTyQKkr+I/ISKMjIwAMPklj9pnv3jS8Q7PnfMOxjHRNE0XMRqNAlBUVERpQSbby7wA3L13iVhMd7COAjvuxwoFAC/7wwC0PvWQlbXBhUlb2jAyVq8lslQMBoMYhoGIoCgKqqpSV1eLETMwzVgi35cCyLWGFsyfrzlWfJgXXb00P2pfoaayqoR9+3dimiaqGiZ781GuXKiIezA+PcuWnDz8/n6OlxZQXJLP4sI8lm1h6DqWbWPbFrquIyIcLKjmflOr28T4kHxCoU+kpaayaEQBIWaaJNqzdccpfB297l+YHH3P8pm5cR3+5y1Jv7XB+5gHD5vj6/0n4tRvJ1ndLmATkL6Ua4D2JLjOv7GCQJ4EoSeZAAAAAElFTkSuQmCC",
    "context": {
        "grp_sessions": [
            {
                "caption": "Add Session",
                "id": "cmd_session_add",
                "icon": "img/mmc2/sa.gif"
            }
        ],
        "grp_sessions:": [
            {
                "caption": "Edit Session",
                "id": "cmd_session_edit",
                "icon": "img/mmc2/s.gif"
            },
            {
                "caption": "Delete Session",
                "id": "cmd_session_del",
                "icon": "img/mmc2/sd.gif"
            }
        ]
    },
    "create": function( app ) {
        var req = [];
        req.addPOST('do', 'get-sessions-list');
        var rsp = $_JSON_POST( 'vfs/lib/mmc2/handler-sessions.php', req );
        return rsp || [];
    }
});