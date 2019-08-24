"use strict";  

function UnlitTextureShader(vertexShaderPath, fragmentShaderPath) {
    UnlitShader.call(this, vertexShaderPath, fragmentShaderPath);  

    this.mShaderTextureCoordAttribute = null;

    let gl = engine.graphics.gl;
    this.mSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uSampler");
    this.mShaderTextureCoordAttribute = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
}

engine.core.inheritPrototype(UnlitTextureShader, UnlitShader);

UnlitTextureShader.prototype.activateShader = function (pixelColor, aCamera) {
    UnlitShader.prototype.activateShader.call(this, pixelColor, aCamera);

    let gl = engine.graphics.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, engine.vertexBuffer.getGLTexCoordRef());
    gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
    gl.vertexAttribPointer(this.mShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
};

