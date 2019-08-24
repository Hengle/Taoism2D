"use strict";

function InterpolateVec2(value, cycle, rate) {
    Interpolate.call(this, value, cycle, rate);
}
engine.core.inheritPrototype(InterpolateVec2, Interpolate);

InterpolateVec2.prototype._interpolateValue = function () {
    vec2.lerp(this.mCurrentValue, this.mCurrentValue, this.mFinalValue, this.mRate);
};
