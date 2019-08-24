"use strict";  

function LightRenderable(myTexture) {
    SpriteAnimateRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, engine.defaultResources.getLightShader());

    this.mLights = [];
}
engine.core.inheritPrototype(LightRenderable, SpriteAnimateRenderable);

LightRenderable.prototype.draw = function (aCamera) {
    this.mShader.setLights(this.mLights);
    SpriteAnimateRenderable.prototype.draw.call(this, aCamera);
};

LightRenderable.prototype.numLights = function () {
    return this.mLights.length;
};

LightRenderable.prototype.getLightAt = function (index) {
    return this.mLights[index];
};

LightRenderable.prototype.addLight = function (l) {
    this.mLights.push(l);
};



