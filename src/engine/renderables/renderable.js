"use strict";  

function Renderable() {
    this.mShader = engine.defaultResources.getConstColorShader();  
    this.mXform = new Transform(); 
    this.mColor = [1, 1, 1, 1];    
}

Renderable.prototype.draw = function (aCamera) {
    let gl = engine.graphics.gl;
    this.mShader.activateShader(this.mColor, aCamera);  
    this.mShader.loadObjectTransform(this.mXform.getXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

Renderable.prototype.update = function () {};

Renderable.prototype.getXform = function () { return this.mXform; };

Renderable.prototype.setColor = function (color) { this.mColor = color; };

Renderable.prototype.getColor = function () { return this.mColor; };



Renderable.prototype.swapShader = function (s) {
    let out = this.mShader;
    this.mShader = s;
    return out;
};

Renderable.prototype._setShader = function (s) { this.mShader = s; };
