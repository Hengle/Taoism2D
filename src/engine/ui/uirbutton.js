"use strict";

function UIRButton(callback, context, position, text, textSize, textColor, aCamera) {
    this.mBg = new SpriteRenderable("assets/ui/radarbutton.png");
    this.mBg._setShader(engine.defaultResources.getUnlitSpriteShader());
    this.mBg.setElementUVCoordinate(0.0, 1.0, 0.5, 1.0);
    
    let pixSize=textSize*(aCamera.getViewport()[2]/aCamera.getWCWidth());
    let tPos = [position[0]+pixSize/2+5,position[1]];
    
    this.mText = new UIText(text, 
                            tPos, 
                            textSize, 
                            UIText.eHAlignment.eLeft, 
                            UIText.eVAlignment.eCenter,
                            textColor);
 
    
    this.mCallBack = callback;
    this.mContext = context;
    
    
    this.mHover = false;
    this.mClick = false;
    
    this.mBg.getXform().setZPos(3);
    UIElement.call(this, position, [20,20]);
}
engine.core.inheritPrototype(UIRButton, UIElement);

UIRButton.prototype.getText = function() {
    return this.mText;
};

UIRButton.prototype.draw = function (aCamera) {
    if(this.mVisible)
    {
        this._applyUIXform(aCamera);
        this.mBg.draw(aCamera);
        if(this.mText !== null)
            this.mText.draw(aCamera);
    }
};

UIRButton.prototype.update = function () {
    UIElement.prototype.update.call(this);
    
    this.mClick = false;
   
    
    
    
    
    let mousePos = vec2.fromValues(engine.mouse.position.x,
                                engine.mouse.position.y);
    let mouseOver = this.getUIBBox().containsPoint(mousePos[0], mousePos[1]);
    

    
    if(engine.mouse.wasPressed(0)){
        if(mouseOver){
            let x = this.mBg.getElementUVCoordinateArray();
            if(x[2]!==0||x[0]!==1||x[5]!==0||x[1]!==0.5){
                this.mClick = true;
                this.mBg.setElementUVCoordinate(0.0, 1.0, 0.0, 0.5);
                if(this.mCallBack !== null)
                    this.mCallBack.call(this.mContext);
            }
        }
    }
};

UIRButton.prototype.setTextString = function(text) {
    this.mText.setText(text);
};

UIRButton.prototype.setTextColor = function(color) {
    this.mText.setColor(color);
};

UIRButton.prototype.setTextHeight = function(height) {
    this.mText.setTextHeight(height);
};

UIRButton.prototype.deselect = function(){
    this.mBg.setElementUVCoordinate(0.0, 1.0, 0.5, 1.0);
    this.mClick = false;
};

UIRButton.prototype.getClick = function(){
    return this.mClick;
};
UIRButton.prototype._applyUIXform = function(aCamera) {
    let rendXform = this.mBg.getXform();
    let WCPos = aCamera.VPpixelPosToWC(this.mUIXform.getPosition());
    rendXform.setPosition(WCPos[0], WCPos[1]);
    let height= this.mText.getXform().getHeight();
    rendXform.setSize(height, height);
    this.mText.getXform().setXPos(this.mText.getXform().getXPos());
};
