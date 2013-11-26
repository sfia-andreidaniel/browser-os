// Content from:
// http://www.switchonthecode.com/tutorials/javascript-draggable-elements

function Position(x, y)
{
  this.X = x;
  this.Y = y;
  
  this.Add = function(val)
  {
    var newPos = new Position(this.X, this.Y);
    if(val != null)
    {
      if(!isNaN(val.X))
        newPos.X += val.X;
      if(!isNaN(val.Y))
        newPos.Y += val.Y
    }
    return newPos;
  }
  
  this.Subtract = function(val)
  {
    var newPos = new Position(this.X, this.Y);
    if(val != null)
    {
      if(!isNaN(val.X))
        newPos.X -= val.X;
      if(!isNaN(val.Y))
        newPos.Y -= val.Y
    }
    return newPos;
  }
  
  this.Min = function(val)
  {
    var newPos = new Position(this.X, this.Y)
    if(val == null)
      return newPos;
    
    if(!isNaN(val.X) && this.X > val.X)
      newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y > val.Y)
      newPos.Y = val.Y;
    
    return newPos;  
  }
  
  this.Max = function(val)
  {
    var newPos = new Position(this.X, this.Y)
    if(val == null)
      return newPos;
    
    if(!isNaN(val.X) && this.X < val.X)
      newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y < val.Y)
      newPos.Y = val.Y;
    
    return newPos;  
  }  
  
  this.Bound = function(lower, upper)
  {
    var newPos = this.Max(lower);
    return newPos.Min(upper);
  }
  
  this.Check = function()
  {
    var newPos = new Position(this.X, this.Y);
    if(isNaN(newPos.X))
      newPos.X = 0;
    if(isNaN(newPos.Y))
      newPos.Y = 0;
    return newPos;
  }
  
  this.Apply = function(element)
  {
    if(typeof(element) == "string")
      element = document.getElementById(element);
    if(element == null)
      return;
    if(!isNaN(this.X))
      element.style.left = this.X + 'px';
    if(!isNaN(this.Y))
      element.style.top = this.Y + 'px';  
  }
}

function hookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.addEventListener)
  {
    element.addEventListener(eventName, callback, false);
  }
  else if(element.attachEvent)
    element.attachEvent("on" + eventName, callback);
}

function unhookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.removeEventListener)
    element.removeEventListener(eventName, callback, false);
  else if(element.detachEvent)
    element.detachEvent("on" + eventName, callback);
}

function getMousePos(eventObj)
{
  eventObj = eventObj ? eventObj : window.event;
  var pos;
  if(isNaN(eventObj.layerX))
    pos = new Position(eventObj.offsetX, eventObj.offsetY);
  else
    pos = new Position(eventObj.layerX, eventObj.layerY);
  return pos; //correctOffset(pos, pointerOffset, true);
}

function getEventTarget(e)
{
  e = e ? e : window.event;
  return e.target ? e.target : e.srcElement;
}

function absoluteCursorPostion(eventObj)
{
  eventObj = eventObj ? eventObj : window.event;
  
  if(isNaN(window.scrollX))
    return new Position(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, 
      eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop);
  else
    return new Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
}

function dragObject(element, attachElement, lowerBound, upperBound, startCallback, moveCallback, endCallback, attachLater, optScX, optScY)
{

  maintainXScrollElement = (typeof(optScX) != 'undefined' && optScX.tagName) ? optScX : null;
  maintainYScrollElement = (typeof(optScY) != 'undefined' && optScY.tagName) ? optScY : null;
  
//   KernelLog('scx='+maintainXScrollElement+', scy = '+maintainYScrollElement);

  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
      return;
  
  if(lowerBound != null && upperBound != null)
  {
    var temp = lowerBound.Min(upperBound);
    upperBound = lowerBound.Max(upperBound);
    lowerBound = temp;
  }

  var cursorStartPos = null;
  var elementStartPos = null;
  var dragging = false;
  var listening = false;
  var disposed = false;
  
  function dragStart(eventObj)
  { 
  
    if ( eventObj.which != 1 )
        return;
  
    var cName = getEventTarget(eventObj);
      
    if (!cName.getAttribute('dragable') || hasStyle(cName, 'nomove'))
        return true;
      
    if(dragging || !listening || disposed) return;
    
    if (hasStyle(cName, 'DOMWindowTitle')) {
        activateWindow(cName.parentWnd);
    }
    
    dragging = true;
    
    if(startCallback != null)
      if ( startCallback(eventObj, element) == 'cancel' ) {
        dragging = false;
        return;
      };
    
    cursorStartPos = absoluteCursorPostion(eventObj);
    
    elementStartPos = new Position(parseInt(element.style.left  ? element.style.left : element.offsetLeft), 
                                   parseInt(element.style.top  ? element.style.top : element.offsetTop));
   
    elementStartPos = elementStartPos.Check();
    
    hookEvent(document, "mousemove", dragGo);
    hookEvent(document, "mouseup", dragStopHook);
    
    return cancelEvent(eventObj);
  }
  
  function dragGo(eventObj) {
    if (!dragging || disposed) return;
    

    if (maintainXScrollElement !== null) {
//         KernelLog('maintainX');
        var shiftXM = 0;
        
        var origMX = maintainXScrollElement.scrollLeft;
        var purposeXScroll = maintainXScrollElement.scrollLeft;
        
        var xl = element.offsetLeft;
        var xr = element.offsetLeft + element.offsetWidth;
            
        if ((maintainXScrollElement.scrollLeft > xl) && (maintainXScrollElement.scrollLeft > 0)) {
            purposeXScroll = xl;
        } else 
        if (maintainXScrollElement.scrollLeft + maintainXScrollElement.clientWidth < xr) {
            purposeXScroll = xr - maintainXScrollElement.clientWidth;
        }
        
        shiftXM = origMX - purposeXScroll;
        if (Math.abs(shiftXM) > 10 && !eventObj.shiftKey) { 
            shiftXM = (shiftXM < 0) ? -10 : 10; 
            purposeXScroll = origMX - shiftXM;
        }
        
        if (purposeXScroll != maintainXScrollElement.scrollLeft) {
            maintainXScrollElement.scrollLeft = purposeXScroll;
            elementStartPos.X -= shiftXM;
        }
    }
    
    if (maintainYScrollElement !== null) {
//         KernelLog('maintainY');
        var shiftYM = 0;
        
        var origMY = maintainYScrollElement.scrollTop;
        var purposeYScroll = maintainYScrollElement.scrollTop;
        
        var yl = element.offsetTop - 10;
        var yr = element.offsetTop + element.offsetHeight + 10;
        
        if ((maintainYScrollElement.scrollTop > yl) && (maintainYScrollElement.scrollTop > 0)) {
            purposeYScroll = yl;
        } else 
        if (maintainYScrollElement.scrollTop + maintainYScrollElement.clientHeight < yr) {
            purposeYScroll = yr - maintainYScrollElement.clientHeight;
        }
        
        shiftYM = origMY - purposeYScroll;
        if (Math.abs(shiftYM) > 10 && !eventObj.shiftKey) { 
            shiftYM = (shiftYM < 0) ? -10 : 10; 
            purposeYScroll = origMY - shiftYM;
        }
        
        if (purposeYScroll != maintainYScrollElement.scrollTop) {
            maintainYScrollElement.scrollTop = purposeYScroll;
            elementStartPos.Y -= shiftYM;
        }
    }
    
    var newPos = absoluteCursorPostion(eventObj);
    
    newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
    newPos = newPos.Bound(lowerBound, upperBound);
    newPos.Apply(element);
    
    if(moveCallback != null) moveCallback(newPos, element, eventObj);
    
    return cancelEvent(eventObj); 
  }
  
  function dragStopHook(eventObj)
  {
    dragStop();
    return cancelEvent(eventObj);
  }
  
  function dragStop()
  {
    if(!dragging || disposed) return;
    unhookEvent(document, "mousemove", dragGo);
    unhookEvent(document, "mouseup", dragStopHook);
    cursorStartPos = null;
    elementStartPos = null;
    if(endCallback != null)
      endCallback(element);
    dragging = false;
  }
  
  this.Dispose = function()
  {
    if(disposed) return;
    this.StopListening(true);
    element = null;
    attachElement = null
    lowerBound = null;
    upperBound = null;
    startCallback = null;
    moveCallback = null
    endCallback = null;
    disposed = true;
  }
  
  this.StartListening = function()
  {
    if(listening || disposed) return;
    listening = true;
    hookEvent(attachElement, "mousedown", dragStart);
  };
  
  this.StopListening = function(stopCurrentDragging)
  {
    if(!listening || disposed) return;
    unhookEvent(attachElement, "mousedown", dragStart);
    listening = false;
    
    if(stopCurrentDragging && dragging)
      dragStop();
  }
  
  this.IsDragging = function(){ return dragging; }
  this.IsListening = function() { return listening; }
  this.IsDisposed = function() { return disposed; }
  
  if(typeof(attachElement) == "string")
    attachElement = document.getElementById(attachElement);
  if(attachElement == null)
    attachElement = element;
    
  if(!attachLater)
    this.StartListening();
}
