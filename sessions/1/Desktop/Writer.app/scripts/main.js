function DocumentEditor ( fileName ) {
    
    var dlg = new Dialog({
        "width": 500,
        "height": 300,
        "caption": "Document Editor",
        "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAiZJREFUeNqMksFrE0EUxr/dnTUWGpIUmmpKoSERpTWHkF4VRAu9eCz02lvPPfUmeO1BvGj+AaG99BgKgl48aqtQvBiapNjSEpOQbpJtd7ObvjdmNhtQceDNJLPv+8333oz2YncXPDRNe07LXfx7fPA8r9zv9zEYDOSG8H1ffUxtra4WHc+Dy0H7HiWpxFqthvdHRxvD3LIS6UxTwTDPdWU4V1ewu110Oh1YliXXl2trRcp7Srp7CiBYOByaxkSaTcMYmWY4gZvNJt6VSlicmiq+3tnZpC+vfgPotMAOiT8dHEjb8XgcvV4PD7JZCcnn83I/Go3iy+mpHThwww4IkCUBl8LJiUQCt01zzAkP0mgjwMiBLKFSqcjTG42GhBwPGxmLxWDbNnK5HEgTAjhOAOASniwtSQd+Og2fhBw/qX6G8L5BOaT5IwC8Wy7NKRpANzi3fBy44p7MzswgrBFOyAH34M3bO1hf97Hw+D7c9i/Z2EwmE/TE1HU4YQdjAJoeLv7At6+34JoWrKaDR2kN1WoVkUhExjw5+DuAEBvbFjuXtQ+GPVAOuAesHANcUH2JVCpw8PHwUNbbarXkyg+Ib4AB3IN0Mgnn+loCWmdnEJ/39rCwsoLJ6WmdN58VCsHJ0gndhvqvHLTbbb1Tr+P7/j5YNEE/khfn50aoFujULG6gQSuHoOcthIBBK+eyhrWCJ4pk/eTkMloobOE/ht/tXrKG3+eNAAMAvhNFxFKZn5wAAAAASUVORK5CYII="
    });
    
    /*
    dlg.insert( window.html = ( new HTMLEditor('<p>This is the content</p><p>And another line</p>') ).setAnchors({
        "width": function(w,h) {
            return w + "px";
        },
        "height": function(w,h) {
            return h - 20 + "px";
        }
    }).setAttr("style", "margin-top: 10px"));
    */
    
    DocumentEditor_interface_css        ( dlg );
    DocumentEditor_interface_menu       ( dlg );
    DocumentEditor_interface_toolbar    ( dlg );
    DocumentEditor_interface_panel      ( dlg );
    DocumentEditor_interface_document   ( dlg );

    DocumentEditor_cmd_new              ( dlg );
    DocumentEditor_cmd_font_style       ( dlg );
    DocumentEditor_cmd_font_color       ( dlg );
    DocumentEditor_cmd_font_size        ( dlg );
    DocumentEditor_cmd_back_color       ( dlg );
    DocumentEditor_cmd_justify          ( dlg );
    DocumentEditor_cmd_clear_formatting ( dlg );
    DocumentEditor_cmd_undo             ( dlg );
    DocumentEditor_cmd_redo             ( dlg );
    DocumentEditor_dlg_find             ( dlg );
    DocumentEditor_cmd_select_all       ( dlg );
    DocumentEditor_cmd_insert_break     ( dlg );
    DocumentEditor_cmd_insert_datetime  ( dlg );
    DocumentEditor_cmd_insert_symbol    ( dlg );
    DocumentEditor_cmd_hyperlink        ( dlg );
    
    if ( fileName ) {
    
    } else {
        dlg.createDocument();
    }
    
}