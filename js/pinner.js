function Pinner(sourceElement, pinElement, pinMode) {
    this.source = sourceElement || null;
    this.target = pinElement || null;
    this.pinMode = pinMode || 'bottom';
    
    this.getPinMode = function() {
        return this.pinMode;
    };
    
    this.setPinMode = function(mode, boolFallback) {
        switch (mode) {
            case 'left':
            case 'right':
            case 'top':
            case 'top-left':
            case 'bottom': 
            case 'bottom-left': break;
            default: 
                throw 'Invalid pin mode. Allowed only: "left", "right", "top", "bottom", "bottom-left"';
        }
    
        //check if the nodes exists and are attached
        if (!this.source || !this.source.parentNode || !this.target || !this.target.parentNode) return;
    
        var widthSource = this.source.offsetWidth;
        var heightSource = this.source.offsetHeight;
        
        //reset target coordinates
        this.target.style.left = '';
        this.target.style.right= '';
        this.target.style.top = '';
        this.target.style.bottom = '';
        
        var widthTarget = this.target.offsetWidth;
        var heightTarget = this.target.offsetHeight;
        
        var xy = getXY(this.source);
        xy[0] += document.body.scrollLeft || (window.pageXOffset || (document.body.parentElement ? document.body.parentElement.scrollLeft  : 0) );
        xy[1] += document.body.scrollTop || (window.pageYOffset || (document.body.parentElement ? document.body.parentElement.scrollTop  : 0) );
        
//         console.log(xy);
        
//         console.log('widthSource: '+widthSource+', heightSource: '+heightSource+', widthTarget: '+widthTarget+', heightTarget: '+heightTarget);
        
        switch (mode) {
            case 'right': {
                this.target.style.left = xy[0] + widthSource + 'px';
                this.target.style.top  = xy[1] + Math.floor( heightSource / 2 ) - Math.floor( heightTarget / 2 ) + 'px';
                break;
            }
            case 'left': {
                this.target.style.left = xy[0] - widthTarget + 'px';
                this.target.style.top  = xy[1] + Math.floor( heightSource / 2 ) - Math.floor( heightTarget / 2 ) + 'px';
                break;
            }
            case 'top': {
                this.target.style.left   = xy[0] + Math.floor( widthSource / 2 ) - Math.floor( widthTarget / 2 ) + 'px';
                this.target.style.top = xy[1] - heightTarget + 'px';
                break;
            }
            
            case 'top-left': {
                this.target.style.left = xy[0] + 'px';
                this.target.style.top  = xy[1] - heightTarget + 'px';
                break;
            }
            
            case 'bottom': {
                this.target.style.left   = xy[0] + Math.floor( widthSource / 2 ) - Math.floor( widthTarget / 2 ) + 'px';
                this.target.style.top    = xy[1] + heightSource + 'px';
                break;
            }
            case 'bottom-left': {
                this.target.style.left   = xy[0] + 'px';
                this.target.style.top    = xy[1] + heightSource + 'px';
                break;
            }
        }
    };
    
    this.setSourceElement = function(src) {
        this.source = src;
        this.setPinMode(this.pinMode);
    };
    
    this.getSourceElement = function() {
        return this.source;
    };
    
    this.setTargetElement = function(targ) {
        this.target = targ;
        this.setPinMode(this.pinMode);
    };
    
    this.getTargetElement = function() {
        return this.target;
    };
    
    this.setTargetElement(this.target);
}