"use strict";

function UISwitchToggle(position, size) {
    UISlider.call(this, position, size);
    this.setTextVisible(false);
    this.setMaxValue(1);
    
    this.setStencil("assets/ui/switchtogglestencil.png");
    this.setBGColor([1,1,1,1]);
    
    this.setTopElemColor([0,1,0,1]);
    
    this.setHandleTexture("assets/ui/switchtogglehandle.png");
    this.setHandleSize(size[1]+5, size[1]+5);
    this.setHandleColor([0,0.75,0,1]);
    
    this.mState = true;
};
engine.core.inheritPrototype(UISwitchToggle, UISlider);

UISwitchToggle.prototype.update = function() {
    let mousePos = vec2.fromValues(engine.mouse.position.x,
                                engine.mouse.position.y);
    
    let mouseOver = this.getUIBBox().containsPoint(mousePos[0], mousePos[1]);
    
    if(engine.mouse.wasPressed(0)){
        if(mouseOver){
            this.mClick = true;
        }
    }
    
    if(engine.mouse.wasReleased(0)){
        if(this.mClick) {
            this.mClick = false;
            
            if(mouseOver){
                this.setState(!this.mState);
            }
        }
    }
    
    UIBar.prototype.update.call(this);
};

UISwitchToggle.prototype.setState = function(b) {
    this.mState = b;
    if(this.mState) {
        this.mHandle.getUIXform().setXPos(this.mMaxPos);
    }
    else {
        this.mHandle.getUIXform().setXPos(this.mMinPos);
    }
    
    this.setCurrentValue(+this.mState);
};

UISwitchToggle.prototype.getState = function() {
    return this.mState;
};
