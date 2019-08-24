"use strict";  


function IllumShader(vertexShaderPath, fragmentShaderPath) {
    LightShader.call(this, vertexShaderPath, fragmentShaderPath);  

    this.mMaterial = null;
    this.mMaterialLoader = new ShaderMaterial(this.mCompiledShader);

    let gl = engine.graphics.gl;
    this.mCameraPos = null;  
    this.mCameraPosRef = gl.getUniformLocation(this.mCompiledShader, "uCameraPosition");

    this.mNormalSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uNormalSampler");
}
engine.core.inheritPrototype(IllumShader, LightShader);



IllumShader.prototype.activateShader = function(pixelColor, aCamera) {
    LightShader.prototype.activateShader.call(this, pixelColor, aCamera);
    let gl = engine.graphics.gl;
    gl.uniform1i(this.mNormalSamplerRef, 1); 
    this.mMaterialLoader.loadToShader(this.mMaterial);
    gl.uniform3fv(this.mCameraPosRef, this.mCameraPos);
};

IllumShader.prototype.setMaterialAndCameraPos = function(m, p) {
    this.mMaterial = m;
    this.mCameraPos = p;
};

