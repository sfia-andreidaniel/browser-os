function JMineSweeper_cmd_game_options( app ) {

    app.handlers.cmd_game_options = function() {

    var $namespace = {};

    var $export = function(objectID, objectData) {
        $namespace[objectID] = objectData;
        return objectData;
    };
    var $import = function(objectID) {
        return $namespace[objectID] || (function() {
            throw "Namespace " + objectID + " is not defined (yet?)";
        })();
    };
    var $pid = getUID();

    var dlg = $export("0001-dlg", (new Dialog({
        "alwaysOnTop": false,
        "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADTAAAA0wB/Z14fgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHwSURBVDiNhZM9ixpRFIaf6+hMNCMrgVELTaOFUWRdEFIEF8E/kCKksE2V32KdLUyRJlV+QSqLLCEGwUJYP2BSCn5gbCYYdceTIuPn7rIHDlzOfc/He+97EBHucyADiOeZh3A+PFNKmUqpHI+YUiqnlDJ3Aa+bCVwDM+AcuAS+HEzwFXgPXHiYa8AUEZSI4HX+BjwD/kYiEaNYLKpYLIau60ynU/r9PrZt3wJ+4DdwKSI3ypsApdQ58COVSgXL5TKapt0Z37ZtGo2GC7wSkZ/A/g2AJ6ZpGqVSCU3TiEQixONxTHNPN51Ok81mNeDtNuZXSmW887tMJuPTdR2AarWKZVm4rstkMqFerwOQz+fpdrtvlFIf8fj0ttWi0ejRyKPRCMdxSCaTu9jZ2RmGYTxfLpe9Uwq4rntUIBgMomkaoVAIn+8/VETYbDY7jA944fmHyWRyVMBxHKbTKeFwmEAgAMB8Pme9Xv/a5vlEpC8ifeCq1+utF4sFAK1Wi/F4zGq1olarsVwuAWi32wCftnmn3/g9kUg8rVQqGIbBqXU6HZrN5i3wUkTawL1C+hMKhfRCoRCwLAtd15nNZgwGA4bD4QrQORDSQ1LOAlfspfwZeO3dHUn5cPtMIPfYNgK5bbKI4N/yExEHuLlD/MRE5AjzDwd7Br+JNkiZAAAAAElFTkSuQmCC",
        "caption": "MineSweeper Options",
        "closeable": true,
        "height": 248,
        "maximizeable": true,
        "maximized": false,
        "minHeight": 50,
        "minWidth": 50,
        "minimizeable": true,
        "modal": false,
        "moveable": true,
        "resizeable": true,
        "scrollable": false,
        "visible": true,
        "width": 377,
        "childOf": app
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));


    var grgid = getUID();

    var easy   = $export("0001-radio", $("input").setAttr("type", "radio").setAttr("name", "ms_difficulty_"+grgid).setAttr("style", "top: 20px; left: 10px; position: absolute"));
    var medium = $export("0002-radio", $("input").setAttr("type", "radio").setAttr("name", "ms_difficulty_"+grgid).setAttr("style", "top: 50px; left: 10px; position: absolute"));
    var hard   = $export("0003-radio", $("input").setAttr("type", "radio").setAttr("name", "ms_difficulty_"+grgid).setAttr("style", "top: 80px; left: 10px; position: absolute"));
    var custom = $export("0004-radio", $("input").setAttr("type", "radio").setAttr("name", "ms_difficulty_"+grgid).setAttr("style", "top: 110px; left: 10px; position: absolute"));

    easy.checked = app.bombs == 10 && app.cols == 10 && app.rows == 10;
    medium.checked=app.bombs == 40 && app.cols == 15 && app.rows == 15;
    hard.checked = app.bombs == 80 && app.cols == 20 && app.rows == 20;
    custom.checked = !easy.checked && !medium.checked && !hard.checked;

    $export("0001-lbl", (new DOMLabel("Easy", { "for": easy })).setAttr("style", "top: 20px; left: 35px; width: 35px; position: absolute; text-overflow: ellipsis; font-weight: bold"));
    $export("0002-lbl", (new DOMLabel("Medium", { "for": medium })).setAttr("style", "top: 50px; left: 35px; width: 55px; position: absolute; text-overflow: ellipsis; font-weight: bold"));
    $export("0003-lbl", (new DOMLabel("Hard", { "for": hard })).setAttr("style", "top: 80px; left: 35px; width: 30px; position: absolute; text-overflow: ellipsis; font-weight: bold"));
    $export("0004-lbl", (new DOMLabel("Custom", { "for": custom } )).setAttr("style", "top: 110px; left: 35px; width: 50px; position: absolute; text-overflow: ellipsis; font-weight: bold"));

    var cols = $export("0001-spinner", (new Spinner({
        "value": 10,
        "minValue": 3,
        "maxValue": 64
    })).setAttr("style", "top: 135px; left: 70px; position: absolute"));

    $export("0005-lbl", (new DOMLabel("Cols:")).setAttr("style", "top: 140px; left: 35px; width: 30px; position: absolute; text-overflow: ellipsis"));

    $export("0006-lbl", (new DOMLabel("Rows:")).setAttr("style", "top: 140px; left: 135px; width: 35px; position: absolute; text-overflow: ellipsis"));

    var rows = $export("0002-spinner", (new Spinner({
        "value": 10,
        "minValue": 3,
        "maxValue": 64
    })).setAttr("style", "top: 135px; left: 175px; position: absolute"));

    $export("0007-lbl", (new DOMLabel("Mines:")).setAttr("style", "top: 140px; left: 240px; width: 40px; position: absolute; text-overflow: ellipsis"));

    var mines = $export("0003-spinner", (new Spinner({
        "value": 10,
        "minValue": 1,
        "maxValue": 65535
    })).setAttr("style", "top: 135px; left: 285px; position: absolute"));
    
    [ cols, rows, mines ].chain( function() {
        for ( var i=0,len=this.length; i<len; i++ ) {
            (function( spin ) {
                
                spin.addCustomEventListener( 'change', function() {
                    custom.checked = true;
                } );
                
            })( this[ i ] );
        }
    } );
    
    easy.onclick = function() {
        cols.value = 10;
        rows.value = 10;
        mines.value= 10;
    }
    
    medium.onclick = function() {
        cols.value = 15;
        rows.value = 15;
        mines.value = 40;
    }
    
    hard.onclick = function() {
        cols.value = 20;
        rows.value = 20;
        mines.value = 80;
    }
    
    $export("0001-btn", (new Button("Cancel", (function() {
        dlg.close();
        dlg.purge();
    }))).setAttr("style", "bottom: 10px; right: 10px; position: absolute"));

    $export("0002-btn", (new Button("Ok", (function() {
        
        app.mines = cols.value + "x" + rows.value;
        app.bombs = mines.value;
        
        dlg.close();
        
        dlg.purge();
        
    }))).setAttr("style", "bottom: 10px; right: 70px; position: absolute"));

    $export("0008-lbl", (new DOMLabel("Field: 10 x 10, Mines: 10")).setAttr("style", "top: 20px; left: 115px; position: absolute; text-overflow: ellipsis").setAnchors({
        "width": function(w, h) {
            return w - 125 + "px";
        }
    }));

    $export("0009-lbl", (new DOMLabel("Field: 15 x 15, Mines: 40")).setAttr("style", "top: 50px; left: 115px; position: absolute; text-overflow: ellipsis").setAnchors({
        "width": function(w, h) {
            return w - 125 + "px";
        }
    }));

    $export("0010-lbl", (new DOMLabel("Field: 20 x 20, Mines: 80")).setAttr("style", "top: 80px; left: 115px; position: absolute; text-overflow: ellipsis").setAnchors({
        "width": function(w, h) {
            return w - 125 + "px";
        }
    }));

    $export("0011-lbl", (new DOMLabel("Define a game you want")).setAttr("style", "top: 110px; left: 115px; position: absolute; text-overflow: ellipsis").setAnchors({
        "width": function(w, h) {
            return w - 125 + "px";
        }
    }));

    $import("0001-dlg").insert($import("0001-lbl"));
    $import("0001-dlg").insert($import("0002-lbl"));
    $import("0001-dlg").insert($import("0003-lbl"));
    $import("0001-dlg").insert($import("0004-lbl"));
    $import("0001-dlg").insert($import("0001-radio"));
    $import("0001-dlg").insert($import("0002-radio"));
    $import("0001-dlg").insert($import("0003-radio"));
    $import("0001-dlg").insert($import("0004-radio"));
    $import("0001-dlg").insert($import("0001-spinner"));
    $import("0001-dlg").insert($import("0005-lbl"));
    $import("0001-dlg").insert($import("0006-lbl"));
    $import("0001-dlg").insert($import("0002-spinner"));
    $import("0001-dlg").insert($import("0007-lbl"));
    $import("0001-dlg").insert($import("0003-spinner"));
    $import("0001-dlg").insert($import("0001-btn"));
    $import("0001-dlg").insert($import("0002-btn"));
    $import("0001-dlg").insert($import("0008-lbl"));
    $import("0001-dlg").insert($import("0009-lbl"));
    $import("0001-dlg").insert($import("0010-lbl"));
    $import("0001-dlg").insert($import("0011-lbl"));

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);
    
    }
}