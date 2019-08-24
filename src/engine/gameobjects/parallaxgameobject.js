"use strict";  

function ParallaxGameObject(renderableObj, scale, aCamera) {
    this.mRefCamera = aCamera;
    this.mCameraWCCenterRef = vec2.clone(this.mRefCamera.getWCCenter());
    this.mParallaxScale = 1;
    this.setParallaxScale(scale);
    TiledGameObject.call(this, renderableObj);
}
engine.core.inheritPrototype(ParallaxGameObject, TiledGameObject);

ParallaxGameObject.prototype.update = function () {
    this._refPosUpdate(); 
    let pos = this.getXform().getPosition();  
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed() * this.mParallaxScale);
};

ParallaxGameObject.prototype._refPosUpdate = function () {
    let deltaT = vec2.fromValues(0, 0);
    vec2.sub(deltaT, this.mCameraWCCenterRef, this.mRefCamera.getWCCenter());
    this.setWCTranslationBy(deltaT);
    vec2.sub(this.mCameraWCCenterRef, this.mCameraWCCenterRef, deltaT); 
};

ParallaxGameObject.prototype.setWCTranslationBy = function (delta) {
    let f = (1-this.mParallaxScale);
    this.getXform().incXPosBy(-delta[0] * f);
    this.getXform().incYPosBy(-delta[1] * f);
};

ParallaxGameObject.prototype.getParallaxScale = function () {
    return this.mParallaxScale;
};

ParallaxGameObject.prototype.setParallaxScale = function(s) {
    if (s <= 0) {
        this.mParallaxScale = 1;
    } else {
        this.mParallaxScale = 1/s;
    }
};
