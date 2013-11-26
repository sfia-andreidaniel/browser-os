var MMC2_Snapins = MMC2_Snapins || [];

MMC2_Snapins.push({
    "name": "sessions",
    
    "create": function( placeIn ) {

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
            "appIcon": "data:image/gif;base64,R0lGODlhEAAQAIQRAP9RUv+ezjFhnABhnGPP/wCezpSWlJyeY62ulM7PnP//nP//zv/PAM6eAJxhAM4wAJwAAP///wAAAP///////////////////////////////////////////////////yH5BAEKAB8ALAAAAAAQABAAAAV/4CeOpAg8ZSo2ASQWcDEgNN0wjoRIBSEnkcgi0lDkZLxfcLG45QSEAW8ANFiLOcRCIKUGDUScbpFICHRL8CEnIS8QBjQTLBFKEu9EXDsP2skJcGN9S3eBejxMCwaKC3cIgWcwTBKVlpAIApI+THhlmFBnA6MFVqZWmpqWq6ysIQA7",
            "caption": "Sessions",
            "closeable": false,
            "maximizeable": false,
            "maximized": false,
            "minHeight": 50,
            "minWidth": 50,
            "minimizeable": false,
            "modal": false,
            "moveable": false,
            "resizeable": false,
            "scrollable": false,
            "visible": true,
            "x": 4,
            "y": 0,
            "childOf": placeIn
        })).chain(function() {
            Object.defineProperty(this, "pid", {
                "get": function() {
                    return $pid;
                }
            });
            this.addClass("PID-" + $pid);
        }));
    
        dlg.handler = 'vfs/lib/mmc2/handler-sessions.php';
    
        dlg.grid = $export("0001-grid", (new DataGrid()).setAttr("style", "top: 4px; left: 1px; position: absolute").setAnchors({
            "width": function(w, h) {
                return w - 4 + "px";
            },
            "height": function(w, h) {
                return h - 7 + "px";
            }
        }).setProperty("selectable", true).chain(function() {
            this.colWidths = [33, 141];
            this.th(["Id", "Name"]);
            this.setProperty("delrow", function(row) {
                //What to do when deleting a row
                return false;
            });
        }));
    
        $export("0001-toolbar", [{
            "name": "Edit",
            "items": [{
                "name": "tlbutton1",
                "caption": "Add",
                "id": "cmd_session_add",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAVbSURBVFjDxZfdbxxnFYef877vzHh3HdupE6f5QEmRkyoqoWodmxYBlUiQIspNuUJCiBuUKyQEojfARRC9A4SQuOo/gPgQqrgorWjUoBJQRERLlTrOR0lNUNI6tR1/7Hp35n3P4WI2TiwkJAutOqOjmd2Z3fPMOef3mxkxMz7KJWz3B1997UtPPjp29MXZ5TeP/Gvt2g7vHRPNPSufefjE9VbR/O7pI98/t53/c9s5efpXk5947uBXLnxt8vTUU7ue2VFFJVbKZOvo6Mm9z019etepsz986/TMwCrQlObPljtLIdMhpiZm2D+yF4CGa3GweZg33n/FrXbaPwU+OxCAD9YWpt/49zkmHzrMavMyUvQA6HKHs7d+z6vzv+NGe+7YwCrQLXuj52/+ieMHnmTMp60H0wqXPnyTzLvRgQGkykCUUks2qq0AIUVSZbhtqmpbABoVEUdKykYstxwb0ooUEzJIGWo0ECOp0q1KHswWUiJFQ9DBAaQ+QNREqso6fx+i0EhKhsgAW5AqQ7yhapSx2lKBqPH/q8AL51/44jsL75w5d+Pco3dWPhhx6nAGDoc3wTnBi0PVUFPKVAPcY4gpolFJCFMv7reQOTLvCZknC44s9+xuTqw+vmf6yqEdR898+ZFvvLzphKd+eWpmsbP40oHhA9MTxcSIprrflgyNhva3KRqalBgTZYpUKT0QJaqKJiMlJUUjaX1+svq74TA6Mup3T6+Wiy/9eO6bMwBiZhz6xaE/PjHxxMmn9z0NklgplzEzTAyj7ruZYSREoNls8H56D9cfAhHYHz5Or9fFu0Bw2WZ4H8hdoPANMgt4l5jvznK7vH7255/6w8kAcHPl5nEqmN47xezaRaLEujb9cAhOBO8cTgRX1p9F6uRiMF9exQRM64olrdVSuAYt2cm1hRu8OvsaP3jm29zSOVa5M7U5A6o6Nr84z7XFK7Rlo07s6+Qi1ImdYOY2QUzuQ2wuZigQJPBwYx8rG22uLr3L6zd+Q1XWw3l1aY52cYs8c2P3h9AAhW7Zo+erGkBrCOcEb/Ugmrk6OYZ3giE4hNwPMV7sBoRu2WVhfYHf/vPXrPXadMoKJw6cgkC0SEqKBuFBgLsoY8trd7nSvk5WBLIiUOQFjaKgVTRphQYKOFMwh4ijkALVyGq5xNydv9ONPaIqZUrgEsF7gk/41JeLQB4C62Yk1bsPyvA8yrPn5/7KY/seo+pUsFG3oBRBfZcNqQhBCN4zNOK4zbsUwRO8x4vjY9kkvZiw/txoZqSGEq2WbTJlODRYTO+hzlCzv9wHiDwPnFjfWB+6cPkCVP0WWE0tQj18ThAvfO6pGbKdntwH8uAJztFdq/jz238jBEfIHD6rt/ciyzxruSfPHSEPG9Hi85s+YD+yyyjTwOso6yTYjAiWQBOo1vsxVQTnyLwjD54iCxgJM1CMZIb+VyhqtpLMXlGz4y+fuja7xQntJ3YJ+Pz/tM2vOzOpXc+JELwj954iBHp1ApwJ899bloE8E2qqdV5pVRsUtSTz4IG4ebUDuxmZGmZCr6qQlEhaX7X03ejeOtDHclPYiD2sjHhX4l1tSO1S+3YyaAAxOmWXslsSVelVkbVuj24nQ8X694dBAfTNZL3qou0e7V5FEXwtz3aOOcWcGxxAyH17pFG0dvmCq52V2qadIAgHq0MMq9G1ztrA3owaw9k/ju3dxbPjD3GsGsctelhyHPczHLHDtBhG1F0cGEBrvPjWI3uKuHPUs7vVQlPCVHl8/JO4wiO5K4X0nYEB3D5z96IbL79wM7O3P5RyXRuGDRm+4btFI79UMHRi4Uz7rW2N1Uf9ev4favDa6KZqqaUAAAAASUVORK5CYII=",
                "handler": dlg.appHandler
            }, {
                "name": "tlbutton2",
                "caption": "Edit",
                "id": "cmd_session_edit",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOgSURBVFiFtdfPb9tkHMfx9+PGSZakWZaydVEpS9eqh6hU1QSMSlPHEBpT+SHxQ5vQBGhCYleEuHBY01aDsl3YP4C0CxIC0QtnxLhUQiJ02hjt0uxC82OFrc2PJlmTOOZgp3VNksZt+khf+fETy6+P/Ty2HKGqKkKIAWCY/W13VFWNmQdt+nZYVdUf91MXQrwDNAwAwHI8gRACIQSSJPS+ZOibSjvxjmW325md4fza996zTxYGPw2Efy/UTMmUsu24EIL16BSnT3LB3q9e9r98+MHqZydCDQO0Gy/ErrIRn8Th9eA6dhnHYOmo80zy59TUc67/BWg3nl+6SiU1jVPHhTKPko5QKK4cLTiiXzeYgjbhsS9QHk5rVx7U8UyEtbsZHsdhuZRL1gnQRjw5hcPrwW3CV5OQyjL50oQ61WQK9oJ/SaUOnv4zQzoJiTXCNbzhU7AnPDGpzbkRv5chk4TlVcJnwur0totuGsASPrMNl6rzVDMR0n9lyCXhpwjfmfHmASyt9hkqibC24Pp0PKvhhRQkDn3MJzf5wYw3DmARL+u424w/hNiBS8gDH9WzGwSwhH9FORHGacYXNHxRfh9b/yVkWW4xgFU8PqHhx7fwzKKG3xMX4dgHyLKMzWZrwLfyFNRdcNcoxye0227E72tzfke5QKXnvU28s7OzYYBt0Vq78muU41dweD14+nU8t4VHNt6l0nMejyxjt9vp7e2lu7u7PQHyS9cpLV/BeXA7nr2v3fbf8m+x0f02Hlmmq6uLUCjUdP4tBfj37g2kfyZwmfGohs+l3yD/1JscdDoZGhoiGAyiKAqlUqnpGmgpAMDi7QcEA6c5MnBiC1/S8F8fjZP1vcbxnh5GR0dxu92beLFYxOVy7T4AwJP1xxz2+1A6xoj+8YjB/gi5mDbnv6y8Stb3OmOnThEKad8ZRrx2jl0FqLVUdA6//xClskIu42Vh/ll8uTlurZylo+9DLo6Pb650My5JEs1awwDGsW++neXcyWc44jvAehH+Tg9TyAcInfuckZGRzWPr4bsKYNwHqKiC2VtRXhl7Ef/TLxB6vo9AIIDH49kRtxygXv/6jZtNf2+G7xSg7q/1oN3ilgO0G7cUYD/wPU1BO3BLi7DZK9N8nM1ma/qGa7UJ079jCejQg0mGbYdekqFA+4SoNVXfVg2l6FUFbgNLQBkoq6paNQYQBlA2lV3fOvS+3TSOjlSAkl5lQ7+2XzaMlwFFVdXqf+Ce8UC8CUzZAAAAAElFTkSuQmCC",
                "handler": dlg.appHandler
            }, {
                "name": "tlbutton3",
                "caption": "Delete",
                "id": "cmd_session_del",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATTSURBVFjD7VdZTJxVGL190JKWpSg7DPsqZX3oEqIQy1akE2gAQUBjVaCUWgs1tVIIlXSwSELaYZFioKSyFLBQItZWjcBAi7K01A4VaIYtQKQLkKb4ePzuOIOsM0Nrog88nOTm3nPOd/65373/PwwA+y/BNgL8rwPUMqZ9xdi45Zqn5/16LS1bTU2vMGbznb39YLO9fTuNdZ4pAC/+DWOSJhNDtAoDQOORBsas1RXnHM5t8duJZldnrpNwr3UF4AKC5LLWC5guEGG+oQ7XX7EGzY0SbFSEtuGcH7bb4knFV5i7/DW4R62KEKsWryZBHQknRccwn5kpx5O6Klx1tgStjVYytmI7LjBmV0VrV12sMHtejPmMDPx5+jRmLpWBe1WvEWJFgIuMNdeQYPjjd/AwLRUPUhVIS8NMZTm+dRKAOGO8oFJTzJhDAWMTTRTwQXH+PxrC4/R0PKouBffk3moDVDB2u85IB7JDcRhNTFyKpCRMlxWiwc4cZxmbFDPmmMeY03HGpktobkp8ZoVmLDkZc031qDXYCu6tNkA5NVEZNVG9hT5+T4hCf2zsUsTHY6LoCxRSwWNUOIGxhydtTCHLz4Y0Lm4F/4/zZymwKbhn+SpNvGoz0U9qXUr7ecl8G/oPhOF22FL0hodjKC8LGdZGSLMyhPTzdHTT3HLecOZHqLc1AfcqXuMErXmcSGTzJQmrzPRwN34vuvz9F/Ar4UZgIO5kHcWtzCOQBATI55Tr3UFBGEh5CzVWBuAepSpOjsozXUTdXkgNd9FUD7/F7EHn7t0LuElo8/FBK6FDMXcnOhqDn6ZjRCxCFf06XFu0yolZ11WcTwbnGBuvMNFFX8Sr6HB3/xve3ugVCiFNTMK9QynoO3gQP/v6os3fAReMdcA1+WqKa/wuIDM7Mhsv5yHeDkY7PW07Pfl1gQCNmzahkWw4OvY4oYyKc+65Rcf0uQPkkhkdt/FSY110+jvjGslWQ6e/CziHc3P/rQA59DOeIcMSEz30BLqijSQcrYQWBVoVcxw9QW4oMd0Grsl53i3gBiLeSGTYF+yBHl6A0E3oItxUoEsxp1zvC/FCkak+uDbnWZswm44OYbTQ7CVIQ7whJaoSd3kRwo/BXvgp2Fs+li5H6E4Umr8M7pG93mOYRZfGKRKKyWAwdBdkRFuMId5woT7wMjOAJ+HGvtdwfxmHYzD8dYgFxuBeWZpeRCd0NzuQYIQLZWQwRZTFmCT0hgfAz8IEfozN+jA250vjW/uD5WvL+bLIUIgtzZGjrT1a7OHhqDZApqHeYN4OV4zHCDFLy4sxQ7gX8QaCBGbYy9jjI4w5c/hTkGCaG4gIlXOW6ybiItEYHYUCR8d+DQLotn3mbIWhlAN4uvlFPCWKEsNRQkQJzBHC2CMqvPA0fBxEgWIEFhh+M2yJhnsMfZiAAidH5Orrf682AO2VNm2BRLRlC4YOv78QYix6P5IsLSCkt9/i4otD7KO1ZOJw7kLxwx9AtHUL7wNJliYfJEtCkJCnn4iLwgkrAaLo9XuUPj7W6mi+xjmZxJ2IjZRrVRVXeQyVIU7Rt6Bouz3eZWwqVYPbjXPeo4+Vml07UOPuprK42ouIC09aGv1yXE974BMNbjUlOLfSxUVW5+bWqar4xj+jjQAcfwFJI/6lgKpPYQAAAABJRU5ErkJggg==",
                "handler": dlg.appHandler
            }]
        }/* , {
            "name": "Tasks",
            "items": [{
                "name": "tlbutton4",
                "caption": "Enable",
                "id": "",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQOSURBVFjDxVdNbBtVEJ73t+v1euUkDiFOnTpUaQIcolD+hBqJikMkUuXAlUPFiQOHFHHgwKUnJO6VEBISnBAoQi4CCZQDpRFpSXBDIUlLZJK4UNWympS6jlM7G+8+5tkbe5UftUWJPdLn2d3nffPt92Zm3xIpJfhtYGDgS9M0n5qenh7CsTIcslH/CSGEzs/PD3d0dLyk63oHNMC4/wSf2O3v7/9wYWHhZKlUyjSCAN15IRqNPreysnIcGmRkZw709PQkhRAvdL1hfRyMBT79YezK7w0lMDo6emNycvKZp8/EwDoWhOBRbbHslL+xHfvCxTf/SErYccNBExgZGbmeTqefDZxykIABgW4BttwCBwtCMJYRnCQ1wVMaJynOaSqoQerzU79mD4xAPB6fdRznRMtpAWaPDno3B0klBqeAAUFwBtq2FzW/rgmW0jldFoKXdEGpLhjheBP+l3q5hiB5x4GP3juSSO1ZBcqGhobMiYkJ2HIANh0KOlEBWTW4R6JKBH3lnChvIZ5nCM4IoAeqxvDYM5dI8hkh/IOzR8ZX9y1DZUtLS5udnZ1gw7+VCfDJgItqsLoKPiLMI+IFrgKPKQFKkICEK/g7NhZNzD60DygrFosyk8nAkyxYkVd4cnNWf+LKdeYLzn0EGdm+lpGSvP9uNPHFIzciZYODg0Yul8PJoBJcKSAQzJu4pgKjNXJ+Iii1XLx8N31t9vZXrceCuYX+k/Hu14ZvnYNz7qP2gWvYhgeN4RJE+kIQOW5WJmY+qf35UE9KCjd/uQdzF9fAiUpoP2FCOKQjNOXtlpB+M2wGvhacn3/nifHsvgrEYjF9bm4O+ljEU0AFqivgx3YuZK8X4NZvD0BaAjpPt0PezgNWgbrXxdK9LARN4P0XzkYTfz90CSzLEpFIpBagkoSKACWeCnUit6/eh+yfJQh0WhB+uRXymwW4b+dt09B+NAIiwQ327SevTN55rBxIJpMlXAIMEPTkrVYBo9XsxlWG9NRd+GdxHYy4CdaLQXtTFq/m1nNTmoApq9Wa/P716fz/eht6SRiamZkBTkM1BWRZQmY+5+YyxXuFTXtBxLTZ8KshbCbyxoNCNvnTW+nSgbyOla2urrptbW2gmfyOGRbfBTQxbpotl86/fck+lLeRqgI/urq6/gqHw6o0zJ1jh4Fd+4He3l4DGmh0j1a8ZRhG8whgBXDVCVWTagoBXH/RVAWWl5fL8mA3PY9HALfk2sbGRvOWoFwuk0Yuwa5GtLa25iKJ5imAS6C7rtswBXbtB/DzTO3Z2lVB4Fi+4Qr4rpGm5ADaz4g+xFFPDZWRGoJ55LaJKencHXD28PtCfYvutQQWujZEwQuse0RZfX+/Sx3pTbqlCsmD4/N+1AhibPkf/X+/BxJQOLEAAAAASUVORK5CYII="
            }, {
                "name": "tlbutton5",
                "caption": "Disable",
                "id": "",
                "icon": "data:image/png;base64,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"
            }]
        }*/].chain(function() {
            dlg.toolbars = this;
            var toolbar = dlg.toolbars;
            if (toolbar) {
                toolbar.setIconSize("normal");
                toolbar.setButtonLabels(true);
                toolbar.setTitles(false);
            }
        }));
    
        $import("0001-dlg").insert($import("0001-grid"));

        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);

        dlg.DOManchors = {
            "dummy": function(w,h) {
                this.width = w - 6;
                this.height = h - 2;
            }
        }
        
        MMC2_Sessions_cmd_refresh( dlg );
        
        MMC2_Sessions_cmd_session_add( dlg );
        MMC2_Sessions_cmd_session_edit( dlg );
        MMC2_Sessions_cmd_session_del( dlg );
        MMC2_Sessions_grid( dlg );
        
        dlg.appHandler('cmd_refresh');
        
        return dlg;
    },
    
    "activateContext": /^grp_sessions(\:|$)/
});