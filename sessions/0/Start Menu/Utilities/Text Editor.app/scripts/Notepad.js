function Notepad() {

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
        "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90HAggbC0qq8mAAAAHfSURBVDjLfZK/qlpBEMa/Oeu/wE1lY0jQIiBIGksRHyPWKW5722CVSgxIiryASe9T2KSNpEtlcQqxCoKiO3t2dyZF7jl4VLLwsbO77G9mv1kCgM1m88DMv6y1DWZWZoa1Fs+zcc59s9amIYTv3nuZTCbIRwIAIvIOwFsArwG8udIrInpQ1Q8hhOVkMsFsNisDAGi+QUT4z3g/nU6X+/2e8iqSy9MQAk6nE6y1cM6BmeG9h6pWVPUHgJ2IjKrV6uf5fA4AqBSlJAmWyyV2ux1UtZAxRgeDwVOSJF9U9SsRkaq+zO8VgBgjHh8fc+MuRcfjUa21H6+e96kEMMZgsVggTdN/pqgW+8PhkJIkuWtKARARjMfjy/aBmeGcg4iAmWGMuTG55MFqtUKaplBViMiNQghotVpoNBr3KxiNRuj3+3DOwTlX6kaWZWBmxBjBzLcAIsJ6vcZ2uy2yxRgRYyzWIQQ0m03UarUyQFVJVdHr9dBut4sKcuXZsyyDiMB7XwbU6/XovcfhcMB+v4f3HlmWFfLew3sP5xzq9XrJyAoAZFmWEBG898Xvu6cYY9Heaw9IVdHtdtHpdMDMOJ/PYOZSS/P4fD6XAcaY36r6R1VfiIiKSPGVL+Pn7AkR/cwBfwFieKFYQANQMgAAAABJRU5ErkJggg==",
        "caption": "Notepad",
        "closeable": true,
        "height": 286,
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
        "width": 395
    })).chain(function() {
        Object.defineProperty(this, "pid", {
            "get": function() {
                return $pid;
            }
        });
        this.addClass("PID-" + $pid);
    }));

    dlg.files = [];

    Notepad_CreateFile( dlg );

    Notepad_cmd_new( dlg );
    Notepad_cmd_open( dlg );
    Notepad_cmd_save( dlg );
    Notepad_cmd_close( dlg );
    
    Notepad_cmd_find( dlg );
    Notepad_cmd_find_next( dlg );
    Notepad_cmd_find_previous( dlg );
    
    Notepad_cmd_syntax( dlg );
    Notepad_cmd_line_numbers( dlg );
    Notepad_cmd_print_margins( dlg );
    Notepad_cmd_readonly( dlg );
    Notepad_cmd_word_wrap( dlg );

    Notepad_dde( dlg );

    $export("0001-menubar", [{
        "name": "menuitem1",
        "declaration": "private",
        "caption": "File",
        "id": "",
        "icon": "",
        "shortcut": "",
        "input": "",
        "enabled": true,
        "items": [{
            "caption": "New",
            "id": "cmd_new",
            "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAAIAAgAAAgIAAgQCBAIABAQABAQCBgYCN4QAOfn3u/v7+/35+/37/f37/f39/f/9/f/////9////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAkALAAAAAAQABAAAAiEABMIHEiwoMGDBw8MAADgAIABAxACUCChogQGDw8CqPgAwgIJAyQcMAjggYQHEyZACMBwJMGQEx6gbDChIoCCACY4UJky5YOIBAX0jNlTwk2CORcMTeng6MCNKBd0RPlAAM6dEyL4tFkw5AOlEiZ8NNrVpFiTFRcgwEmgIUuGD4EiRBgQADs=",
            "shortcut": "F7",
            "handler": dlg.appHandler
        }, {
            "caption": "Open",
            "id": "cmd_open",
            "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAAIAAgAAAgIAAgQABAAABAIABAQABAQCBgQABgQCBgQEBgYACEhAGNjKWtzAGt7AHNzAHNzCHNzMXNzQnNzSnN7AHN7IXt7IXt7OXt7WnuEAHuEEHuMAISEGISEIYSMAISMCISMKYSMMYSUAIyMKYyMMYyUAIyUCJScAJScGN4QAOfnpefvnO/nve/vnO/vpe/vre/vte/3nPf3rff3tff3vf//pf//rf//tf//vf//xv//zv//1v//7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAACsALAAAAAAQABAAAAigAFcIHEiwoMGDCA0uAAAg4UABAw+saOhwIACJKwYcgHhQAQCIA3aw2DFAQIIBJTFGbJEDxg4ZO2LscMExIo4XOVjwgFmDR02BA1rcwJEDJcoGBgx4bAhgRwscBFRYAAHiAYYJFSpIPOBCB4EQEEiceICCwwgHDAQK8DFghAULKTZ0eMDhwoCHAjRkMOEhgoQSH0bcfWhAgGEDBQwbrpgwIAA7",
            "shortcut": "Ctrl + O",
            "handler": dlg.appHandler
        }, {
            "caption": "Save",
            "id": "cmd_save",
            "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAAACAAIAAgAAAgAEAgIAAgIGBAIABAQABAQCBAYABgQCCkhAGNjMWNjSmNjY2NrY2tjY2trIWtrKWtrOWtrQmtrSmtrY3NrY3NzOXNzSnNzc3t7Qnt7Snt7Unt7WnuEMXuESnuEUoR7SoR7UoSEOYSESoSEUoyEWoyEY4yMa5SMWqWlnN7evd7exufe1ufe3ufe5+fn1u/nxu/nzu/n1u/n5+/n7+/n9+/vzu/v3u/v5+/v7/fvzvfv1vfv3vfv5/fv7/fv9/f31vf33vf37/f39/f3///31v/33v/35//37//3////5///7///9////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAFAALAAAAAAQABAAAAjUAKEIHEiwoEAWDx5sSPjgAkOGAh84WBDjhpAdL4rYgBEACACBF1QA4IHjRpEXL4DcKACgQEQNB3680NHCRxIXOg5YcAnlQYUDMoAA6TFjRg4iA0jwxJBiQMoXNWro+GFjwAeeDzQMUKIDiA8aNH7UGHBiQMQSHFoOKMB27QkJCs5OMEHCA4UTI1BoIAECq4kVAgYIBjC4QIa4UC40aMBgbYEDA4BUPcHzggkRgQsMaGlDR4EOAiKGUMrywAIAMapW4AmlgAAAhGETMGAAgILQBnMPDAgAOw==",
            "shortcut": "Ctrl + S",
            "handler": dlg.appHandler,
            "disabled": function() {
                return !dlg.currentFile;
            }
        },
        null, {
            "caption": "Close",
            "id": "cmd_close",
            "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAAIAAgAAAgIAAgQABAAABAIABAQABAQCBgQABgQCBgQEBgYACEhAGNjKWtzAGt7AHNzAHNzCHNzMXNzQnNzSnN7AHN7IXt7IXt7OXt7WnuEAHuEEHuMAISEGISEIYSMAISMCISMKYSMMYSUAIyMKYyMMYyUAIyUCJScAJScGN4QAOfnpefvnO/nve/vnO/vpe/vre/vte/3nPf3rff3tff3vf//pf//rf//tf//vf//xv//zv//1v//7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAACsALAAAAAAQABAAAAikAFcIHEiwoEGDAAAsODgQwIoDAwUwfOhwIkEBABQcHHBAosUVA3aw2DFAQIIBJSESPNAiB4wdMnbE2OHC48ADOF7kYMEjZg0eNgUOaHEDRw6UKBsYMKAg4QoAO1rgIKDCAggQDzBMqFAB4gEXOgiEgEDixAMUHEY4YCBQgI8BIyxYSLGhwwMOFwZEFKAhgwkPESSU+DBCb0QDAhIbKJA48ceJAQEAOw==",
            "shortcut": "F8",
            "handler": dlg.appHandler
        }]
    }, {
        "caption": "Edit",
        "items": [{
            "caption": "Find and Replace",
            "id": "cmd_find",
            "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAgAAAgIAAgICBAICBAQABAQCBAQEBgYEOfn5+/v5/f37/f39//3//r29v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAA0ALAAAAAAQABAAAAh2ABsIHEiwoMGDCAEoHAjAAICDAhYIYLjgoUEBAAIMRABgYkGFAxYqxGiRYkgDDQAsCDmAYACFAEICODByYUqVIRFUDFCRo8gBFRVWBOpzIc2gDTMGdfgQZkeMKUlibKmyY0mBVQe05Dnyo0SRMD0yVEgTIcKAAAA7",
            "shortcut": "Ctrl + F",
            // "enabled": true,
            "handler": dlg.appHandler,
            "disabled": function() {
                return !dlg.currentFile;
            }
        }, null, {
            "caption": "Find Next",
            "id": "cmd_find_next",
            "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAAACAAAEAAAIQAAKQAAMQgAEAgAIQgAKQgAMQgAOQgAQggIAAgICAgIEAgIGAgIKRAAxhAIABAICBAIEBAIIRAIKRAIMRAIORAIQhAQABgQCBgQMRgQQiEYOZycjP/39//3/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAABEALAAAAAAQABAAAAiAACMIFHjAAwIMAxMmtJAQYYQLCiMwVFggQ4KIECJ2wNAhYgQOCSsg6ADRowOPCgEAGBigAsoIKlkKQKlypcAAAmYqDCCCAQMNDACICEDB5kAAIIIK3dBzglGBKoP+rBkzIU8ADAYydarQQAgAGo6KADBB4QEBVSNQeBDg6UuUAQEAOw==",
            "shortcut": "",
            "enabled": true,
            "handler": dlg.appHandler,
            "disabled": function() {
                return !dlg.currentFile;
            }
        }, {
            "caption": "Find Previous",
            "id": "cmd_find_previous",
            "icon": "data:image/gif;base64,R0lGODlhEAAQAKUiAAAAAAAACAAAEAAAIQAAKQAAMQgAEAgAIQgAKQgAMQgAOQgAQggIAAgICAgIEAgIGAgIKRAAxhAIABAICBAIEBAIIRAIKRAIMRAIORAIQhAQABgQCBgQMRgQQiEYOZycjP/39//3/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEAAD8ALAAAAAAQABAAAAZlwJ9w+MMgPAci8SLEEC1KYSJTiEKVHUwnColeOogKkRMt/xxmYiUwBADSArbQbRbE23QlgBIQARgaDAwicm0Tgxt+fyBvRG6PgX95hiIbQwwAhEoTmY0/GgAhBnoBDxR4AklpUUEAOw==",
            "shortcut": "",
            "enabled": true,
            "handler": dlg.appHandler,
            "disabled": function() {
                return !dlg.currentFile;
            }
        }]
    }, {
        "caption": "View",
        "items": [{
            "caption": "Syntax",
            "icon": "data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJORkP+Tk5P/k5OT/5OTk/+Tk5P/k5OT/5OTk/+Tk5P/k5OT/5OTk/+Tk5P/k5OT/wAAAAAAAAAAAAAAAAAAAACTk5P//vz6//z49P/69/T/+fb0//r39f/6+fj//Pn2//z59f/7+PX///79/5OTk/8AAAAAAAAAAAAAAAAAAAAAk5OT//359f/06d7/9e7n//DPpv/pqlH/9uXN/+OZWP/jmGb/9ObZ//z7+f+Tk5P/AAAAAAAAAAAAAAAAAAAAAJOTk//7+Pb/9u/o/+/JpP/rsmz/6q9e//blz//ln2D/56dn/+OaZv/79fH/k5OT/wAAAAAAAAAAAAAAAAAAAACTk5P/9OTa/+qxd//prmX/6Klc//PZvP/69fH/9ujb/+WhYf/oqWn/45tW/927qf/5+fl3AAAAAAAAAAAAAAAAk5OT/+3Enf/mpWP/5qRY//DOq//37ub/9eja//fu5P/04dH/5qVa/+mxdP/knVn/+PX0fAAAAAAAAAAAAAAAAJOTk//15Nz/5qh0/+aiXf/knFf/8tW8//r28v/3697/6a1l/+q0cP/op1z/3b+q//b29nkAAAAAAAAAAAAAAACTk5P/+/j1//n18P/swKH/5J5f/+OZUf/14c//67Rp/+y6df/qr2//+fPv/5OTk/8AAAAAAAAAAAAAAAAAAAAAk5OT//z48//58uv/+fbw/+zApP/fiEL/9eDN/+y2Zv/rtnH/9uvh//n39P+Tk5P/AAAAAAAAAAAAAAAAAAAAAJOTk//9+fX/+fHo//rz7P/69fD/+fTt//r38//38er/9vDo//Xu5v/9+fX/k5OT/wAAAAAAAAAAAAAAAAAAAACTk5P//fr2//rz6//68un/+fDn//jv5P/47+T/k5OT/5OTk/+Tk5P/k5OT/5OTk/8AAAAAAAAAAAAAAAAAAAAAk5OT//37+P/79e7/+vTs//ry6v/58ef/+fHn/5OTk//Bu7T/v7Wr/72wov+Tk5P/AAAAAAAAAAAAAAAAAAAAAJOTk/////7//Pfx//v17//69O3/+vPq//rz6v+Tk5P/8+HO/+7WvP+Tk5P/jIyMMAAAAAAAAAAAAAAAAAAAAACTk5P////+//z59P/89/L/+/bw//v07f/79O3/k5OT/+7WvP+Tk5P/jIyMMAAAAAAAAAAAAAAAAAAAAAAAAAAAk5OT///////+/fv//vz6//78+f/9+/j//fv4/5OTk/+Tk5P/jIyMMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJOTk/+Tk5P/k5OT/5OTk/+Tk5P/k5OT/5OTk/+Tk5P/jIyMMAAAAAAAAAAAAAAAAAAAAAAAAAAAwAMAAMADAADAAwAAwAMAAMABAADAAQAAwAEAAMADAADAAwAAwAMAAMADAADAAwAAwAMAAMAHAADADwAAwB8AAA==",
            "items": [{
                "name": "syntax_none",
                "caption": "No Syntax",
                "input": "radio",
                "enabled": true,
                "id": "none",
                "handler": dlg.handlers.syntax_handler,
                "checked": dlg.createSyntaxMonitor( 'none' )
            }, 
            null, {
                "caption": "JavaScript",
                "id": "javascript",
                "input": "radio",
                "enabled": true,
                "handler": dlg.handlers.syntax_handler,
                "checked": dlg.createSyntaxMonitor( 'javascript' )
            }, {
                "caption": "Php",
                "id": "php",
                "input": "radio",
                "enabled": true,
                "handler": dlg.handlers.syntax_handler,
                "checked": dlg.createSyntaxMonitor( 'php' )
            }, {
                "caption": "Css",
                "id": "css",
                "input": "radio",
                "enabled": true,
                "handler": dlg.handlers.syntax_handler,
                "checked": dlg.createSyntaxMonitor( 'css' )
            }, {
                "caption": "Html",
                "id": "html",
                "input": "radio",
                "enabled": true,
                "handler": dlg.handlers.syntax_handler,
                "checked": dlg.createSyntaxMonitor( 'html' )
            }]
        }, {
            "caption": "Line Numbers",
            "id": "cmd_line_numbers",
            "icon": "data:image/gif;base64,R0lGODlhEAAQACIAACH5BAEAAAAALAAAAAAQABAAogAAAP///wAAAICAgMDAwP//AAAA/wAAAANMOLoL/mCEWWYgAzpZDL1BBkmGUU1CKoxB903E+kiBWbeXvOFvzl4nXIw1MHAsw9nN80nubjyfsuTxVJyRaBA7IHi/YB1ARS5rzmhHAgA7",
            "input": "checkbox",
            "enabled": true,
            "handler": dlg.handlers.cmd_line_numbers
        }, {
            "caption": "Print Margin",
            "id": "cmd_print_margin",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAFdQTFRFAAAAAAAAOD5HCmCyns7kos/lpdHmqdPnrNXos9jpttrq0dXcutvr3ODl6Ort5PH45vL47/Dy5/L45/P46fP48fL16vT56/T56/X58/T29fb3+Pn6+/z8JW19UgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH2wEUFRUpOdyw1wAAAHVJREFUGNN9z9sOgjAQBNCdpUgL4gUvoPL/3+nMQoyRxJNNHyazLZi5/fCqsu8xnwjTSo2UEoC0UKMm1CsFR4KOHWnFvYk5NaTGeZGHnJEVdOHmF14NrfTh6ddSUNQ4hFd7b0nBI8w+7kkrfCfm8+mbn6N/wRuOzgY5F0/22QAAAABJRU5ErkJggg==",
            "input": "checkbox",
            "enabled": true,
            "handler": dlg.handlers.cmd_print_margins
        }, {
            "caption": "Word Wrap",
            "id": "cmd_word_wrap",
            "icon": "",
            "input": "checkbox",
            "enabled": function() {
                return !!dlg.currentFile;
            },
            "handler": dlg.handlers.cmd_word_wrap,
            "input": "checkbox",
            "checked": function() {
                return dlg.currentFile
                    ? dlg.currentFile.wordWrap
                    : false;
            }
        } , null, {
            "caption": "ReadOnly",
            "id": "cmd_readonly",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMAUExURd/f3+zs7PT09P//q+np6eLi4tjY2ICAC+7v7/X09dTUANvc2/Hx8vHx8eLj41NTAMTEAPz7+7KyAFJSAPz8+/T19GlpCTw8ALGxABYWAOLiz6+vYZmZQdfY1/Ly8lZWAOPjL/Hy8TExDPLx8fLy8fT09enp3+Pjmf7+2unp6KysS+zr68PDjFlZI09PPdjY11VVUb+/APv7/OPi4vf29/z8h/DwmN/e0tPTAO/v75iXd+7v7qKiUsrKm39/Ejg4ANPUuLGwr+zr7Obm5isrH+jp6DY2AJOTM6ysAPb39tjX15qaN1paE8zMyMPDAN7f3+jo6fb291dXAGBgCyEhDoKCC/j5+Y+PONDQQtnZQLOzZd7d2fn5+Obl5Tk5AE9PANHRANPTsqSkU0NDJOnpoPv7+/n5+dTU1IGBgTAwMGpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///+SBDpcAAAD+SURBVHjaYshEAwABxJApIvgbDARFjIBkJkAAMWT+/BkW8xMOMgECiCEzsBEEPMFko0kmQAAxZH5R/fKF88sXKXc7K05R0UyAAGLI/PiJh0flo1qUgUuQo7JiJkAAMWRag9Xq6PlyaIVwvM8ECCCGzDdAoO1kK+mQKK0U/SYTIIAYMgNear58ae4dzM4eKqbrmgkQQAyZsSAd4RrMQGDq9iwTIIAYMvke8T0yTlL3EBKSiIh7lAkQQAyZ90HAJsVQQMAv0t4/EyCAGDK5QVpkzBK4uCwUxLkzAQKIIfOG/g1ZL594fmFhfvnkG5kAAcSQeQUFZAIEEAO69wECDAAUjXLoAg/XDQAAAABJRU5ErkJggg==",
            "shortcut": "",
            "enabled": true,
            "handler": dlg.handlers.cmd_readonly,
            "disabled": function() {
                return !dlg.currentFile;
            },
            "checked": function() {
                return dlg.currentFile
                    ? dlg.currentFile.readOnly
                    : false;
            },
            "input": "checkbox"
        }]
    }].chain(function() {
        dlg.menu = this;
    }));

    dlg.tabs = $export("0001-tabs", (new TabPanel({
        "initTabs": []
    })).setAttr("style", "top: 5px; left: 3px; right: 3px; bottom: 2px; position: absolute"));

    $import("0001-dlg").insert($import("0001-tabs"));

    setTimeout(function() {
        dlg.paint();
        dlg.ready();
    }, 1);

    window.notepad = dlg;
    
    dlg.closeCallback = function() {
        
        if ( dlg.closeNoWarn ) {
            
            try {
                if ( dlg.realPath ) {
                    
                    requireFS().dde_kill( dlg.realPath );
                    
                }
                
                console.log( "Notepad: DDE unregister completed successfully" );
                
            } catch (DDEException) {
                console.warn( "Notepad: Failed to unregister from DDE system" );
            }
            
            return true;
        }
        
        var unsavedFiles = 0;
        
        for ( var i=0, len=dlg.files.length; i<len; i++ ) {
            if ( dlg.files[i].modified )
                unsavedFiles++;
        }
        
        if ( !unsavedFiles ) {

            try {
                if ( dlg.realPath ) {
                    
                    requireFS().dde_kill( dlg.realPath );
                    
                    console.log( "Notepad: DDE unregister completed successfully" );
                    
                }
            } catch (DDEException) {
                console.warn( "Notepad: Failed to unregister from DDE system" );
            }
            
            return true;
        }
            
        DialogBox("You have " + unsavedFiles + " unsaved file(s) opened\nare you sure you want to close?", {
            "childOf": dlg,
            "modal": true,
            "caption": "Confirm close",
            "buttons": {
                "Yes": function() {
                    dlg.closeNoWarn = true;
                    setTimeout( function(){
                        dlg.close();
                    }, 10 );
                },
                "No": function() {
                    
                }
            }
        } );
        
        return false;
    };
    
    //dlg.createFile( "New File.txt", "function( a, b ) {\n\treturn a+b;\n}" );

    return dlg;

}