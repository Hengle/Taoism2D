"use strict";  

function IllumRenderable(myTexture, myNormalMap) {
    LightRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, engine.defaultResources.getIllumShader());

    this.mNormalMap = myNormalMap;


    this.mMaterial = new Material();
}
engine.core.inheritPrototype(IllumRenderable, LightRenderable);

IllumRenderable.prototype.draw = function (aCamera) {
    engine.Textures.activateNormalMap(this.mNormalMap);
    this.mShader.setMaterialAndCameraPos(this.mMaterial, aCamera.getPosInPixelSpace());
    LightRenderable.prototype.draw.call(this, aCamera);
};

IllumRenderable.prototype.getMaterial = function () { return this.mMaterial; };



