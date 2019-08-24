"use strict";  

function ShadowCasterShader(vertexShaderPath, fragmentShaderPath) {
    SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);  

    this.mLight = null;  

    this.mShaderLight = new ShaderLightAtIndex(this.mCompiledShader, 0);
}
engine.core.inheritPrototype(ShadowCasterShader, SpriteShader);

ShadowCasterShader.prototype.activateShader = function (pixelColor, aCamera) {
    SpriteShader.prototype.activateShader.call(this, pixelColor, aCamera);
    this.mShaderLight.loadToShader(aCamera, this.mLight);
};

ShadowCasterShader.prototype.setLight = function (l) {
    this.mLight = l;
};

