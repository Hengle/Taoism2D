"use strict";

function UIBar(position, size) {
    this.mVertical = size[0]<size[1];
    
    this.mBg = new UIRenderable([0, 0, 0, 1], position, size);
    this.mBgVisible = true;
    
    this.mStencil = new UISprite("assets/ui/barstencil.png", position, size, [0,1,0,1]);
    if(this.mVertical) {
        this.setStencil("assets/ui/vbarstencil.png");
    }
    
    this.mMaxValue = 100;
    this.mCurValue = this.mMaxValue;
    
    this.mMidValElem = new UIRenderable([1, 0.75, 0, 1], position, size);
    this.mMidVisible = true;
    
    this.mTopValElem = new UIRenderable([1, 0, 0, 1], position, size);
    
    this.mInterValue = this.mCurValue;
    this.mInterpolation = new Interpolate(this.mCurValue, 120, 0.05);
    
    this.mIncreasing = false;
    
    this.mSnapInc = false;
    
    
    UIElement.call(this, position, size);
};
engine.core.inheritPrototype(UIBar, UIElement);

UIBar.prototype.draw = function(aCamera) {
    if(this.mVisible) {
        engine.Stencil.beginDrawToStencilBuffer();
        engine.Stencil.clearStencilBuffer();
        this.mStencil.draw(aCamera);
        engine.Stencil.endDrawToStencilBuffer();
        
        engine.Stencil.beginStencilCulling();
        if(this.mBgVisible){
            this.mBg.draw(aCamera);
        }
        if(this.mMidVisible) {
            this.mMidValElem.draw(aCamera);
        }
        this.mTopValElem.draw(aCamera);
        engine.Stencil.endStencilCulling();
    }
};

UIBar.prototype.update = function() {
    UIElement.prototype.update.call(this);
    this.mInterpolation.updateInterpolation();
    this.mInterValue = this.mInterpolation.getValue();
    
    let s = this.getUIXform().getSize();
    let p = this.getUIXform().getPosition();
    let topValue = this.mInterValue;
    
    if(this.mMidVisible) {
        let midValue = this.mIncreasing ? this.mCurValue : this.mInterValue;
        topValue = this.mIncreasing ? this.mInterValue : this.mCurValue;
        
        if(this.mVertical)
        {
            this.mMidValElem.getUIXform().setPosition(p[0], this._processPosition(p[1], s[1], midValue));
        }
        else {
            this.mMidValElem.getUIXform().setPosition(this._processPosition(p[0], s[0], midValue), p[1]);
        }
        this.mMidValElem.update();
    }
    
    if(this.mSnapInc && this.mIncreasing) {
        topValue = this.mCurValue;
    }

    if(this.mVertical) {
        this.mTopValElem.getUIXform().setPosition(p[0], this._processPosition(p[1], s[1], topValue));
    }
    else {
        this.mTopValElem.getUIXform().setPosition(this._processPosition(p[0], s[0], topValue), p[1]);
    }
    this.mTopValElem.update();
};

UIBar.prototype.setMaxValue = function(value) {
    if(value > 0) {
        this.mMaxValue = value;
    }
    
    if(this.mCurValue > this.mMaxValue) {
        this.mCurValue = this.mMaxValue;
        let config1 = this.mInterpolation.getConfig();
        this.mInterpolation = new Interpolate(this.mCurValue, config1[0], config1[1]);
    }
};

UIBar.prototype.setCurrentValue = function(value) {
    if(value < 0) {
        this.mCurValue = 0;
    }
    else {
        this.mCurValue = value;
    }
    
    if(this.mCurValue > this.mMaxValue) {
        this.mCurValue = this.mMaxValue;
    }
    
    if(value < this.mCurValue) {
        this.mIncreasing = false;
    }
    else {
        this.mIncreasing = true;
    }
    
    this.mInterpolation.setFinalValue(this.mCurValue);
};

UIBar.prototype.getMaxValue = function() { return this.mMaxValue; };

UIBar.prototype.getCurrentValue = function() { return this.mCurValue; };

UIBar.prototype.incCurrentValue = function(value) {
    if(this.mCurValue + value > this.mMaxValue)
        this.mCurValue = this.mMaxValue; 
    else if(this.mCurValue + value < 0)
        this.mCurValue = 0;
    else
        this.mCurValue = this.mCurValue + value;
    
    if(value < 0) {
        this.mIncreasing = false;
    }
    else if(value > 0) {
        this.mIncreasing = true;
    }
    
    this.mInterpolation.setFinalValue(this.mCurValue);
};

UIBar.prototype.setBGVisible = function(visible) { this.mBgVisible = visible; };

UIBar.prototype.setMidVisible = function(visible) { this.mMidVisible = visible; };

UIBar.prototype.configInterpolation = function(cycles, rate) { 
    this.mInterpolation.configInterpolation(rate, cycles);
};

UIBar.prototype.setBGColor = function(c) {
    this.mBg.setColor(c);
};

UIBar.prototype.setMidElemColor = function(c) {
    this.mMidValElem.setColor(c);
};

UIBar.prototype.setTopElemColor = function(c) {
    this.mTopValElem.setColor(c);
};

UIBar.prototype.setSnapIncrease = function(b) { this.mSnapInc = b; };

UIBar.prototype.setStencil = function(stencilSprite) {
    this.mStencil.setTexture(stencilSprite);
};

UIBar.prototype.setStencilUV = function(left, right, bottom, top) {
    this.mStencil.setElementUVCoordinate(left, right, bottom, top);
};

UIBar.prototype._processPosition = function(posVal, sizeVal, val) {
    return posVal - sizeVal + (sizeVal * (val / this.mMaxValue));
};
