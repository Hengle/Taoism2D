"use strict";  

function SimpleShader(vertexShaderPath, fragmentShaderPath) {
    UnlitShader.call(this, vertexShaderPath, fragmentShaderPath);  
    
    this.mGlobalAmbientColor = null; 
    this.mGlobalAmbientIntensity = null; 

    let gl = engine.graphics.gl;

    this.mGlobalAmbientColor = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientColor");
    this.mGlobalAmbientIntensity = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientIntensity");
}

engine.core.inheritPrototype(SimpleShader, UnlitShader);

SimpleShader.prototype.activateShader = function (pixelColor, aCamera) {
    UnlitShader.prototype.activateShader.call(this, pixelColor, aCamera);
    
    let gl = engine.graphics.gl;
    gl.uniform4fv(this.mGlobalAmbientColor, engine.defaultResources.getGlobalAmbientColor());
    gl.uniform1f(this.mGlobalAmbientIntensity, engine.defaultResources.getGlobalAmbientIntensity())
};



