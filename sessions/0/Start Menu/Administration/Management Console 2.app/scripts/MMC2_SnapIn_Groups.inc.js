var MMC2_Snapins = MMC2_Snapins || [];

MMC2_Snapins.push({
    "name": "groups",
    
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
            "appIcon": "data:image/gif;base64,R0lGODlhEAAQAPcAAKRng457rjw8i0VFfb+/3pyco3p6f3p6fa6usLe3uH9/gDg6kCwxoVFXm4iNuV5lihs2o4GOwCVHpMLO8oaj6wZAxRdQyYeYvKe86JS8+xZh1KzH7pG57Rxu0xZsyR2E8hF12hJ12mu2/3S6/xB52hF52ySX/yWX/224/3S7/3K0733A/3qlzp7Q/7bc/8Th+y2e/y6f/zSi/zWj/1+2/7Xd/8Pj/9Dr/0at9aPZ/8bn/9bu/zZ6pmDB/8Xo/069/9Tw/9b2/3ivoSFjPcr92RqgKL3yvjaINjqBOjdZN050TmmTacHNwcvTy/v8+9PU046PjjKDL1mXUnKpahyrANP3yyrOAi1pHmG8SDHOA6npl9Puyz23DXi6YGG7OGDnF5/ef7PvksDzpmrOK5XjZHbWMtnpzKjShJGzZ3eSGf//8f/+693bv//znpKNcJp6Dv/hge/grv/wvf/st9++bcWMD//GRndTCPzGVPzHWP/NatmeL+yqNfGxOvGyPv3FXv/Zl8J/DP/Qf7KGRMehZ593QbZlAraOW+nf1NFrDbyQZrxWAMmlh+Ghcv/Yu9OXcv/Qsselj//Gp6M4ALJ5XfjCpvjDqf3ayP69nvW6n/3HrsqrnPq2m8SPefrIs+SdhP+6of/JtfvNu7yflPqVcv/i2NhpStt1WO6plaxrW7tuXv+/scFYRLRyabejoOWEe/mWjbwNA81+et6CgtqUlI1mZuPKys26uvLl5ejj4/j19f////v7+/f39+/v7+3t7eXl5dnZ2dbW1tLS0sXFxbm5ubW1tZ+fn5ycnJmZmZeXl5OTk4GBgf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAM0ALAAAAAAQABAAAAj/AJs10zXqEKFCx3oJXMhwEyNEcegMesKQIa5HctbMgWOnFi1Yr24xtNWoDSBBf/iwmrUKVStXC3MpwqMnT59EoHbtUgNJVbCFbur42RNokahSlzw5irSsmRMmUtIYmnTnTaZQmixJ6oSsWZMpRohQioXmzCdOlTCRSgWs2ZIuYqqYYbOFRQBZp0wBaICgGRIvZMCE0SKEwgQCDiJg2HCBWBIuX8aUwcIjw40dL2wACcLhAZQrVKxkKeJhRYsaPnS4yKFCwq9kSo5EGVLhBw0UKUaI6IEDgkBfxIoVWPDBRIwZMmCc6DCgYrMEDDSAKEEihAUBxpzzGqZMgYEDzI4JA2sWEAA7",
            "caption": "Groups",
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
    
        dlg.grid = $export("0001-grid", (new DataGrid()).setAttr("style", "top: 4px; left: 1px; position: absolute").setAnchors({
            "width": function(w, h) {
                return w - 4 + "px";
            },
            "height": function(w, h) {
                return h - 7 + "px";
            }
        }).setProperty("selectable", true).chain(function() {
            this.colWidths = [33, 141, 150];
            this.th(["Id", "Group", "Members"]);
            this.setProperty("delrow", function(row) {
                //What to do when deleting a row
                return false;
            });
        }));
    
        $export("0001-toolbar", [{
            "name": "Edit",
            "items": [{
                "caption": "Add",
                "id": "cmd_group_add",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAVbSURBVFjDxZfdbxxnFYef877vzHh3HdupE6f5QEmRkyoqoWodmxYBlUiQIspNuUJCiBuUKyQEojfARRC9A4SQuOo/gPgQqrgorWjUoBJQRERLlTrOR0lNUNI6tR1/7Hp35n3P4WI2TiwkJAutOqOjmd2Z3fPMOef3mxkxMz7KJWz3B1997UtPPjp29MXZ5TeP/Gvt2g7vHRPNPSufefjE9VbR/O7pI98/t53/c9s5efpXk5947uBXLnxt8vTUU7ue2VFFJVbKZOvo6Mm9z019etepsz986/TMwCrQlObPljtLIdMhpiZm2D+yF4CGa3GweZg33n/FrXbaPwU+OxCAD9YWpt/49zkmHzrMavMyUvQA6HKHs7d+z6vzv+NGe+7YwCrQLXuj52/+ieMHnmTMp60H0wqXPnyTzLvRgQGkykCUUks2qq0AIUVSZbhtqmpbABoVEUdKykYstxwb0ooUEzJIGWo0ECOp0q1KHswWUiJFQ9DBAaQ+QNREqso6fx+i0EhKhsgAW5AqQ7yhapSx2lKBqPH/q8AL51/44jsL75w5d+Pco3dWPhhx6nAGDoc3wTnBi0PVUFPKVAPcY4gpolFJCFMv7reQOTLvCZknC44s9+xuTqw+vmf6yqEdR898+ZFvvLzphKd+eWpmsbP40oHhA9MTxcSIprrflgyNhva3KRqalBgTZYpUKT0QJaqKJiMlJUUjaX1+svq74TA6Mup3T6+Wiy/9eO6bMwBiZhz6xaE/PjHxxMmn9z0NklgplzEzTAyj7ruZYSREoNls8H56D9cfAhHYHz5Or9fFu0Bw2WZ4H8hdoPANMgt4l5jvznK7vH7255/6w8kAcHPl5nEqmN47xezaRaLEujb9cAhOBO8cTgRX1p9F6uRiMF9exQRM64olrdVSuAYt2cm1hRu8OvsaP3jm29zSOVa5M7U5A6o6Nr84z7XFK7Rlo07s6+Qi1ImdYOY2QUzuQ2wuZigQJPBwYx8rG22uLr3L6zd+Q1XWw3l1aY52cYs8c2P3h9AAhW7Zo+erGkBrCOcEb/Ugmrk6OYZ3giE4hNwPMV7sBoRu2WVhfYHf/vPXrPXadMoKJw6cgkC0SEqKBuFBgLsoY8trd7nSvk5WBLIiUOQFjaKgVTRphQYKOFMwh4ijkALVyGq5xNydv9ONPaIqZUrgEsF7gk/41JeLQB4C62Yk1bsPyvA8yrPn5/7KY/seo+pUsFG3oBRBfZcNqQhBCN4zNOK4zbsUwRO8x4vjY9kkvZiw/txoZqSGEq2WbTJlODRYTO+hzlCzv9wHiDwPnFjfWB+6cPkCVP0WWE0tQj18ThAvfO6pGbKdntwH8uAJztFdq/jz238jBEfIHD6rt/ciyzxruSfPHSEPG9Hi85s+YD+yyyjTwOso6yTYjAiWQBOo1vsxVQTnyLwjD54iCxgJM1CMZIb+VyhqtpLMXlGz4y+fuja7xQntJ3YJ+Pz/tM2vOzOpXc+JELwj954iBHp1ApwJ899bloE8E2qqdV5pVRsUtSTz4IG4ebUDuxmZGmZCr6qQlEhaX7X03ejeOtDHclPYiD2sjHhX4l1tSO1S+3YyaAAxOmWXslsSVelVkbVuj24nQ8X694dBAfTNZL3qou0e7V5FEXwtz3aOOcWcGxxAyH17pFG0dvmCq52V2qadIAgHq0MMq9G1ztrA3owaw9k/ju3dxbPjD3GsGsctelhyHPczHLHDtBhG1F0cGEBrvPjWI3uKuHPUs7vVQlPCVHl8/JO4wiO5K4X0nYEB3D5z96IbL79wM7O3P5RyXRuGDRm+4btFI79UMHRi4Uz7rW2N1Uf9ev4favDa6KZqqaUAAAAASUVORK5CYII=",
                "handler": dlg.appHandler
            }, {
                "caption": "Edit",
                "id": "cmd_group_edit",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOgSURBVFiFtdfPb9tkHMfx9+PGSZakWZaydVEpS9eqh6hU1QSMSlPHEBpT+SHxQ5vQBGhCYleEuHBY01aDsl3YP4C0CxIC0QtnxLhUQiJ02hjt0uxC82OFrc2PJlmTOOZgp3VNksZt+khf+fETy6+P/Ty2HKGqKkKIAWCY/W13VFWNmQdt+nZYVdUf91MXQrwDNAwAwHI8gRACIQSSJPS+ZOibSjvxjmW325md4fza996zTxYGPw2Efy/UTMmUsu24EIL16BSnT3LB3q9e9r98+MHqZydCDQO0Gy/ErrIRn8Th9eA6dhnHYOmo80zy59TUc67/BWg3nl+6SiU1jVPHhTKPko5QKK4cLTiiXzeYgjbhsS9QHk5rVx7U8UyEtbsZHsdhuZRL1gnQRjw5hcPrwW3CV5OQyjL50oQ61WQK9oJ/SaUOnv4zQzoJiTXCNbzhU7AnPDGpzbkRv5chk4TlVcJnwur0totuGsASPrMNl6rzVDMR0n9lyCXhpwjfmfHmASyt9hkqibC24Pp0PKvhhRQkDn3MJzf5wYw3DmARL+u424w/hNiBS8gDH9WzGwSwhH9FORHGacYXNHxRfh9b/yVkWW4xgFU8PqHhx7fwzKKG3xMX4dgHyLKMzWZrwLfyFNRdcNcoxye0227E72tzfke5QKXnvU28s7OzYYBt0Vq78muU41dweD14+nU8t4VHNt6l0nMejyxjt9vp7e2lu7u7PQHyS9cpLV/BeXA7nr2v3fbf8m+x0f02Hlmmq6uLUCjUdP4tBfj37g2kfyZwmfGohs+l3yD/1JscdDoZGhoiGAyiKAqlUqnpGmgpAMDi7QcEA6c5MnBiC1/S8F8fjZP1vcbxnh5GR0dxu92beLFYxOVy7T4AwJP1xxz2+1A6xoj+8YjB/gi5mDbnv6y8Stb3OmOnThEKad8ZRrx2jl0FqLVUdA6//xClskIu42Vh/ll8uTlurZylo+9DLo6Pb650My5JEs1awwDGsW++neXcyWc44jvAehH+Tg9TyAcInfuckZGRzWPr4bsKYNwHqKiC2VtRXhl7Ef/TLxB6vo9AIIDH49kRtxygXv/6jZtNf2+G7xSg7q/1oN3ilgO0G7cUYD/wPU1BO3BLi7DZK9N8nM1ma/qGa7UJ079jCejQg0mGbYdekqFA+4SoNVXfVg2l6FUFbgNLQBkoq6paNQYQBlA2lV3fOvS+3TSOjlSAkl5lQ7+2XzaMlwFFVdXqf+Ce8UC8CUzZAAAAAElFTkSuQmCC",
                "handler": dlg.appHandler
            }, {
                "caption": "Delete",
                "id": "cmd_group_del",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATTSURBVFjD7VdZTJxVGL190JKWpSg7DPsqZX3oEqIQy1akE2gAQUBjVaCUWgs1tVIIlXSwSELaYZFioKSyFLBQItZWjcBAi7K01A4VaIYtQKQLkKb4ePzuOIOsM0Nrog88nOTm3nPOd/65373/PwwA+y/BNgL8rwPUMqZ9xdi45Zqn5/16LS1bTU2vMGbznb39YLO9fTuNdZ4pAC/+DWOSJhNDtAoDQOORBsas1RXnHM5t8duJZldnrpNwr3UF4AKC5LLWC5guEGG+oQ7XX7EGzY0SbFSEtuGcH7bb4knFV5i7/DW4R62KEKsWryZBHQknRccwn5kpx5O6Klx1tgStjVYytmI7LjBmV0VrV12sMHtejPmMDPx5+jRmLpWBe1WvEWJFgIuMNdeQYPjjd/AwLRUPUhVIS8NMZTm+dRKAOGO8oFJTzJhDAWMTTRTwQXH+PxrC4/R0PKouBffk3moDVDB2u85IB7JDcRhNTFyKpCRMlxWiwc4cZxmbFDPmmMeY03HGpktobkp8ZoVmLDkZc031qDXYCu6tNkA5NVEZNVG9hT5+T4hCf2zsUsTHY6LoCxRSwWNUOIGxhydtTCHLz4Y0Lm4F/4/zZymwKbhn+SpNvGoz0U9qXUr7ecl8G/oPhOF22FL0hodjKC8LGdZGSLMyhPTzdHTT3HLecOZHqLc1AfcqXuMErXmcSGTzJQmrzPRwN34vuvz9F/Ar4UZgIO5kHcWtzCOQBATI55Tr3UFBGEh5CzVWBuAepSpOjsozXUTdXkgNd9FUD7/F7EHn7t0LuElo8/FBK6FDMXcnOhqDn6ZjRCxCFf06XFu0yolZ11WcTwbnGBuvMNFFX8Sr6HB3/xve3ugVCiFNTMK9QynoO3gQP/v6os3fAReMdcA1+WqKa/wuIDM7Mhsv5yHeDkY7PW07Pfl1gQCNmzahkWw4OvY4oYyKc+65Rcf0uQPkkhkdt/FSY110+jvjGslWQ6e/CziHc3P/rQA59DOeIcMSEz30BLqijSQcrYQWBVoVcxw9QW4oMd0Grsl53i3gBiLeSGTYF+yBHl6A0E3oItxUoEsxp1zvC/FCkak+uDbnWZswm44OYbTQ7CVIQ7whJaoSd3kRwo/BXvgp2Fs+li5H6E4Umr8M7pG93mOYRZfGKRKKyWAwdBdkRFuMId5woT7wMjOAJ+HGvtdwfxmHYzD8dYgFxuBeWZpeRCd0NzuQYIQLZWQwRZTFmCT0hgfAz8IEfozN+jA250vjW/uD5WvL+bLIUIgtzZGjrT1a7OHhqDZApqHeYN4OV4zHCDFLy4sxQ7gX8QaCBGbYy9jjI4w5c/hTkGCaG4gIlXOW6ybiItEYHYUCR8d+DQLotn3mbIWhlAN4uvlFPCWKEsNRQkQJzBHC2CMqvPA0fBxEgWIEFhh+M2yJhnsMfZiAAidH5Orrf682AO2VNm2BRLRlC4YOv78QYix6P5IsLSCkt9/i4otD7KO1ZOJw7kLxwx9AtHUL7wNJliYfJEtCkJCnn4iLwgkrAaLo9XuUPj7W6mi+xjmZxJ2IjZRrVRVXeQyVIU7Rt6Bouz3eZWwqVYPbjXPeo4+Vml07UOPuprK42ouIC09aGv1yXE974BMNbjUlOLfSxUVW5+bWqar4xj+jjQAcfwFJI/6lgKpPYQAAAABJRU5ErkJggg==",
                "handler": dlg.appHandler
            }]
        }].chain(function() {
            dlg.toolbars = this;
            var toolbar = dlg.toolbars;
            if (toolbar) {
                toolbar.setIconSize("normal");
                toolbar.setButtonLabels(true);
                toolbar.setTitles(false);
            }
        }));
    
        $import("0001-dlg").insert($import("0001-grid"));
    
        dlg.handler = 'vfs/lib/mmc2/handler-groups.php';
    
        MMC2_Groups_cmd_refresh( dlg );
        MMC2_Groups_cmd_group_edit( dlg );
        MMC2_Groups_cmd_group_add( dlg );
        MMC2_Groups_grid( dlg );
        MMC2_Groups_cmd_group_del( dlg );
        
        dlg.appHandler('cmd_refresh');
        
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
        
        return dlg;
    },
    
    "activateContext": /^cmd_groups(\:|$)/
});