function canvasThumbnailer() {
    
    this.constants = {
        "folder-16x16": {
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAFKgAABSoBd8oRkAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAMdEVYdFRpdGxlAEZvbGRlcuNZL58AAAAUdEVYdEF1dGhvcgBKYWt1YiBTdGVpbmVy5vv3LwAAABh0RVh0Q3JlYXRpb24gVGltZQAyMDA1LTAyLTAxhIsTNAAAAZVJREFUOI2lk7tuU0EQhr/ZXQixIXEEoggEuUBIXCIhkZI6JSiU9DwA4iUQD0DJIyBRRkIKr0CJRAQJkSiSYMfEx/HZ3RkafDnm4CbT7Grmn29+jXbFzDhPyKdXD9+0brS3nPhKoegedU/2D55tvvv6Yx4gXFpZvdVq37s9PPxeKTSu3cctLr//+HJ9GwUwEAzVscZK/RBiKuVo9zOp6E66DWLaxYWFjcvX1zZMM5ozZhlMQRVMKU466yEOMzl3if0J4GJjmQdPXiA+VFxZLtF0hsUBWg74srP9KKRysHJlqUWzdXUsbD9+ip7uoRrBpmyNTgMB3AXvwtLq2p27m1vo8HQsSL8P0HQ2Fo+abQow0oaFZsuXnW/k4lftpGoOsCmYGQEMcgZNWI3wfwAwBAggmCVMU0VodYDZR+e9BBEnpjOAmebJGqbyAuI8IcXCNDYwjfPt28wixSHiJcSily01/zqYnWQ1udHd43wgpH43w01cWJw2XAOohogjpUg4/rn3vNzpvRUv/6rmhCnS73Vey3m/8x/TbeMuDD8JHAAAAABJRU5ErkJggg==",
            "emblems": {
                "online": {
                    "min-width" : 16,
                    "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAFKgAABSoBd8oRkAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAMdEVYdFRpdGxlAEZvbGRlcuNZL58AAAAUdEVYdEF1dGhvcgBKYWt1YiBTdGVpbmVy5vv3LwAAABh0RVh0Q3JlYXRpb24gVGltZQAyMDA1LTAyLTAxhIsTNAAAAZVJREFUOI2lk7tuU0EQhr/ZXQixIXEEoggEuUBIXCIhkZI6JSiU9DwA4iUQD0DJIyBRRkIKr0CJRAQJkSiSYMfEx/HZ3RkafDnm4CbT7Grmn29+jXbFzDhPyKdXD9+0brS3nPhKoegedU/2D55tvvv6Yx4gXFpZvdVq37s9PPxeKTSu3cctLr//+HJ9GwUwEAzVscZK/RBiKuVo9zOp6E66DWLaxYWFjcvX1zZMM5ozZhlMQRVMKU466yEOMzl3if0J4GJjmQdPXiA+VFxZLtF0hsUBWg74srP9KKRysHJlqUWzdXUsbD9+ip7uoRrBpmyNTgMB3AXvwtLq2p27m1vo8HQsSL8P0HQ2Fo+abQow0oaFZsuXnW/k4lftpGoOsCmYGQEMcgZNWI3wfwAwBAggmCVMU0VodYDZR+e9BBEnpjOAmebJGqbyAuI8IcXCNDYwjfPt28wixSHiJcSily01/zqYnWQ1udHd43wgpH43w01cWJw2XAOohogjpUg4/rn3vNzpvRUv/6rmhCnS73Vey3m/8x/TbeMuDD8JHAAAAABJRU5ErkJggg=="
                },
                "offline": {
                    "min-width" : 16,
                    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAXNSR0IArs4c6QAAAAJiS0dEAP+Hj8y/AAAACXBIWXMAAAUqAAAFKgF3yhGQAAAAB3RJTUUH3QIBCjEhJ6sDbgAAAOBJREFUKM+Fkb1qAlEQhb/ZHUFs/MEiKUwV7KwipLW01dJnCaQNVlY+RsDS3vdIIYJNQCUq7N69Y+GFzcomTjXnno+Zwx0x/i95nz6OJIj9bjOerYuA1p86z99BtKh+vi0NwK6T04U6+eIMgOHQfrtvZBiGxzj0NMFxAqDGkDjMynA4ElYvmjRbNAB45YgnD21AJdKH7oAEgB9ceM4B0Fq8Cxko2FdlKHgsGLd/YoAS8pYBEImKeHzB/o1FaGrpDZB3goieM4cvtQFi9JQJWrofBIduJ6t5/MclvRw+5N65Ly0IVlnj94iUAAAAAElFTkSuQmCC"
                },
                "undiscovered": {
                    "min-width" : 16,
                    "src" : "data:image/gif;base64,R0lGODlhEAAQAIABAAAAAP///yH5BAEKAAEALAAAAAAQABAAAAIWjI+py+0Po5wGWGjzuxd3p3mU9G1JAQA7"
                },
                "filter": {
                    "min-width": 16,
                    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAFuAAABbgBZBNOQAAAAAd0SU1FB90CAQo5DKqt1RMAAACHSURBVDjL7dIxDgFRFIXhz0wjGo1kImEB1JRsYUrFtGq1lWgUlmAhNCb2MGohEZXmKSRPZCrN/OW5J/9pLg3/J41kHeRYYYw7LnWkC6zRxwRbdL+Vk0g2wx4VjjhhXkdQhuUkLI8wQDsmaEWyDEsMw/2MKW7Y4fBL8KaHK55BWuCBTfN7n7wA86ARsGKyDcEAAAAASUVORK5CYII="
                },
                "url": {
                    "min-width": 16,
                    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90CAQo1DAYYmh8AAAEgSURBVDjLY2AYBQMPGLELX2I0id4x3VDjmcuf/zr/Tl74vefauswsIg2YzBhT/fSLjTk31/svEgz/mTT+q0uvZly2ifPz2u5OPnTVTOgCJtF/pvk7Lud68V6Y4etvCwYxoYeM3378ZIj12c5rGNk/haAB+mrX3Laerv1/74UOw/tPvxhkhFcx8HLeZXjzUYhBU+mLM0EDXn5w+MfDfpNBUXQdw6t33xjuPpZk+PPnC8O3H6wMH75q/CdowIMnL3dxc4owqkpsZZAR3MKw/pA/w6MXIgxfvxsx3H/0cDdBA66sLso+ekbm0+8/XAynbxr8//bjM8PX7xIMO49If7i+riSfyGhkYNCPmDhZTlLI9T8Dw787Dz/svrEuN39wpkQAd6J0nZ6l1EkAAAAASUVORK5CYII="
                }
            }
        },
        "_generic": {
            "emblems": {
                "undiscovered": {
                    "min-width" : 16,
                    "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMKSURBVGiB7ZhPSBRRHMe/v5mNHUR30UCtDCRio9AIFDp0WqiDi86glIJ4WfIQHToLaacuIURQCB66CHqYQ6J42I5BQUFC2UHMMsr+IEG2ONLs+N7+uriyyuwk5O5DmM9p573fb/h+mPdmHkvMjMOMpjrA/xIKqCYUUE0ooJpDLxDZb2EymTRisVhCSnlO1/UTAD4x85JhGMu2bXtlzBgI/etLTERkmuZVANcTicTR1tbWuBCC5+fnf62urroAnHw+/2hubu5pRRLvzRck0NPTUy+lvGOa5uX+/v6EruvEzGBm1jSNpJQ8Ozv7cXJy8iuAV4Zh3LVt26lc/IA9QEQkhLitaVrLwMBAQtd12tzc9NLp9PPe3t5n09PTH3Vdp+7u7tMdHR0NAC66rnurgtkBBAh0dXX1ADgvpeRsNpsDgEwms+o4jgCAqampr4Wnl0qlTm63XbEs61KZM+/CdxMnk8lITU3NYOF6cHDwZXV1tea67s56MwyDiAgAUFVVdaQwzsw3ALwoX+Td+D6BWCzWDMAoHnMcJy+E2BFIpVLHCr9XVlZ+F5U2WZZVc8A5S1JqCZ0Jampra4v39fWdBgDP8+TY2NiH4nkpZeKA8v0T3yWUz+frC8ujGCKi0dHRC83NzXEAWFtb2xweHn6zvr6+VVynaVp9WdL64CtARCt+49FolArhR0ZGXi8uLvq+Mkv1lwPfJeR53vugJmZGQHjR2NioViCTyfwA8H3vuBCCl5aW1hcWFn6WuiEzvxsfH98qNX/QlDwLEdE9Zn4AYGczCCHYtu1PjuPIEj25SCRyvww5SxJ4lDBN8yaAa4XroaGhs+3t7Q0AYNv2sm3b33bdjOjhzMzMk3KF9SPwOG0YxjgRPWZmAQDxeDxamKurq4sWlf5h5vuVDg/s4zQKAJ2dnad0Xb9RW1t7IZ1Ot2xsbHgTExOfXdfNEtHbXC43tr1vKs6+BHaKiciyrCYAx13X/aIq9K5M4T9zigkFVBMKqCYUUE0ooJpQQDWhgGpCAdWEAqoJBVQTCqjmL73YJfB2hSYXAAAAAElFTkSuQmCC"
                },
                "cdn"         : {
                    "min-width": 16,
                    "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANMSURBVGiB7ZrdaxxVGIef98zOrAkmGyERNel2rXixFlowtnvThlrsndT6BxQ0YSuBYClCWyw2bgimEApeeKehNb0pXjWUgoXcJCAhSghbbdNgv2gtVWyipMlmm9mZ1wtplO6HKXF3KMwDhxnm48zvmTlnvjiiqjzNmKADrJdQIGhCgaAJBYImFAiaUCBoQoGgCQWCJhQImlAgaEKBoAkFgiYUCJqnXiCy1g1lQFpYIYmQBF7A4xoRruIzo72aq2LGyrn+69+oZOQZhDTKu4AAdCQ6nnWMY0ZvjC4Aiwhf6HG9WIO8xfkqCUi/vIpHBnjx0TJLLMkdy+10LMecuXTml66Rruuu7yowSSMZPaTLNci9Stk+IB9KFI/j/Cs8gKeeTt6d/ANg/5b9bRNdE1tbG1ttIMUCH1Q3bjHlO3EznUBbqVW7v97906npU3cA2l9qb5o6MNW+K7GrAdgrGXm9KknLULIJyRFpoJ6RE2+d2LgjviPm+q6uFFa0oAW/4BXU9V11PdePx+J1qdbUc5axxPM97RzpvDx8aXhMe7WnZgaqWlToY1vjQOO453u+PgHZ37J/8ikX+QarVL3VKKVvoz7JhYcLXveF7isdGzuaHMsRxzjGjthiG9s4lrM6jVgREzVREzERGfxu8DbgMEsCuF6LC1C6CfXJIZS966j3iPbq9+vYf82UvgLKz811zZGx98e2JpoSdflC3nd9Vwv+P33AU893Pffved/zl9wl/+C3B69lf80u87A2Z7+8AFzdENvgJFuSDYJQb9evqbKebT1L6fPpH/Qznfv/IlamtMBr3Jy+Mn1r9Mboy3s27WkBmFueWzn749l78/l517EcsS3b2MYW27LFFtvkC3nv5MTJe0BNms4jyj6JJSNvAIP9b/a3Hd159BVLLMm5uUL3he6Z4exwuTM8Tx3v6WF9ULXEj+es+CrRJx+hvL0vua/p9DunN8eiMVtVSZ9PXx6aHvq9aAfDx/qJTlQzcPEhK5Hkc2Do3My5+9u/3D41Ozf7QESIx+LRx7a8j+FwrcPDGt5GASQjm4CuqIluTsVTreO3xhcBBe4CU8BX2quL1Y1aJtuTDjWQAWlhmeexuBnkd8BqnnCsRMCEAkHzF97kyLsO8uAKAAAAAElFTkSuQmCC"
                },
                "hidden"      : {
                    "min-width": 16,
                    "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMYSURBVGiB7ZnfS2RlGMc/z/Gs69TQruE6RqeCsB3bFUQckMFURJCMuTDwyovIfyCim/oPiv4Ds4vdBS9EWC+8UOgmQUKmC2lGDUtnJ1RsKpsfkR46M/N04bjIMGawcN4VzvfufXme73k+533fc973HFFVrrMs0wU8qwIA0woATCsAMK0AwLQCANMKAEwrADCtAMC0AgDTCgBMKwAwrQDAtK49gG3y4iIiwFtAFLgLNAM7wE/Ajqp6V3qY+jYqIg7wGXD/kpB94HNV/fE/fUwAiMh7wEfAzStCq8BDVX10WYDva0BEosAn1BUfiURCtm3X12MB0yLyzqV+fo6AiDQDXwFvALS3t4d6e3vbu7q6Iq2trS9UKpVqLpcrHR4eFtfX14+Oj4/dWmoB+FBVi6YB3gU+BYjFYnfGx8ffbmpqajgLTk9P/1lYWEhnMpm/al0PVfVBfZzfUygKMDIy4iQSiXvnxefz+b+TyWR2a2vrqFQqnQKEQqHmqamp3r6+vjsXc+vl92M0Go/HO4aHhzsBPM+rLC0tbadSqeOLQaOjo68NDg6+adu2lUgk7ofD4Z9XV1fvNjL0ewRedhznJQDXdb3FxcXNbDZbqg9Kp9O/r62tPSmXy1URobu7uwO4JSJN9bF+j8DeysqKc3BwUNrd3S0MDAw4ExMT9+bn59N7e3slgM7OzluTk5PduVyuNDc3txGPx510Op0DflHVSr2h34v4A2D6vN3f3x8ZGxuLiojs7+//aVmWOI5z23XdyszMTLJQKFx8Ey+r6pf1nn5Poe+Bp3esp6fnlVQqdVitVqttbW0vtrS03CiXy+q6rheLxTrqcpONDH0FqG0LFs/bs7OzP5ycnHiZTOaPYrHobm5u/mpZlrW8vLyzsbHx24XU71T120aevm8lROQm8DXgANi2LSIiQ0NDr2az2WI4HL6xvb2d9zyvWkspAtOqmm/oZ2gvdBv4GBi+IjQFfKGqR5d6mfxTLyIjwPucbalbat0ekAG+AR7rFQUaBXhaxNm54HXOzgNPVLX8v3OfB4Bn0bU/UgYApvUvMxYtZc3ytXoAAAAASUVORK5CYII="
                },
                "locked": {
                    "min-width": 16,
                    "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK9SURBVGiB7ZdNSFRRFMd/d3yTGdmoIH4wiCmSYaC00IVCYAslWkgLd220zWyUQAiFhDZGIEgroXDnUgJJJEIY8SOMUkIzxjRIMcSP8CvNZpw5LcYe4/TGAuFdhPeHtzjn/e/h/OCde+9TIsJZlkt3A6eVA6BbDoBuOQC6deYBDN0NAKCUARQAHmAeka3/XaoXQKkq4C7R5o2Y/DrwBniGyP6JJbRcJZS6iNfbwvLyjRN9Hs8G+/uPCQanElnsnwGlFO3tL1hcbGdiopT09CRLX3NzFhsbdwgERvB6SxOV0zHE9eTmXsHlUlRUpDM6Wkpm5vFPuaUlh66uYgzDRXZ2MtvbD1Aq2bKaiNj3QKbAa8nIGJXp6W35o0BgR7KyxgT80to6J5FINH94GBGfb1bAL3DPqqbdADePmvFLWtqITE1tmhDz87vS2fnFjEOhiDQ2fjT90G1V094hVsoH1JtxamoSQ0PXKC9PP+YLhSI0NMzS2/s9JhsEbiESjrXaPQMFx6Ld3TDV1TMsLf00cyJw//5cXPMA5wBvfEG7Adb+ynR05JGXl2LGSkFbWz7FxefjnAKsxy+3G2DuWNTdfZmmpnwA9vbCTE5GT+Dc3BT8/jJKSlJi3MuWh5rNQ1xkDmVPz5I5sDs7Iamufi+GMSyDg6tmfm3tQMrK3h6tadW/C0UhHkpz8yezya2toFRVvTPBkpKGpb9/xXy/unogycmvBHKs6uk4yJ5SWBjd+jY3g9TWfmBs7If5NhwW6uoC9PWtAODxuHG7nyOyYlVMz12oqOg6lZVdjI+7WVj4ZelRCmpqLmEYLxkYeESCRvUAACh1AfABtxM4vgFPEJk5sYw2ALMDlQYUA1eJ/g98BgLAV0Qi/1yuHeCUOvO/lA6AbjkAuuUA6JYDoFsOgG45ALrlAOiWA6BbDoBuOQC69Rt+YcUCuSysTwAAAABJRU5ErkJggg=="
                },
                "shortcut"    : {
                    "min-width": 16,
                    "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFASURBVGiB7doxboMwFMbxD8SAQfZgsWYAdUiVShE3iJShbM0JGGHNkjP0CByBtedA3KBzsmTLAJEal86WmnTo8Iz0/qvf8H6yvNmbpglzzqde4L8xgDoGUMcA6hhAHQOoYwB1DKCOAdQxgDoGUMcA6hhAHQOoYwB1DKCOAdQxgLrZAwLqBX5LCPEuhHh7NGOM+b5cLnsnAWEYvlRV9VwUxd2Zw+Ew9n2fOAkAgOVyic1mAwA4n88wxgAA4jiGlBJaawPM5A1st1us12ssFgvUdW2dzQLQdR3yPMdqtUKSJNaZ84Dr9YrdbgcpJcqyhO/bKzv7BgB7+bZtMQwDbrebNeP0DZxOJ6RpirZtEQQBlFLQWlszTt9AlmVomubhjOfibxUp5UcURa9Kqa97M8fjMRzHsXQS4HneE4Dkz0Hg8wdWPUnhuli55AAAAABJRU5ErkJggg=="
                }
            }
        }
    };
    
    this.addIconsPack = function( iconsPack, destination, override ) {
    
        override = typeof override == 'undefined' ? true : !!override;
    
        var paths = destination.split("/");
        var node  = this.constants;
        
        for (var i=0; i<paths.length - 1; i++) {
            node[ paths[i] ] = node[ paths[i] ] || {};
            node = node[ paths[i] ];
        }
        
        node[ paths[ paths.length - 1 ] ] = override ? {} : node[ paths[ paths.length - 1 ] ];
        node = node[ paths[ paths.length - 1 ] ];
        
        for (var property in iconsPack) {
            if (iconsPack.propertyIsEnumerable( property ))
                node[ property ] = iconsPack[ property ];
        }
    }
    
    this.create = function( thumbType, emblems, width, height ) {
        var canvas = document.createElement( 'canvas' );
        
        canvas.width = width;
        canvas.height = height;
        
        var stack = [];
        
        var onloads = [];
        
        var onload = function() {
            for (var i=0; i<onloads.length; i++) {
                onloads[i]();
            }
        };
        
        var add = function(imgSrc) {
            
            var img = new Image();
            
            img.onload = function() {
                img.loaded = true;
                img.painted = false;
                
                
                var allLoaded = true;
                
                for (var i=0; i<stack.length; i++) {
                    if (!stack[i].loaded) {
                        allLoaded = false;
                        break;
                    }
                    if (!stack[i].painted) {
                        ctx.drawImage( stack[i], 0, 0, width, height );
                        stack[i].painted = true;
                    }
                }
                
                if (allLoaded)
                    onload();
                
            };
            
            img.onerror = function() {
                img.loaded = true;
                img.painted = true;
                
                var allLoaded = true;
                
                for (var i=0; i<stack.length; i++) {
                    if (!stack[i].loaded) {
                        allLoaded = false;
                        break;
                    }
                    if (!stack[i].painted) {
                        ctx.drawImage( stack[i], 0, 0, width, height );
                        stack[i].painted = true;
                    }
                }
                
                if (allLoaded)
                    onload();
            }
            
            stack.push(img);
            
            img.src = imgSrc;
        };
        
        var ctx = canvas.getContext('2d');
        
        if (this.constants[ thumbType ])
            add( this.constants[ thumbType ].src );
        else {
            add( thumbType );
            thumbType = "_generic";
        }
        
        for (var emblem in this.constants[ thumbType ].emblems) {
            if (this.constants[ thumbType ].emblems.propertyIsEnumerable( emblem ) &&
                emblems.indexOf( emblem ) >= 0 &&
                this.constants[ thumbType ].emblems[ emblem ]["min-width"] <= width
            ) {
                add(this.constants[ thumbType ].emblems[ emblem ].src);
            }
        }
        
        canvas.setUrl = function( DOMElement ) {
            onloads.push( function() {
                DOMElement.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
            } );
            return canvas;
        };
        
        canvas.setHref = function( DOMElement ) {
            onloads.push( function() {
                DOMElement.src = canvas.toDataURL();
            } );
            return canvas;
        };
        
        return canvas;
    }
    
}

(function() {
    
    var defaultThumbnailer = new canvasThumbnailer();
    
    Object.defineProperty(window, "thumbnailer", {
        "get": function() { return  defaultThumbnailer; }
    } );
    
})();