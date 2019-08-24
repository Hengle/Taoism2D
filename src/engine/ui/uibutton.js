"use strict";
function UIButton(callback, context, position, size, text, textSize) {
    this.mBgColor = [0.75,0.75,0.75,1];
    this.mBgHoverColor = [0.5,0.5,0.5,1];
    this.mBgClickColor = [0.25,0.2,0.25,1];
    
    this.mBg = new UIRenderable(this.mBgColor, position, size);
    
    this.mStencil = new UITexture("assets/ui/buttonstencil.png", position, size);
    
    this.mTextColor = [0,0,0,1];
    this.mHoverTextColor = this.mTextColor;
    this.mClickTextColor = [1,1,1,1];
    
    this.mText = new UIText(text, 
                            position, 
                            textSize, 
                            UIText.eHAlignment.eCenter, 
                            UIText.eVAlignment.eCenter,
                            this.mTextColor);
    
    
    this.mCallBack = callback;
    this.mContext = context;
    
    this.mHover = false;
    this.mClick = false;
    
    UIElement.call(this, position, size);
}
engine.core.inheritPrototype(UIButton, UIElement);

UIButton.prototype.getText = function() {
    return this.mText;
};

UIButton.prototype.draw = function (aCamera) {
    if(this.mVisible)
    {
        engine.Stencil.beginDrawToStencilBuffer();
        engine.Stencil.clearStencilBuffer();
        this.mStencil.draw(aCamera);
        engine.Stencil.endDrawToStencilBuffer();
        
        engine.Stencil.beginStencilCulling();
        this.mBg.draw(aCamera);
        engine.Stencil.endStencilCulling();
        
        if(this.mText !== null)
            this.mText.draw(aCamera);
    }
};

UIButton.prototype.update = function () {
    UIElement.prototype.update.call(this);
    let uiXform = this.getUIXform();
   
    
    this.mText.getUIXform().setPosition(uiXform.getXPos(), uiXform.getYPos());
    
    
    let mousePos = vec2.fromValues(engine.mouse.position.x,
                                engine.mouse.position.y);
    this.mHover = this.getUIBBox().containsPoint(mousePos[0], mousePos[1]);

    
    if(engine.mouse.wasPressed(0)){
        if(this.mHover){
            this.mClick = true;
        }
    }
    
    if(engine.mouse.wasReleased(0)){
        if(this.mClick) {
            this.mClick = false;
            
            if(this.mHover){
                if(this.mCallBack !== null)
                    this.mCallBack.call(this.mContext);
            }
        }
    }
    
    this._setBG();
    this._setTextColor();
};

UIButton.prototype.setTextString = function(text) {
    this.mText.setText(text);
};

UIButton.prototype.setTextColor = function(color) {
    this.mTextColor = color;
    this.mText.setColor(color);
};

UIButton.prototype.setHoverTextColor = function(color){
    this.mClickTextColor = color;
};

UIButton.prototype.setClickTextColor = function(color){
    this.mClickTextColor = color;
};

UIButton.prototype.setTextHeight = function(height) {
    this.mText.setTextHeight(height);
};

UIButton.prototype.setBGColor = function(color) {
    this.mBgColor = color;
    this.mBg.setColor(color);
};

UIButton.prototype.setBGHoverColor = function(color) {
    this.mBgHoverColor = color;
};

UIButton.prototype.setBGClickColor = function(color) {
    this.mBgClickColor = color;
};

UIButton.prototype.setStencil = function(stencilSprite) {
    this.mStencil.setTexture(stencilSprite);
};

UIButton.prototype._setBG = function() {
    if(this.mClick) {
        this.mBg.setColor(this.mBgClickColor);
    }
    else if(this.mHover) {
        this.mBg.setColor(this.mBgHoverColor);
    }
    else {
        this.mBg.setColor(this.mBgColor);
    }
};

UIButton.prototype._setTextColor = function() {
    if(this.mClick) {
        this.mText.setColor(this.mClickTextColor);
    }
    else if(this.mHover) {
        this.mText.setColor(this.mHoverTextColor);
    }
    else {
        this.mText.setColor(this.mTextColor);
    }
};
