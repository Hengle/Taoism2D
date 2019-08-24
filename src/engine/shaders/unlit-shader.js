"use strict";  

function UnlitShader(vertexShaderPath, fragmentShaderPath) {
    this.mCompiledShader = null;  
    this.mShaderVertexPositionAttribute = null; 
    this.mPixelColor = null;                    
    this.mModelTransform = null;                
    this.mViewProjTransform = null;             

    let gl = engine.graphics.gl;

    this.mVertexShader = this._compileShader(vertexShaderPath, gl.VERTEX_SHADER);
    this.mFragmentShader = this._compileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

    this.mCompiledShader = gl.createProgram();
    gl.attachShader(this.mCompiledShader, this.mVertexShader);
    gl.attachShader(this.mCompiledShader, this.mFragmentShader);
    gl.linkProgram(this.mCompiledShader);

    if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
        alert("Error linking shader");
        return null;
    }

    this.mShaderVertexPositionAttribute = gl.getAttribLocation(
        this.mCompiledShader,
        "aSquareVertexPosition"
    );

    this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
    this.mModelTransform = gl.getUniformLocation(this.mCompiledShader, "uModelTransform");
    this.mViewProjTransform = gl.getUniformLocation(this.mCompiledShader, "uViewProjTransform");
}

UnlitShader.prototype.getShader = function () { return this.mCompiledShader; };

UnlitShader.prototype.activateShader = function (pixelColor, aCamera) {
    let gl = engine.graphics.gl;
    gl.useProgram(this.mCompiledShader);
    gl.uniformMatrix4fv(this.mViewProjTransform, false, aCamera.getVPMatrix());
    gl.bindBuffer(gl.ARRAY_BUFFER, engine.vertexBuffer.getGLVertexRef());
    gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
        3,              
        gl.FLOAT,       
        false,          
        0,              
        0);             
    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
    gl.uniform4fv(this.mPixelColor, pixelColor);
};

UnlitShader.prototype.loadObjectTransform = function (modelTransform) {
    let gl = engine.graphics.gl;
    gl.uniformMatrix4fv(this.mModelTransform, false, modelTransform);
};

UnlitShader.prototype.cleanUp = function () {
    let gl = engine.graphics.gl;
    gl.detachShader(this.mCompiledShader, this.mVertexShader);
    gl.detachShader(this.mCompiledShader, this.mFragmentShader);
    gl.deleteShader(this.mVertexShader);
    gl.deleteShader(this.mFragmentShader);
};

UnlitShader.prototype._compileShader = function (filePath, shaderType) {
    let gl = engine.graphics.gl;
    let shaderSource = null, compiledShader = null;

    shaderSource = engine.ResourceMap.retrieveAsset(filePath);

    if (shaderSource === null) {
        alert("WARNING: Loading of:" + filePath + " Failed!");
        return null;
    }

    compiledShader = gl.createShader(shaderType);

    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};


