"use strict";

function UIToggle(position, size, optionTexts, textSize) {
    this.mVertical = size[0]<size[1];
    
    this.mBg = new UIRenderable([0,0,0,1], position, size);
    
    let amtOptions = optionTexts.length;
    let fgSize = [size[0]/amtOptions,size[1]];
    let nextPos = [(position[0]-(size[0]/2)+(fgSize[0]/2)),position[1]];
    
    if(this.mVertical)
    {
        fgSize = [size[0],size[1]/amtOptions];
        nextPos = [position[0], (position[1]+(size[1]/2)-(fgSize[1]/2))];
    }
    
    
    this.mFg = new UIRenderable([0.5,0,1,1], nextPos, fgSize);

    this.mText = [];
    
    
    this.mNormalTextColor = [1,1,1,1];
    this.mSelectedTextColor = this.mNormalTextColor;
    
    for(let i = 0; i < optionTexts.length; i++) {
        let newText = new UIText(optionTexts[i], 
                            nextPos, 
                            textSize, 
                            UIText.eHAlignment.eCenter, 
                            UIText.eVAlignment.eCenter,
                            this.mNormalTextColor);
        let newBBox = new BoundingBox(nextPos, fgSize[0], fgSize[1]);
        this.mText.push([newText, newBBox]);
        if(this.mVertical) {
            nextPos = [nextPos[0],nextPos[1]-fgSize[1]];
        }
        else {
            nextPos = [nextPos[0]+fgSize[0],nextPos[1]];
        }
    }                       
    
    this.mCurValue = 0;
    this.mClick = false;
    
    let startPos = this.mText[0][0].getUIXform().getXPos();
    if(this.mVertical) {
        startPos = this.mText[0][0].getUIXform().getYPos();
    }
    this.mInterpolation = new Interpolate(startPos, 60, 0.25);
    
    UIElement.call(this, position, size);
};
engine.core.inheritPrototype(UIToggle, UIElement);

UIToggle.prototype.draw = function(aCamera) {
    if(this.mVisible) {
        this.mBg.draw(aCamera);
        this.mFg.draw(aCamera);
        for(let i = 0; i < this.mText.length; i++) {
            this.mText[i][0].draw(aCamera);
        }   
    }
};

UIToggle.prototype.update = function() {
    UIElement.prototype.update.call(this);
    
    this.mInterpolation.updateInterpolation();
    
    let mousePos = vec2.fromValues(engine.mouse.position.x,
                                engine.mouse.position.y);
    
    let mouseOption = 0;
    let mouseOver = false;
    
    for(let i = 0; i < this.mText.length; i++)
    {
        if(this.mText[i][1].containsPoint(mousePos[0], mousePos[1])) {
            mouseOption = i;
            mouseOver = true;
        }
    }
    
    if(engine.mouse.wasPressed(0)){
        if(mouseOver){
            this.mClick = true;
        }
    }
    
    let fgXform = this.mFg.getUIXform();
    if(engine.mouse.wasReleased(0)){
        if(this.mClick) {
            this.mClick = false;
            
            if(mouseOver){
                this.mText[this.mCurValue][0].setColor(this.mNormalTextColor);
                
                this.mCurValue = mouseOption;

                let pos = this.mText[mouseOption][0].getUIXform().getXPos();
                if(this.mVertical) {
                    pos = this.mText[mouseOption][0].getUIXform().getYPos();
                }
                this.mInterpolation.setFinalValue(pos);
                
                this.mText[this.mCurValue][0].setColor(this.mSelectedTextColor);
            }
        }
    }
    
    if(this.mVertical) {
        fgXform.setYPos(this.mInterpolation.getValue());
    }
    else {
        fgXform.setXPos(this.mInterpolation.getValue());
    }
};

UIToggle.prototype.getCurValue = function() {
    return this.mCurValue;
};

UIToggle.prototype.setBGColor = function(c) {
    this.mBg.setColor(c);
};

UIToggle.prototype.setSelectionColor = function(c) {
    this.mFg.setColor(c);
};

UIToggle.prototype.setSelectedTextColor = function(c) {
    this.mSelectedTextColor = c;
    
    this.mText[this.mCurValue][0].setColor(this.mSelectedTextColor);
};

UIToggle.prototype.setNormalTextColor = function(c) {
    this.mNormalTextColor = c;
    
    for(let i = 0; i < this.mText.length; i++) {
            if(i !== this.mCurValue) {
                this.mText[i][0].setColor(this.mNormalTextColor);
            }
        }   
};

UIToggle.prototype.configInterpolation = function(cycles, rate) { 
    this.mInterpolation.configInterpolation(rate, cycles);
};
