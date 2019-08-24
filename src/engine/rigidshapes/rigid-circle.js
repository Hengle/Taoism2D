"use strict";

let RigidCircle = function (xf, radius) {
    RigidShape.call(this, xf);
    this.mType = "RigidCircle";
    this.mRadius = radius;
    this.mBoundRadius = radius;
    
    this.updateInertia();
};
engine.core.inheritPrototype(RigidCircle, RigidShape);

RigidCircle.prototype.updateInertia = function () {
    if (this.mInvMass === 0) {
        this.mInertia = 0;
    } else {
        this.mInertia = (1 / this.mInvMass) * (this.mRadius * this.mRadius) / 12;
    }
};

RigidCircle.prototype.incShapeSizeBy= function (dt) {
    this.mRadius += dt;
};

RigidCircle.prototype.draw = function (aCamera) {
    RigidShape.prototype.draw.call(this, aCamera);
    
    this.mLine.setColor([0, 0, 0, 1]);
    this.drawCircle(aCamera, this.mRadius);
    
    let p = this.mXform.getPosition();
    let u = [p[0], p[1]+this.mBoundRadius];
    vec2.rotateWRT(u, u, this.mXform.getRotationInRad(), p);
    this.mLine.setColor([1, 1, 1, 1]);
    this.mLine.setFirstVertex(p[0], p[1]);
    this.mLine.setSecondVertex(u[0], u[1]);
    this.mLine.draw(aCamera);
    
    if (this.mDrawBounds)
        this.drawCircle(aCamera, this.mBoundRadius);
};

RigidCircle.prototype.update = function () {
    RigidShape.prototype.update.call(this);
};

RigidCircle.prototype.getRadius = function () { return this.mRadius; };
RigidCircle.prototype.setTransform = function (xf) {
    RigidShape.prototype.setTransform.call(this, xf);
    this.mRadius = xf.getWidth();  
};
