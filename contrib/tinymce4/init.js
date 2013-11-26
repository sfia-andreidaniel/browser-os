tinymce.init({
    "selector": "#ed1", 
    "plugins": [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table contextmenu paste"
    ], 
    "layout": "fixed",
    "setup": function(editor) {
        window.ed = editor;
    },
    "menubar": false,
    "width": 400,
    "height": 200,
    
    /* "content_css": [
        "http://www.digisport.ro/css/style.css"
    ] */
});

