"use strict";  

function SpriteShader(vertexShaderPath, fragmentShaderPath) {
    TextureShader.call(this, vertexShaderPath, fragmentShaderPath);  

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

engine.core.inheritPrototype(SpriteShader, TextureShader);

SpriteShader.prototype.activateShader = function (pixelColor, aCamera) {
    SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);

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

SpriteShader.prototype.setTextureCoordinate = function (texCoord) {
    let gl = engine.graphics.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
};

SpriteShader.prototype.cleanUp = function () {
    let gl = engine.graphics.gl;
    gl.deleteBuffer(this.mTexCoordBuffer);
    SimpleShader.prototype.cleanUp.call(this);
};


SpriteShader.prototype.setLights = function (l) { };

SpriteShader.prototype.setMaterialAndCameraPos = function(m, p) { };


