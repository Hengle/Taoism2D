"use strict";  

function TextureShader(vertexShaderPath, fragmentShaderPath) {
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);  

    this.mShaderTextureCoordAttribute = null;
    this.mSamplerRef = null; 

    let gl = engine.graphics.gl;
    this.mSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uSampler");
    this.mShaderTextureCoordAttribute = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
}

engine.core.inheritPrototype(TextureShader, SimpleShader);

TextureShader.prototype.activateShader = function (pixelColor, aCamera) {
    SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);

    let gl = engine.graphics.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, engine.vertexBuffer.getGLTexCoordRef());
    gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
    gl.vertexAttribPointer(this.mShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(this.mSamplerRef, 0); 
    gl.uniform1i(this.mUseGlobalLight, true);
};

