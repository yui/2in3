YUI.add('yui2-slider', function(Y) {
    if (Y.YUI2) {
        var YAHOO    = Y.YUI2;
    }
    /*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.4.1
*/
YAHOO.widget.Slider=function(B,r,D,I){YAHOO.widget.Slider.ANIM_AVAIL=(!YAHOO.lang.isUndefined(YAHOO.util.Anim));if(B){this.init(B,r,true);this.initSlider(I);this.initThumb(D);}};YAHOO.widget.Slider.getHorizSlider=function(D,B,X,I,r){return new YAHOO.widget.Slider(D,D,new YAHOO.widget.SliderThumb(B,D,X,I,0,0,r),"horiz");};YAHOO.widget.Slider.getVertSlider=function(B,I,r,X,D){return new YAHOO.widget.Slider(B,B,new YAHOO.widget.SliderThumb(I,B,0,0,r,X,D),"vert");};YAHOO.widget.Slider.getSliderRegion=function(B,I,g,X,r,Y,D){return new YAHOO.widget.Slider(B,B,new YAHOO.widget.SliderThumb(I,B,g,X,r,Y,D),"region");};YAHOO.widget.Slider.ANIM_AVAIL=false;YAHOO.extend(YAHOO.widget.Slider,YAHOO.util.DragDrop,{initSlider:function(r){this.type=r;this.createEvent("change",this);this.createEvent("slideStart",this);this.createEvent("slideEnd",this);this.isTarget=false;this.animate=YAHOO.widget.Slider.ANIM_AVAIL;this.backgroundEnabled=true;this.tickPause=40;this.enableKeys=true;this.keyIncrement=20;this.moveComplete=true;this.animationDuration=0.2;this.SOURCE_UI_EVENT=1;this.SOURCE_SET_VALUE=2;this.valueChangeSource=0;this._silent=false;this.lastOffset=[0,0];},initThumb:function(D){var r=this;this.thumb=D;D.cacheBetweenDrags=true;if(D._isHoriz&&D.xTicks&&D.xTicks.length){this.tickPause=Math.round(360/D.xTicks.length);}else{if(D.yTicks&&D.yTicks.length){this.tickPause=Math.round(360/D.yTicks.length);}}D.onAvailable=function(){return r.setStartSliderState();};D.onMouseDown=function(){return r.focus();};D.startDrag=function(){r._slideStart();};D.onDrag=function(){r.fireEvents(true);};D.onMouseUp=function(){r.thumbMouseUp();};},onAvailable:function(){var r=YAHOO.util.Event;r.on(this.id,"keydown",this.handleKeyDown,this,true);r.on(this.id,"keypress",this.handleKeyPress,this,true);},handleKeyPress:function(B){if(this.enableKeys){var r=YAHOO.util.Event;var D=r.getCharCode(B);switch(D){case 37:case 38:case 39:case 40:case 36:case 35:r.preventDefault(B);break;default:}}},handleKeyDown:function(X){if(this.enableKeys){var Y=YAHOO.util.Event;var B=Y.getCharCode(X),n=this.thumb;var D=this.getXValue(),g=this.getYValue();var R=false;var I=true;switch(B){case 37:D-=this.keyIncrement;break;case 38:g-=this.keyIncrement;break;case 39:D+=this.keyIncrement;break;case 40:g+=this.keyIncrement;break;case 36:D=n.leftConstraint;g=n.topConstraint;break;case 35:D=n.rightConstraint;g=n.bottomConstraint;break;default:I=false;}if(I){if(n._isRegion){this.setRegionValue(D,g,true);}else{var r=(n._isHoriz)?D:g;this.setValue(r,true);}Y.stopEvent(X);}}},setStartSliderState:function(){this.setThumbCenterPoint();this.baselinePos=YAHOO.util.Dom.getXY(this.getEl());this.thumb.startOffset=this.thumb.getOffsetFromParent(this.baselinePos);if(this.thumb._isRegion){if(this.deferredSetRegionValue){this.setRegionValue.apply(this,this.deferredSetRegionValue,true);this.deferredSetRegionValue=null;}else{this.setRegionValue(0,0,true,true,true);}}else{if(this.deferredSetValue){this.setValue.apply(this,this.deferredSetValue,true);this.deferredSetValue=null;}else{this.setValue(0,true,true,true);}}},setThumbCenterPoint:function(){var r=this.thumb.getEl();if(r){this.thumbCenterPoint={x:parseInt(r.offsetWidth/2,10),y:parseInt(r.offsetHeight/2,10)};}},lock:function(){this.thumb.lock();this.locked=true;},unlock:function(){this.thumb.unlock();this.locked=false;},thumbMouseUp:function(){if(!this.isLocked()&&!this.moveComplete){this.endMove();}},onMouseUp:function(){if(!this.isLocked()&&!this.moveComplete){this.endMove();}},getThumb:function(){return this.thumb;},focus:function(){this.valueChangeSource=this.SOURCE_UI_EVENT;var r=this.getEl();if(r.focus){try{r.focus();}catch(D){}}this.verifyOffset();if(this.isLocked()){return false;}else{this._slideStart();return true;}},onChange:function(r,D){},onSlideStart:function(){},onSlideEnd:function(){},getValue:function(){return this.thumb.getValue();},getXValue:function(){return this.thumb.getXValue();},getYValue:function(){return this.thumb.getYValue();},handleThumbChange:function(){},setValue:function(Y,B,I,r){this._silent=r;this.valueChangeSource=this.SOURCE_SET_VALUE;if(!this.thumb.available){this.deferredSetValue=arguments;return false;}if(this.isLocked()&&!I){return false;}if(isNaN(Y)){return false;}var D=this.thumb;D.lastOffset=[Y,Y];var g,X;this.verifyOffset(true);if(D._isRegion){return false;}else{if(D._isHoriz){this._slideStart();g=D.initPageX+Y+this.thumbCenterPoint.x;this.moveThumb(g,D.initPageY,B);}else{this._slideStart();X=D.initPageY+Y+this.thumbCenterPoint.y;this.moveThumb(D.initPageX,X,B);}}return true;},setRegionValue:function(R,r,I,X,D){this._silent=D;this.valueChangeSource=this.SOURCE_SET_VALUE;if(!this.thumb.available){this.deferredSetRegionValue=arguments;return false;}if(this.isLocked()&&!X){return false;}if(isNaN(R)){return false;}var B=this.thumb;B.lastOffset=[R,r];this.verifyOffset(true);if(B._isRegion){this._slideStart();var Y=B.initPageX+R+this.thumbCenterPoint.x;var g=B.initPageY+r+this.thumbCenterPoint.y;this.moveThumb(Y,g,I);return true;}return false;},verifyOffset:function(D){var r=YAHOO.util.Dom.getXY(this.getEl());if(r){if(r[0]!=this.baselinePos[0]||r[1]!=this.baselinePos[1]){this.thumb.resetConstraints();this.baselinePos=r;return false;}}return true;},moveThumb:function(Y,g,X,I){var R=this.thumb;var n=this;if(!R.available){return ;}R.setDelta(this.thumbCenterPoint.x,this.thumbCenterPoint.y);var D=R.getTargetCoord(Y,g);var B=[D.x,D.y];this._slideStart();if(this.animate&&YAHOO.widget.Slider.ANIM_AVAIL&&R._graduated&&!X){this.lock();this.curCoord=YAHOO.util.Dom.getXY(this.thumb.getEl());setTimeout(function(){n.moveOneTick(B);},this.tickPause);}else{if(this.animate&&YAHOO.widget.Slider.ANIM_AVAIL&&!X){this.lock();var r=new YAHOO.util.Motion(R.id,{points:{to:B}},this.animationDuration,YAHOO.util.Easing.easeOut);r.onComplete.subscribe(function(){n.endMove();});r.animate();}else{R.setDragElPos(Y,g);if(!I){this.endMove();}}}},_slideStart:function(){if(!this._sliding){if(!this._silent){this.onSlideStart();this.fireEvent("slideStart");}this._sliding=true;}},_slideEnd:function(){if(this._sliding&&this.moveComplete){if(!this._silent){this.onSlideEnd();this.fireEvent("slideEnd");}this._sliding=false;this._silent=false;this.moveComplete=false;}},moveOneTick:function(D){var X=this.thumb,I;var g=null;if(X._isRegion){g=this._getNextX(this.curCoord,D);var r=(g)?g[0]:this.curCoord[0];g=this._getNextY([r,this.curCoord[1]],D);}else{if(X._isHoriz){g=this._getNextX(this.curCoord,D);}else{g=this._getNextY(this.curCoord,D);}}if(g){this.curCoord=g;this.thumb.alignElWithMouse(X.getEl(),g[0],g[1]);if(!(g[0]==D[0]&&g[1]==D[1])){var B=this;setTimeout(function(){B.moveOneTick(D);},this.tickPause);}else{this.endMove();}}else{this.endMove();}},_getNextX:function(r,D){var I=this.thumb;var g;var B=[];var X=null;if(r[0]>D[0]){g=I.tickSize-this.thumbCenterPoint.x;B=I.getTargetCoord(r[0]-g,r[1]);X=[B.x,B.y];}else{if(r[0]<D[0]){g=I.tickSize+this.thumbCenterPoint.x;B=I.getTargetCoord(r[0]+g,r[1]);X=[B.x,B.y];}else{}}return X;},_getNextY:function(r,D){var I=this.thumb;var g;var B=[];var X=null;if(r[1]>D[1]){g=I.tickSize-this.thumbCenterPoint.y;B=I.getTargetCoord(r[0],r[1]-g);X=[B.x,B.y];}else{if(r[1]<D[1]){g=I.tickSize+this.thumbCenterPoint.y;B=I.getTargetCoord(r[0],r[1]+g);X=[B.x,B.y];}else{}}return X;},b4MouseDown:function(r){this.thumb.autoOffset();this.thumb.resetConstraints();},onMouseDown:function(D){if(!this.isLocked()&&this.backgroundEnabled){var r=YAHOO.util.Event.getPageX(D);var B=YAHOO.util.Event.getPageY(D);this.focus();this.moveThumb(r,B);}},onDrag:function(D){if(!this.isLocked()){var r=YAHOO.util.Event.getPageX(D);var B=YAHOO.util.Event.getPageY(D);this.moveThumb(r,B,true,true);}},endMove:function(){this.unlock();this.moveComplete=true;this.fireEvents();},fireEvents:function(B){var D=this.thumb;if(!B){D.cachePosition();}if(!this.isLocked()){if(D._isRegion){var X=D.getXValue();var I=D.getYValue();if(X!=this.previousX||I!=this.previousY){if(!this._silent){this.onChange(X,I);this.fireEvent("change",{x:X,y:I});}}this.previousX=X;this.previousY=I;}else{var r=D.getValue();if(r!=this.previousVal){if(!this._silent){this.onChange(r);this.fireEvent("change",r);}}this.previousVal=r;}this._slideEnd();}},toString:function(){return ("Slider ("+this.type+") "+this.id);}});YAHOO.augment(YAHOO.widget.Slider,YAHOO.util.EventProvider);YAHOO.widget.SliderThumb=function(Y,D,X,I,r,g,B){if(Y){YAHOO.widget.SliderThumb.superclass.constructor.call(this,Y,D);this.parentElId=D;}this.isTarget=false;this.tickSize=B;this.maintainOffset=true;this.initSlider(X,I,r,g,B);this.scroll=false;};YAHOO.extend(YAHOO.widget.SliderThumb,YAHOO.util.DD,{startOffset:null,_isHoriz:false,_prevVal:0,_graduated:false,getOffsetFromParent0:function(B){var r=YAHOO.util.Dom.getXY(this.getEl());var D=B||YAHOO.util.Dom.getXY(this.parentElId);return [(r[0]-D[0]),(r[1]-D[1])];},getOffsetFromParent:function(R){var r=this.getEl(),X;if(!this.deltaOffset){var n=YAHOO.util.Dom.getXY(r);var g=R||YAHOO.util.Dom.getXY(this.parentElId);X=[(n[0]-g[0]),(n[1]-g[1])];var D=parseInt(YAHOO.util.Dom.getStyle(r,"left"),10);var e=parseInt(YAHOO.util.Dom.getStyle(r,"top"),10);var I=D-X[0];var B=e-X[1];if(isNaN(I)||isNaN(B)){}else{this.deltaOffset=[I,B];}}else{var s=parseInt(YAHOO.util.Dom.getStyle(r,"left"),10);var Y=parseInt(YAHOO.util.Dom.getStyle(r,"top"),10);X=[s+this.deltaOffset[0],Y+this.deltaOffset[1]];}return X;},initSlider:function(I,B,r,X,D){this.initLeft=I;this.initRight=B;this.initUp=r;this.initDown=X;this.setXConstraint(I,B,D);this.setYConstraint(r,X,D);if(D&&D>1){this._graduated=true;}this._isHoriz=(I||B);this._isVert=(r||X);this._isRegion=(this._isHoriz&&this._isVert);},clearTicks:function(){YAHOO.widget.SliderThumb.superclass.clearTicks.call(this);this.tickSize=0;this._graduated=false;},getValue:function(){return (this._isHoriz)?this.getXValue():this.getYValue();},getXValue:function(){if(!this.available){return 0;}var r=this.getOffsetFromParent();if(YAHOO.lang.isNumber(r[0])){this.lastOffset=r;return (r[0]-this.startOffset[0]);}else{return (this.lastOffset[0]-this.startOffset[0]);}},getYValue:function(){if(!this.available){return 0;}var r=this.getOffsetFromParent();if(YAHOO.lang.isNumber(r[1])){this.lastOffset=r;return (r[1]-this.startOffset[1]);}else{return (this.lastOffset[1]-this.startOffset[1]);}},toString:function(){return "SliderThumb "+this.id;},onChange:function(r,D){}});YAHOO.register("slider",YAHOO.widget.Slider,{version:"2.4.1",build:"742"});
    if (!Y.YUI2) {
        Y.YUI2 = YAHOO;
    }
    if (!YAHOO._activ && YAHOO.util.Event) {
        YAHOO._activ = true;
        YAHOO.util.Event._load();
    }
}, '2.4.1' ,{"requires": ["yui2-yahoo", "yui2-dom", "yui2-event", "yui2-dragdrop"], "optional": ["yui2-animation"]});
