/*

// Deprecated

function SimpleTable() {
    var tbl = $('table', 'SimpleTable');
    tbl.style.width = '100%';
    
    tbl.colWidths = [];
    
    tbl.tr = function(arr) {
        var row = this.insertRow(this.rows.length);
        row.setWidths = function(arr) {
            for(var i=0; i<arr.length; i++) {
                row.cells[i].style.width = arr[i];
            }
            return row;
        };
        for (var i=0; i<arr.length; i++) {
            td = row.insertCell(i);
            td.style.padding = '3px';
            
            if (tbl.colWidths[i]) td.style.width = tbl.colWidths[i]; else {
                if (arr.length > 2) td.style.width = (100/arr.length)+'%';
                else td.style.width = i == 0 ? '25%' : '75%';
            }
            
//             td.style.borderBottom = '1px solid #666';
            td.style.verticalAlign = 'top';
            try {
                td.appendChild(arr[i].getHandle ? arr[i].getHandle() : arr[i]);
            } catch(ex) {
                td.innerHTML = arr[i];
            }
        }
        return row;
    };
    return tbl;
}

*/

function AddContextMenu(node, menu) {

    console.log("domutils.js: AddContextMenu(node, menu): DEPRECATED!!!");

    node.contextMenu = menu;
    
    if (window.opera) {
        node.addEventListener('mousedown', function(e) {
            if (e.button == 0 && e.shiftKey) {
                if (this.oncontextmenu) this.oncontextmenu(e);
                cancelEvent(e);
            }
        }, false);
    }
    
    node.oncontextmenu = function(e) {
        var cx = e.clientX; var cy = e.clientY;
        
        addStyle(node, 'CONTEXT_MENU');
        
        var d = $('div', 'DOMContextMenu');
        d.tabIndex = 0;
        
        d.style.left = e.clientX + 'px';
        d.style.top  = e.clientY + 'px';
        d.style.zIndex = 1000000;
        
        document.body.appendChild(d);
        
        d.focus();
        
        d.oncontextmenu = function(e) {
            cancelEvent(e);
        };
        
        d.onblur = function() { this.onclick(); };
        d.onclick= function(){ 
            removeStyle(node, 'CONTEXT_MENU');
            try {
                this.parentNode.removeChild(this); 
            } catch(ex) {}
        };
        
        for (var i=0; i<this.contextMenu.length; i++) {
            
            if (this.contextMenu[i] !== null) {
            
            var a = $('a');
            a.appendChild(document.createTextNode(this.contextMenu[i].text));
            a.callback = this.contextMenu[i].callback;
            a.onclick = function(e) { cancelEvent(e); d.onclick(); this.callback(); };
            
            if (this.contextMenu[i].important) a.style.fontWeight = 'bold';
            
            d.appendChild(a);
            
            } else d.appendChild($('hr'));
        }
        
        d.style.width = '150px';
        
        if ((d.offsetHeight + e.clientY) > getMaxY()) d.style.top = e.clientY - d.offsetHeight + 'px';
        if ((d.offsetWidth + e.clientX)  > getMaxX()) d.style.left= e.clientX - d.offsetWidth + 'px';
        
        cancelEvent(e);
    };
}

var ___UID = 0;

function getUID() {
    return ++___UID;
}