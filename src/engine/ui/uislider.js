"use strict";

function UISlider(position, size) {
    UIBar.call(this, position, size);
    this.setMidVisible(false);
    this.configInterpolation(1, 1);
    
    this.mClick = false;
    
    this.mMaxPos = position[0] + (size[0]/2);
    this.mMinPos = position[0] - (size[0]/2);
    
    this.setTopElemColor([0,0,0.8,1]);
    
    this.mHandle = new UITexture("assets/ui/sliderhandle.png", [this.mMaxPos, position[1]], [30,60]);
    this.mHandle.setColor([0,0.5,1,1]);
    
    this.mTextVisible = true;
    this.mToFixedValue = 2;
    this.mText = new UIText(this.mMaxValue.toFixed(this.mToFixedValue).toString(), 
                            position, 
                            3, 
                            UIText.eHAlignment.eCenter, 
                            UIText.eVAlignment.eCenter,
                            [0, 0, 0, 1]);
    let pos = this.getUIXform().getXPos() + (this.getUIXform().getSize()[0]/2) + 75;
    this.mText.getUIXform().setXPos(pos);
    
    this.mSnap = false;
    this.mSnapBy = 1;
    
    if(this.mVertical) {
        this.mMaxPos = position[1] + (size[1]/2);
        this.mMinPos = position[1] - (size[1]/2);
        
        this.setHandleTexture("assets/ui/vsliderhandle.png");
        this.mHandle.getUIXform().setPosition(position[0], this.mMaxPos);
        this.mHandle.getUIXform().setSize(60, 30);
        
        let pos = this.getUIXform().getYPos() + (this.getUIXform().getSize()[1]/2) + 50;
        this.mText.getUIXform().setPosition(position[0], pos);
    }
    
    this.mMultiplier = 1;
};
engine.core.inheritPrototype(UISlider, UIBar);

UISlider.prototype.draw = function(aCamera) {
    if(this.mVisible) {
        UIBar.prototype.draw.call(this, aCamera);
        this.mHandle.draw(aCamera);
        if(this.mTextVisible)
        {
            this.mText.draw(aCamera);
        }
    }
};

UISlider.prototype.update = function() {
    let mousePos = vec2.fromValues(engine.mouse.position.x,
                                engine.mouse.position.y);
                                
    let mouseOver = this.mHandle.getUIBBox().containsPoint(mousePos[0], mousePos[1]);      
    
    if(engine.mouse.wasPressed(0)){
        if(mouseOver){
            this.mClick = true;
        }
    }
    
    if(engine.mouse.wasReleased(0)){
        this.mClick = false;
    }
    
    if(this.mClick) {
        let barSize = this.mMaxPos - this.mMinPos;
        
        let pos = this.mVertical ? this._checkPosOnBar(mousePos[1]) : this._checkPosOnBar(mousePos[0]);
        
        let handlePosValue = (pos - this.mMinPos)/barSize * this.mMaxValue;
        
        if(this.mSnap) {
            let remainder = handlePosValue%this.mSnapBy;
            if(remainder < (this.mSnapBy/2)) {
                handlePosValue -= remainder;
            }
            else if(remainder > (this.mSnapBy/2)) {
                handlePosValue = handlePosValue + this.mSnapBy - remainder;
            }
            pos = ((handlePosValue/this.mMaxValue) * barSize) + this.mMinPos;
            pos = this._checkPosOnBar(pos);
        }
        
        
        if(this.mVertical) {
            this.mHandle.getUIXform().setYPos(pos);
        }
        else {
            this.mHandle.getUIXform().setXPos(pos);
        }
        
        this.setCurrentValue(handlePosValue);
    }
    
    this.mText.setText((this.mCurValue*this.mMultiplier).toFixed(this.mToFixedValue).toString());
    
    UIBar.prototype.update.call(this);
};

UISlider.prototype.setHandleTexture = function (tex) {
    this.mHandle.setTexture(tex);
};

UISlider.prototype.setHandleSize = function(w, h) {
    this.mHandle.getUIXform().setSize(w, h);
};

UISlider.prototype.setHandleColor = function (c) {
    this.mHandle.setColor(c);
};

UISlider.prototype.setColor = function(c) {
    UIBar.prototype.setTopElemColor.call(this, c);
};

UISlider.prototype.setTextXOffset = function(v) {
    this.mText.getUIXform().setXPos(v);
};

UISlider.prototype.setTextColor = function(c) {
    this.mText.setColor(c);
};

UISlider.prototype.setTextSize = function(val) {
    this.mText.setTextHeight(val);
};

UISlider.prototype.setTextVisible = function(b) {
    this.mTextVisible = b;
};

UISlider.prototype.setToFixedValue = function(v) {
    this.mToFixedValue = v;
};

UISlider.prototype.setSnap = function(b) {
    this.mSnap = b;
};

UISlider.prototype.setSnapBy = function(v) {
    this.mSnapBy = v;
};

UISlider.prototype.setCurrentValue = function(v) {
    UIBar.prototype.setCurrentValue.call(this, v);
    
    if(this.mVertical) {
        this.mHandle.getUIXform().setYPos(((v/this.mMaxValue)*(this.mMaxPos-this.mMinPos))+this.mMinPos);
    }
    else {
        this.mHandle.getUIXform().setXPos(((v/this.mMaxValue)*(this.mMaxPos-this.mMinPos))+this.mMinPos);
    }
};

UISlider.prototype.setMultiplier = function(v) {
    this.mMultiplier = v;
};

UISlider.prototype._checkPosOnBar = function(pos) {
    if(pos < this.mMinPos) {
        return this.mMinPos;
    }
    if(pos > this.mMaxPos) {
        return this.mMaxPos;
    }
    return pos;
};
