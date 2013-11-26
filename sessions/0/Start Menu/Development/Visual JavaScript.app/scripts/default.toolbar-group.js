window.JSIde_Components = window.JSIde_Components || [];

window.JSIde_Components.push(new JSIde_Component({
    "type"  : "tlbgroup",
    "name"  : "Toolbar Group",
    "group" : "Menus",
    "order" : 2,
    "requires": "apptoolbar",
    "provides": "toolbargroup",
    "icon": "data:image/gif;base64,R0lGODlhEAAQALMNAL/Z/4iizqnD62iCsYmizmmCsajD66nD7NCbTrF/PYWTr1Jsnf///////wAAAAAAACH5BAEAAA0ALAAAAAAQABAAAAQ4sMlJq704682n+mAYSgpingigqguJMEwCJ4JxCELblPMcEL+ATpEoGhOFQXKgWzifUGhnSq1aLREAOw==",
    "compilable": false,
    "renderProperty": "caption",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "varchar",
            "value": ""
        },
        {
            "name": "caption",
            "label": "Caption",
            "type": "varchar",
            "value": "Toolbar Group Caption"
        }
    ],
    "init": function( cfg, app ) {
        return JSON.parse( JSON.stringify( cfg ) ).setProperty("setAttribute", function() {});
    },
    "add": function( root, cfg ) {
    },
    "compile": function( cfg, globalName, items ) {
        return new JSIde_StringObject( '', {} );
    }

}, {
    
}));