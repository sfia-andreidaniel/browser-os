function JSIde_cmd_load( app ) {

    app.handlers.cmd_load = function() {
        
        var dlg = new Dialog({
            "width": 300,
            "height": 100,
            "caption": "Load JSIde Project",
            "childOf": app,
            "modal": true
        });
        
        var file = dlg.insert( $('input').setAttr('type', 'file').setAttr(
            "style", "position: absolute; left: 5px; top: 10px; display: block"
        ).setAnchors({
            "width": function( w, h ) {
                return w - 10 + "px";
            }
        }) );
        
        dlg.insert(
            ( new Button('Import', function() {
                
                if ( ! (window.File && window.FileReader && window.FileList && window.Blob ) ) {
                    alert("Error: HTML5 file api not supported by your browser");
                    return;
                }
                
                if (!file.files || !file.files.length) {
                    alert("Please first choose a file!");
                    return;
                }
                
                var f = file.files[0];
                
                if ( f.size > ( 1024 * 1024 * 5 ) ) {
                    alert("File too large!");
                    return;
                }
                
                var reader = new FileReader();
                
                reader.onload = function(e) {
                    var buffer = e.target.result;
                    
                    try {
                        var data = JSON.parse( buffer );
                        
                        if (!( typeof data == 'object' ))
                            throw "Data is not an object!";
                        
                    } catch (e) {
                        alert("Error parsing project file!: " + e);
                        return;
                    }
                    
                    JSIde_Index = 0;
                    
                    for ( var componentName in data.componentsState ) {
                        if ( !data.componentsState.propertyIsEnumerable( componentName ) )
                            continue;
                        
                        for ( var i=0,len=JSIde_Components.length; i<len; i++ ) {
                            if ( JSIde_Components[i].type == componentName ) {
                                console.log("Set UID of " + componentName + " to: " + data.componentsState[ componentName ]);
                                JSIde_Components[i].componentID = data.componentsState[ componentName ];
                                break;
                            }
                        }
                    }

                    app.application = data.applicationData;
                    
                    for ( var i=0, len=app.application.length; i<len; i++ ) {
                        JSIde_setupComponent( app.application[i] );
                    }
                    
                    app.tree.selectedNode = app.tree.rootNode;
                    app.tree.refresh();
                    
                    dlg.close();
                };
                
                reader.onerror = function() {
                    alert("Error reading file!");
                };
                
                reader.readAsBinaryString( f );
                
            } ) ).setAttr(
                'style', 'position: absolute; left: 5px; bottom: 5px'
            )
        );
    }
}