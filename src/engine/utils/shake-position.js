"use strict";

function ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration) {
    this.mXMag = xDelta;
    this.mYMag = yDelta;

    this.mCycles = shakeDuration; 
    this.mOmega = shakeFrequency * 2 * Math.PI; 

    this.mNumCyclesLeft = shakeDuration;
}

ShakePosition.prototype.shakeDone = function () {
    return (this.mNumCyclesLeft <= 0);
};

ShakePosition.prototype.getShakeResults = function () {
    this.mNumCyclesLeft--;
    let c = [];
    let fx = 0;
    let fy = 0;
    if (!this.shakeDone()) {
        let v = this._nextDampedHarmonic();
        fx = (Math.random() > 0.5) ? -v : v;
        fy = (Math.random() > 0.5) ? -v : v;
    }
    c[0] = this.mXMag * fx;
    c[1] = this.mYMag * fy;
    return c;
};

ShakePosition.prototype._nextDampedHarmonic = function () {
    let frac = this.mNumCyclesLeft / this.mCycles;
    return frac * frac * Math.cos((1 - frac) * this.mOmega);
};
