"use strict";

Camera.prototype.fakeZInPixelSpace = function (z) {
    return z * this.mRenderCache.mWCToPixelRatio;
};

Camera.prototype.wcPosToPixel = function (p) {
    var x = this.mViewport[Camera.eViewport.eOrgX] + ((p[0] - this.mRenderCache.mCameraOrgX) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    var y = this.mViewport[Camera.eViewport.eOrgY] + ((p[1] - this.mRenderCache.mCameraOrgY) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    var z = this.fakeZInPixelSpace(p[2]);
    return vec3.fromValues(x, y, z);
};

Camera.prototype.wcDirToPixel = function (d) {
    var x = d[0] * this.mRenderCache.mWCToPixelRatio;
    var y = d[1] * this.mRenderCache.mWCToPixelRatio;
    var z = d[2];
    return vec3.fromValues(x, y, z);
};

Camera.prototype.wcSizeToPixel = function (s) {
    return (s * this.mRenderCache.mWCToPixelRatio) + 0.5;
};

Camera.prototype.VPpixelPosToWC = function(p) {
    var x = (p[0] - 0.5) / this.mRenderCache.mWCToPixelRatio + this.mRenderCache.mCameraOrgX;
    var y = (p[1] - 0.5) / this.mRenderCache.mWCToPixelRatio + this.mRenderCache.mCameraOrgY;
    return vec2.fromValues(x, y);
};

Camera.prototype.VPpixelSizeToWC = function(s) {
    return (s[0] - 0.5) / this.mRenderCache.mWCToPixelRatio;
};

Camera.prototype.VPpixelSizeVec2ToWC = function(s) {
    var x = (s[0] - 0.5) / this.mRenderCache.mWCToPixelRatio;
    var y = (s[1] - 0.5) / this.mRenderCache.mWCToPixelRatio;
    return vec2.fromValues(x, y);
};
