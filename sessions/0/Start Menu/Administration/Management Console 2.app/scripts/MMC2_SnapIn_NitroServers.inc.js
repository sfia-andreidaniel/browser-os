var MMC2_Snapins = MMC2_Snapins || [];

MMC2_Snapins.push({
    "name": "nitro_servers",
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
            "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90DEhIaFR2WKbsAAAIeSURBVDjLjZLNS1RhFMZ/78e986Fj4VclSlCGbSejhYt24+BCjJYpUrSq/gDbtGnhQCWouMhEqIhqK5ShiwRFK8iNGyMbxMZGJpNMr83cmbnztmkxODl2dufwPD/OcziCf1R7e5Tp6SnC4XM1nZ2dN41hfXfXWVxe/pSamnqd4n8qGo1emZ2dSyWTSbO2ljArK3Gvv39oC2gq1un9xkikvS4cbn3Y3d1zuaamllyuQD4viMe3ZDZLNXAMSBwI6Orqet/RcelUOu0ax8mIvb0MicR3pNQEAj4AU3aDUKjqRGNjPUIglpbirK5uUFERxO/34fPZJVFLAK6bY35+iYaGWkD8NdtYlkapEjly/0AIyGbzpNMuILBtC60VlqVQSh4O0NqitbWF+vpqpASlJEpJtFZorQ6PUCgYlFLYNhgjkFIipTRaK5HL5Q4H7OykTSKxic+n8TwPwASDATEz89YbHr43CqyUBWit3FDIH0SCt+3hui5jYy9+jIzE7gKjQLZYXxLKcZy5hYV5a3tnu9kYab+ZfOWMjw/1eJ73HPDKvm9v79XitvrJ05dfHgw82gJOH+QR+wd9fbdvBQPBfFU25bt2wbmz+dOpfLbovy/rzq5nMr/tWCw2UhYwMTFpmptbkL/WOXPkA0pIPjvnyQebSG58IxK52Aa8O/CIg4MDN5xdp+Go5+rrJ7+2ZfJUPl47/nHPX5UqFDwL2CrW/wHzpcurnnMxSQAAAABJRU5ErkJggg==",
            "caption": "Nitro Servers List",
            "closeable": false,
            "maximizeable": false,
            "maximized": false,
            "minHeight": 50,
            "minWidth": 50,
            "minimizeable": true,
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
    
        $export("0001-img", (new DOMImage({
            "src": "data:image/png;base64,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",
            "displayMode": "best"
        })).setAttr("style", "top: 10px; left: 10px; width: 32px; height: 32px; position: absolute; border-color: transparent"));
    
        $export("0001-lbl", (new DOMLabel("Available Servers in your cloud")).setAttr("style", "top: 20px; left: 50px; right: 10px; position: absolute; text-overflow: ellipsis; font-weight: bold; font-size: 1.3em"));
    
        $export("0002-lbl", (new DOMLabel("A Nitro Elastic Cloud server is a network node capable of doing work for any of your scopes in your company.")).setAttr("style", "top: 55px; left: 10px; right: 10px; position: absolute; text-overflow: ellipsis; height: 40px; white-space: normal; -webkit-line-clamp: 2"));
    
        dlg.grid = $export("0001-grid", (new DataGrid()).setAttr("style", "top: 105px; left: 10px; position: absolute").setAnchors({
            "width": function(w, h) {
                return w - 20 + "px";
            },
            "height": function(w, h) {
                return h - 120 + "px";
            }
        }).setProperty("selectable", true).chain(function() {
            this.colWidths = [40, 80, 44, 240, 40];
            this.th(["Server ID", "IP Address", "Status", "Working for...", "Roles"]);
            this.setProperty("delrow", function(row) {
                //What to do when deleting a row
                return false;
            });
            this.enableResizing();
            this.enableSorting();
        }));
    
        $export("0001-toolbar", [{
            "name": "Edit",
            "items": [{
                "caption": "Add a Server",
                "id": "cmd_nitro_server_add",
                "icon": "data:image/png;base64,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",
                "handler": dlg.appHandler
            }, {
                "caption": "Remove a Server",
                "id": "cmd_nitro_server_remove",
                "icon": "data:image/png;base64,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",
                "handler": dlg.appHandler
            }, {
                "caption": "Configure Server",
                "id": "cmd_nitro_server_configure",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90DEhIwK7Oc+DgAAA5qSURBVGje1Zl7bFxlesZ/5zI3j8eOx7d4HF9C4jgx8YWEDUkdSEidpBCFkL0SgaIA1Yr+kbJSUQtpt9qqCLUblo1aCcq2WdoKBIt21S6iCYQFFmggDgmxE9+dxJexZxzPjMdzv5xzvtM/ZmwSCBJxQtp+0tEZHX1zvvd53+d93vf7Dvw/H9I3+fJ7790hpdPph202+19LkpSIRKKdpim6TZNzyWSir7v7TBDQ/08C2Lp1W52maX/X1NT0wJ49e7BaLfT29uH1TuD3TxlTU5dmZmcjp7NZ7aQsS33ZbLb75MnjFwENMP9XAWzZsmWXzeb4xx077q35wQ++j9PpxDRNFEUhk8mQzWYJBoP09w8yOjrG1NQ0k5O+1NTU1Ovvvnv0ABAEsl9nLfVGGt7RsbVB17WfrVixcucjjzzCqlUr0XWdZDI57ytJklAUlaoqD7W1dYBJMpnm97//1PHLX754D/Bb4DgwfVMBbNq0aZ/FYvnb7373e0t27NiBy+UimUxhmmbe+MtZkXum6wbxeIqBgQlCoQRCCCvQAJy9aQA6OjqaNE17qrW17aHdu79DS0srmqYRjycvY+mVxkuShCyD1xvg/HkfmYyGxaIiSUiAFZC/7vrXBeDuu+/+Y5vN/tNdu75dct9992O32/OGm5ell3nFXZZlDMNgdHSaiYkAkiRht9swjCySJHEtCbxgAB0dHUs0TXuuoaHxew888CArVzahaVkSieRVDP+cMooikUikGR29xMxMDItFRZZlVFVBluUFaco1A9i2bVuHqqr/0tGxvW7nzm/jcrnyhl+N659TRpIgFIozNnaJTEbDarWgKFI+qRVUVbk5AIQwntq374d1HR33EArNEosl5tUlxwDpCuNlWcY0BVNTIQKBCCBhs1nzeSAjyzlVUtWFsXkBAFCXLPFQUlJAQYGFRCJNNJogkUhjGCLPcylvoEQqlcXvDxGNJlBVBUXJ0SXn+dx97nk+B75ZAJIEup6r/jabBZvNgtvtIpXKEo8nicfTeTAG0Wia6enwvMooipI3Ouf5uQjkANykHMgt8uWFHA4rDoeV8nLQNJ3+/jFGR6ewWJQ83+V57+eMV+YjpSjy/O9rHfK1RyDnsUBglt7eEZLJ9Jfm5LwtY5omqqrmDcwZPwdEUaQ8ECmfP/LNyQHIAQgGI7z++u/weMpYvryGZcuW4PGUYbWqV8zLGS+jKNJl/CdPo9y8uXxZgD8XBkDXBZWVbu65ZwPhcIxLl8KEwzEqKkpYvrwGj6c0n8wKsqzkvS7PJ+2cwXPKdfnzm0AhUFUFvz/IyZO9KIrC6tVLaW1djtPpmKfUnGE5quQoNGe4LH8uu3MRWWgOLDACOqWli/B4yvF6p/H7gyxZUkFlZSkuVwGGITDNOZrI80n6ude/+FvOV2JujoyCRCQSR5Zl1q5txDAEmUyWYHAWVVUpLS3Ktw7yvOZffl0NSO5+U5JYRojc5mRkxMfUVJjKyhJuuaWaxYudOBw2DMMAzCuU5vJqPXfNUelz+tyUQiaRzWrccouHvXvvJRiMEApFmJ4OE4+n8HjKWLSo8DKDcwVqzsNzajMXgZ6eTmZngwC0tTU633jjG48ACGFimuB02nG5CqitrSSZzFXgXLss5lvnOW+bpsDv9xIOT7NiRSsOhxNJkohGwzz22GPYbDYOHTo0b8+zzz5bC/w78A7w3BNPPJG6ISoEMqYJQgg0zSCT0dB1A6vVQkmJC5fLga4LhDDnVUXTspw9e5zS0gLa2lZz4ULv/KbGNE2SyRSJRDK/e8u3gab5fHt7+6Y1a9Y8bZpm78GDB2tvGIVMUyBE7sotxvzipgmKIi6jkEQ2m6K4uJANG/4A0xSEw2GGhrowDB1Ny6LrOrqus3LlKvbv3//9oqKixubm5h0tLS1Ikszk5ORSn89XDYzfEBnNRcCcp5IkmeSwmHkgVwbW5VrExITB4OAAHk8169dvYHh4GIvFgseznWw2dwBxxx13UFNT05LJpFsaGlYQjyfw+31MTk6+9eSTT35yw3JA1w10Xcz3/IaRMzx35fieTMaZmfFTWbkEkCgr83D06FEefPAhdF2jvr4O04RsNoOm6XO0wePxIEkSqVQKwzA4cuSICfwG4JlnnlGA3UDXgQMHzgMo12r8ihWrHq6tbahzOIpIpdJX6PsclYQweOutNygtLaS/vxvD0JmenmDz5rtQLRY0TWd83Mu5nh5Of3aaU5+e4ty5c4yOjRIIBslms1itVnTDoHpJtXR+eLh0y5YtLtM0n29sbPzTQCBw75YtW1587733jAXVAVVVMQyR38wksVpV7HYrDocNVVXo6+tm5coVbNq0iXA4TE9PD62td1JQ4CQajdLX10ciEae8vJzWllaKiooAiEajBIMB+np7GBstpKmpCXeJm127drWPj4+3r169mrKyMgoKCpafOnXqceDggihkt1twuRyoqoQQIg8mQyqVQVUVfD4/lZWlBEMzyJJEc3ML6UwmD+YcBY4Cbv/WOlRVna/UACVuN8WLFlFXv5Tzw8N0n+1m9epm3O4S2tpuQwhBaCaMJEkIIdYtOIltNgtOpx1ZJq9GZp46OTAtLes4c6aTzs5/Zvfu3SiKgmEIhgYHKXK5qKurR5FlZkJBvF4vfr8fgKqqKmpqaigpcbNs2TLGxkYZGhxk1apVKIqCaQp6enoYHBw8DDy1UABqYaGTkpIiFCV3uiaEgRD5UwlTRpg6ra13IAQMDg1RX7+USCSCIQRVnmqEaTI2Nso777wzFIvFXk+lUr+qqalJRKPRrYODg3vWrVu3ucpTTZWnmvPnzzMdCFBcXMzY6Cj9/f0/ffrpp//iOlTIDJ48eQqXq5Da2pr5tiGb0QnGgiTTEcqLqrBYVFKpBJWVJeiaTjwWo9pTjTAEodkQx44d6x8dHf3LN9988ygwt637xYEDB06fOHHi2bvu2rzZ5XJR7akmHJ7BWeDEZrMhhLiioF2zCqmqpW9oaFA9fryz8uzZnsLx8QlJkqC6ajEZW4xXfv2vnHjvBL29n1FbW01tXT3pdJrZSASnM9c+jIxcwDs+/rNXX3313754Cv3RRx/529vbbYqq7Cxxl2IYBpFIFIfDQUmJG1lidWNj4082btz4k40bN26/5gj09589DzwHHB0YqL3z44/L1775ZvXKpqam8ubVt0pZv8mPf/xXJBJJpqcDhEIhtGwWu82Grmkosoxv0ofdbn89/y3gKr2WeNs36WP5sgZ0TcNus6Fls6Qliba2NWzbth2ns4CDBw9uWIgKpYARIODzjff4fOOevr4zNUNDPRs+/KDito6t7RsmfX6i0SjJRIJ0Jo2u67hL3cTjcRRVQQgDi8UivmoBw8jllW7oaLo2/18Tk5mZEOlMmiKXC13XF1SJTSCTv2aACSFEv9d78ZTXe9Fz25qVf//iP71wO0B9/VKWN6zAMAQOu4NweBZJyrK4qoqhwcHtwC++IgLbF1dVkclk0TQdh91BJBJFlgXd3d2Mjo7MTX1D4fqHDiTyYKa6urp+LctycMeO+7bGYjEMw8BqtVLoKiQWi2MYBsXFxVy8eMG1fv36ns7OTv/lL3v88cfXmqb5Zy2tbfWalmNYYaGT2dkIoWCIgYH+1w4dOtR84sSJvzlx4sRrN/ILjQCSQHKxpyZUvaQOYZpkMik0TScSiVJbW8vw8HmczhI6Ojo2Hzt27Nn9+/e/Crydf8d2IcSebdu2bbZY7SQSYRoalhMMBtF1A03TEEIkrkuFvs5ov23VHyZSmW2qRaaqykMymSQWi1FZWYHDYScYDFJRUUFLS3N9QUHBzkQi8SO73f6jlpaWnXfddVe93e4gEAhQ7fFgtVi4eOEiQgjcbjd2u3XN0qVL29etW/fJp59+OnPNm9CHHnqoJhaLWa78iJEbWSGJJvusy+12v9+8Y1/p4ioPo6NjJJNJTCGw2e00N99KMplifNxLaambivJyCgtztSQejzMdCBAKzVBbW0NBgYNz53rJZDJIkoTD4WDp0jouTV3iyJH/euuFF16455opVFpa2tnevmnR1U4QsrKVW0Y+UJxql3XQ58flWkRkNsLp0520tq7FNKHrzFmam2/l9rVrmJ4O4PP5SaXS+fNVO8XFxSytrycSidB15iyappHNZjhz5rRYs+Z2OVFezuTkBEKINxZUicvLK4r37t3rkOVcb3Jll2dB/08NZeS3fBwc462Ri1SVu9i3ZyvvH/kNrto7kTMqH350nJqaJdTV1dLcvBq3uwSAmZkw/qkpurrP4vVOoKoqQuh0d505Drxw6tTJ71y4MLw7HA6fnlOwawaQSmXE0JA3/+Hiyq8xwlaIfTxMbTzLn++1Me2T8ZRZwHqeqNvLx4FpyisWY5qCiYkJJrxeRL4JnDsEkPOnAKYpME1BMDCNEOJXhw8ffgV45dFHH20Exg8fPmwsCEAymVT6+/uvCkC3Oii/6GNJgYGaGsBjtUAUhGry395KalpryGSyqIrKzEwQi8WKy1VE1sjmTrItKrFYlGw2Q2lpGaYwqa6uYWxs7JGHH374+Zdeesk4fPjw4HVtKSORmdkPPzwiCyG+pGCaxcqtA/3yHatMGdkPcm5K36QNtWI9FRXlzITDjI6M4PWOC9M0JSGE1HbbWiRJYmJynO6urn673f6Jy+Xat/nuLbK7pITGxsa2/v7++4D/uO498bvvvvtHMzMzmw3DWPbF3bsJrJClRWt709urho8vMs2cTGVUOxEbcq+qylarjZMnO4c/+OCDtwHuv//+HyqKYpVlmcmJCY4cOfJz4Hd79+7NBIOBP/H7JhkYGOgCbsymfmxs7EK+YLmudhbYDerdcV5jSmsAynNraMAR81sTgWVlZWWOzz777B+SyWQw/5d97pJFVkVV53LhfWBaCPFUd1dXCuh7+eWXD3+VPf8Dfa61Q3MQiWIAAAAASUVORK5CYII=",
                "handler": dlg.appHandler
            }]
        }].chain(function() {
            dlg.toolbars = this;
            var toolbar = dlg.toolbars;
            if (toolbar) {
                toolbar.setIconSize("large");
                toolbar.setButtonLabels(true);
                toolbar.setTitles(false);
            }
        }));
    
        $import("0001-dlg").insert($import("0001-img"));
        $import("0001-dlg").insert($import("0001-lbl"));
        $import("0001-dlg").insert($import("0002-lbl"));
        $import("0001-dlg").insert($import("0001-grid"));
    
        setTimeout(function() {
            dlg.paint();
            dlg.ready();
        }, 1);

        dlg.handler = 'vfs/lib/mmc2/handler-nitro-servers.php';

        MMC2_NitroServers_cmd_refresh( dlg );
        MMC2_NitroServers_cmd_nitro_server_add( dlg );
        
        dlg.appHandler('cmd_refresh');

        dlg.DOManchors = {
            "dummy": function(w,h) {
                this.width = w - 6;
                this.height = h - 2;
            }
        };

        return dlg;

    },
    "activateContext": /^cmd_nitro_server(\:|$)/
});