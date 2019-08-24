"use strict";
function UISpriteButton(buttonSprite, callback, context, position, size, text, textSize) {
    UIButton.call(this, callback, context, position, size, text, textSize);
    
    this.mBGNormalUVs = [0.0, 1.0, 0.75, 1.0];
    this.mBGHoverUVs = [0.0, 1.0, 0.5, 0.75];
    this.mBGClickUVs = [0.0, 1.0, 0.25, 0.5];
    
    this.mBg = new UISprite(buttonSprite, position, size, this.mBGNormalUVs);
}
engine.core.inheritPrototype(UISpriteButton, UIButton);

UISpriteButton.prototype.draw = function (aCamera) {
    if(this.mVisible)
    {
        this.mBg.draw(aCamera);
        if(this.mText !== null)
            this.mText.draw(aCamera);
    }
};

UISpriteButton.prototype.setBGNormalUVs = function(left, right, bottom, top) {
    this.mBGNormalUVs = [left, right, bottom, top];
};

UISpriteButton.prototype.setBGHoverUVs = function(left, right, bottom, top) {
    this.mBGHoverUVs = [left, right, bottom, top];
};

UISpriteButton.prototype.setBGClickUVs = function(left, right, bottom, top) {
    this.mBGClickUVs = [left, right, bottom, top];
};

UISpriteButton.prototype._setBG = function() {
    if(this.mClick) {
        this.mBg.setElementUVCoordinate(this.mBGClickUVs[0],this.mBGClickUVs[1],this.mBGClickUVs[2],this.mBGClickUVs[3]);
    }
    else if(this.mHover) {
        this.mBg.setElementUVCoordinate(this.mBGHoverUVs[0],this.mBGHoverUVs[1],this.mBGHoverUVs[2],this.mBGHoverUVs[3]);
    }
    else {
        this.mBg.setElementUVCoordinate(this.mBGNormalUVs[0],this.mBGNormalUVs[1],this.mBGNormalUVs[2],this.mBGNormalUVs[3]);
    }
};
