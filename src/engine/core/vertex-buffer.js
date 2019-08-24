"use strict";  
engine.vertexBuffer = (function () {
    let mSquareVertexBuffer = null;

    let mTextureCoordBuffer = null;

    let verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    let textureCoordinates = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];
    let verticesOfLine = [
        0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    let mLineVertexBuffer = null;

    let init = function () {
        let gl = engine.graphics.gl;

        mSquareVertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
        

        mTextureCoordBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, mTextureCoordBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        mLineVertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, mLineVertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfLine), gl.STATIC_DRAW);
        
    };

    let getGLVertexRef = function () { return mSquareVertexBuffer; };
    
    let getGLTexCoordRef = function () { return mTextureCoordBuffer; };
    
    let getGLLineVertexRef = function () { return mLineVertexBuffer; };

    let cleanUp = function () {
        let gl = engine.graphics.gl;
        gl.deleteBuffer(mSquareVertexBuffer);
        gl.deleteBuffer(mTextureCoordBuffer);
        gl.deleteBuffer(mLineVertexBuffer);
    };

    let mPublic = {
        init,
        getGLVertexRef,
        getGLTexCoordRef,
        getGLLineVertexRef,
        cleanUp
    };

    return mPublic;
}());
