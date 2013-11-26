function Effect(DOMElement) {
    
    //Begin: Internals
    
    var _self = this;
    
    this.effectElement = DOMElement;
    this.effectElement.___effectStack = this.effectElement.___effectStack || [];
    
    this.effectThreadID = null;
    this.threadSpeed  = 1;
    
    this.setSpeed = function(ms) {
        var running = _self.effectThreadID ? true : false;
        if (running) {
            //first we stop the thread
            window.clearInterval(_self.effectThreadID);
            _self.effectThreadID = window.setInterval(_self.poolQueue, _self.threadSpeed);
        }
        _self.threadSpeed = ms;
    };
    
    this.runOperation = function(operation) {
        switch (operation.type) {
            case 'speed': {
                sp = operation.speed;
                this.setSpeed(sp);
//                 console.log('effect: speed');
                break;
            }
            case 'style': {
                for (var i=0; i<operation.args.length; i++) {
                    _self.effectElement.style[operation.args[i].param] = operation.args[i].value;
//                     console.log(operation.args[i].param + ' = ' + operation.args[i].value);
                }
//                 console.log('effect: style');
                break;
            }
            case 'finish': {
                if (operation.callback) operation.callback();
//                 console.log('effect: finish');
                break;
            }
        }
    };
    
    this.poolQueue = function() {
        if (!_self.effectElement.___effectStack.length && _self.effectThreadID) {
            window.clearInterval(_self.effectThreadID);
            _self.effectThreadID = null;
//             console.log('stopped');
            return;
        }
        _self.runOperation( _self.effectElement.___effectStack.shift() );
    };
    
    this.push = function(cmd) {
        _self.effectElement.___effectStack.push(cmd);
    }
    
    this.start = function(speed) {
    
        if (typeof speed != 'undefined')
        _self.push({
            'type': 'speed',
            'speed': speed
        });
    
        if (!_self.effectThreadID)
            _self.effectThreadID = window.setInterval(_self.poolQueue, _self.threadSpped);
            
//         console.log('started');
    };
    
    
    
    // BEGIN: effects
    
    this.goTo = function(x, y, speed, steps, callbackEnd) {
        var myX = _self.effectElement.offsetLeft;
        var myY = _self.effectElement.offsetTop;
        
        var mSteps = Math.max( myX - x, myY - y );
        
        steps = steps > mSteps ? mSteps : steps;
        
        var _stepX = (myX - x) / steps;
        var _stepY = (myY - y) / steps;
        
        //setup speed
        _self.push({
            'type': 'speed',
            'speed': speed
        });
        
        
        for (var i=0; i<steps; i++) {
            _self.push({
                'type': 'style',
                'args': [
                    {'param': 'left',
                     'value': Math.floor(myX) + 'px'
                    },
                    {'param': 'top',
                     'value': Math.floor(myY) + 'px'
                    }
                ]
            });
            myX -= _stepX;
            myY -= _stepY;
        }
        
        _self.push({
            'type': 'style',
            'args': [
                {'param': 'left',
                 'value': x + 'px'
                },
                {'param': 'top',
                 'value': y + 'px'
                }
            ]
        });
        
        _self.push({
            'type': 'finish',
            'callback': callbackEnd
        });
        
        return _self;
    };
    
    
    //End
    
    return this;
};