"use strict";  

function LineShader(vertexShaderPath, fragmentShaderPath) {
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);  

    this.mPointSizeRef = null;            
    let gl = engine.graphics.gl;

    this.mPointSizeRef = gl.getUniformLocation(this.mCompiledShader, "uPointSize");

    this.mPointSize = 1;
}
engine.core.inheritPrototype(LineShader, SimpleShader);

LineShader.prototype.activateShader = function (pixelColor, aCamera) {
    SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);

    let gl = engine.graphics.gl;
    gl.uniform1f(this.mPointSizeRef, this.mPointSize);
    gl.bindBuffer(gl.ARRAY_BUFFER, engine.vertexBuffer.getGLLineVertexRef());
    gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
        3,              
        gl.FLOAT,       
        false,          
        0,              
        0);

    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
};

LineShader.prototype.setPointSize = function (w) { this.mPointSize = w; };


