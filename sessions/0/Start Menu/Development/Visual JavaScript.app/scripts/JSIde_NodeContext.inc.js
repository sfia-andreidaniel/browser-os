function JSIde_NodeContext( app, treeNode ) {
    treeNode.addContextMenu([
        {
            "caption": "Add",
            "items"  :JSIde_WhatCanWeAddIn( treeNode.nodeID, app ),
            "icon"   : "data:image/gif;base64,R0lGODlhEAAQAKL/AP///8DAwAD/AADMAACZMwBmMwAAAAAAACH5BAEAAAEALAAAAAAQABAAAAM+GLrc/jCASaMkmAALiBjF5lDdF1ZLl5mZqJTCN8yD4V50TthMV/yzgsEQ6lEIMxuq0RnsbqMdEcokUS1YSwIAOw=="
        },
        null,
        {
            "caption": "Delete",
            "handler": function() {
                app.appHandler( 'cmd_delete_node', treeNode.nodeID );
            },
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAG7AAABuwE67OPiAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAARdQTFRF////gAAAqAAArQAAhwAAigAAkQAAmAAAnAAAqgAAgAAAqAAArwQEnAAAhw4OjgAAbgAAbQAAagAAogAAlisrfx4WgiQb0nh1w0pJyWBdnR8cvzQqxUc/pB8TpB8VpCEapCMepR4Sph4QqyQXrycbszEmsysfvko/w0pAyExDylZMgCMhgSMhoT40skM6aiMfaiMgezwyWSEcWyEbvQAAvgAAvzkzwREKwjMzwk1Iwzo6xTkyxhIMxxIMyT4+y0Q/y05KzEZG0AAA0BIM01ZW01dU02Vg1GJe1mBd12Nh2xMQ2xQR3xMP3xQS32hh4wAA5S8q5TAs5TIt5TIu5XNx5m1t5nZ16Y2J7xQS7xUT74mH8I2K9QAAY45BIQAAADR0Uk5TADIyMkhISEhISElJSUpLT1BRUtDX3d7k5ury9PX6+vr6+vr6+vr7+/v7+/z8/Pz9/f3+/tVu3mIAAACcSURBVBgZjcFFFoIAAAXADyjYInZ3d2IHYnfn/c+h8HTPDKAE5Tbgy+CkICO9z4wW0KdfPhIS6/ZyTRnNhfPlZoVEk5iIi3x5Js6TGsiY2KA/bI2mcQY/dLTTbDciNP7UYb5W58Nq/Kj8Y6HbE8YBFWS64Hq3rFZWu03IBIl9/74XWa70eB9skBCeY5YFuNzJQ0BGOCz44lwElPgAQ7MTa3psPxYAAAAASUVORK5CYII="
        }
    ]);
}