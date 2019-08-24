"use strict";  

function LineRenderable(x1, y1, x2, y2) {
    Renderable.call(this);
    Renderable.prototype.setColor.call(this, [0, 0, 0, 1]);
    Renderable.prototype._setShader.call(this, engine.defaultResources.getLineShader());

    this.mPointSize = 1;
    this.mDrawVertices = false;
    this.mShowLine = true;

    this.mP1 = vec2.fromValues(0, 0);
    this.mP2 = vec2.fromValues(0, 0);

    if (x1 !== "undefined") {
        this.setVertices(x1, y1, x2, y2);
    }
}
engine.core.inheritPrototype(LineRenderable, Renderable);




LineRenderable.prototype.draw = function (aCamera) {
    this.mShader.setPointSize(this.mPointSize);
    let gl = engine.graphics.gl;
    this.mShader.activateShader(this.mColor, aCamera);  

    let sx = this.mP1[0] - this.mP2[0];
    let sy = this.mP1[1] - this.mP2[1];
    let cx = this.mP1[0] - sx / 2;
    let cy = this.mP1[1] - sy / 2;
    let xf = this.getXform();
    xf.setSize(sx, sy);
    xf.setPosition(cx, cy);

    this.mShader.loadObjectTransform(this.mXform.getXform());
    if (this.mShowLine) {
        gl.drawArrays(gl.LINE_STRIP, 0, 2);
    }
    if (!this.mShowLine || this.mDrawVertices) {
        gl.drawArrays(gl.POINTS, 0, 2);
    }
};

LineRenderable.prototype.setDrawVertices = function (s) { this.mDrawVertices = s; };

LineRenderable.prototype.getDrawVertices = function () { return this.mDrawVertices; };

LineRenderable.prototype.setShowLine = function (s) { this.mShowLine = s; };

LineRenderable.prototype.getShowLine = function () { return this.mShowLine; };

LineRenderable.prototype.setPointSize = function (s) { this.mPointSize = s; };

LineRenderable.prototype.setVertices = function (x1, y1, x2, y2) {
    this.setFirstVertex(x1, y1);
    this.setSecondVertex(x2, y2);
};

LineRenderable.prototype.setFirstVertex = function (x, y) {
    this.mP1[0] = x;
    this.mP1[1] = y;
};

LineRenderable.prototype.setSecondVertex = function (x, y) {
    this.mP2[0] = x;
    this.mP2[1] = y;
};

LineRenderable.prototype.getFirstVertex = function() { return this.mP1; };
LineRenderable.prototype.getSecondVertex = function() { return this.mP2; };



