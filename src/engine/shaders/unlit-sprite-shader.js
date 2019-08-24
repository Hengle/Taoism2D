"use strict";  

function UnlitSpriteShader(vertexShaderPath, fragmentShaderPath) {
    UnlitTextureShader.call(this, vertexShaderPath, fragmentShaderPath);  

    this.mTexCoordBuffer = null; 

    let initTexCoord = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];

    let gl = engine.graphics.gl;
    this.mTexCoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);
}

engine.core.inheritPrototype(UnlitSpriteShader, UnlitTextureShader);




UnlitSpriteShader.prototype.activateShader = function (pixelColor, aCamera) {
    UnlitShader.prototype.activateShader.call(this, pixelColor, aCamera);

    let gl = engine.graphics.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    gl.vertexAttribPointer(this.mShaderTextureCoordAttribute,
            2,
            gl.FLOAT,
            false,
            0,
            0);
    gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
};

UnlitSpriteShader.prototype.setTextureCoordinate = function (texCoord) {
    let gl = engine.graphics.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
};

UnlitSpriteShader.prototype.cleanUp = function () {
    let gl = engine.graphics.gl;
    gl.deleteBuffer(this.mTexCoordBuffer);
    UnlitShader.prototype.cleanUp.call(this);
};


