"use strict";

function RigidShape(xf) {
    this.mLine = new LineRenderable();
    this.mLine.setColor([1, 1, 1, 1]);
    
    this.mXform = xf;
    this.mAcceleration = engine.Physics.getSystemAcceleration();
    this.mVelocity = vec2.fromValues(0, 0);
    this.mType = "";
    
    this.mInvMass = 1;
    this.mInertia = 0;
    
    this.mFriction = 0.8;
    this.mRestitution = 0.2;
    
    this.mAngularVelocity = 0;
    
    this.mBoundRadius = 0;
    
    this.mDrawBounds = false;
}

RigidShape.prototype.getInvMass = function() { return this.mInvMass; };
RigidShape.prototype.getInertia = function() { return this.mInertia; };
RigidShape.prototype.getFriction = function() { return this.mFriction; };
RigidShape.prototype.getRestitution = function() { return this.mRestitution; };
RigidShape.prototype.getAngularVelocity = function() { return this.mAngularVelocity; };

RigidShape.prototype.setMass = function(m) { 
    if (m > 0) {
        this.mInvMass = 1 / m;
        this.mAcceleration = engine.Physics.getSystemAcceleration();
    } else {
        this.mInvMass = 0;
        this.mAcceleration = [0, 0];
        
        
    }
    this.updateInertia();
};
RigidShape.prototype.setInertia = function(i) { this.mInertia = i; };
RigidShape.prototype.setFriction = function(f) { this.mFriction = f; };
RigidShape.prototype.setRestitution = function(r) { this.mRestitution = r; };
RigidShape.prototype.setAngularVelocity = function(w) { this.mAngularVelocity = w; };
RigidShape.prototype.setAngularVelocityDelta = function(dw) { this.mAngularVelocity += dw; };

RigidShape.prototype.toggleDrawBound = function() {
    this.mDrawBounds = !this.mDrawBounds;
};

RigidShape.prototype.getCenter = function() {
    return this.mXform.getPosition();
};

RigidShape.prototype.setBoundRadius = function(r) {
    this.mBoundRadius = r;
};
RigidShape.prototype.getBoundRadius = function() {
    return this.mBoundRadius;
};

RigidShape.prototype.setVelocity = function(x, y) {
    this.mVelocity[0] = x;
    this.mVelocity[1] = y;
};
RigidShape.prototype.getVelocity = function() { return this.mVelocity;};
RigidShape.prototype.flipVelocity = function() { 
    this.mVelocity[0] = -this.mVelocity[0];
    this.mVelocity[1] = -this.mVelocity[1];
};

RigidShape.prototype.travel = function() {
    let dt = engine.core.loop.getUpdateIntervalInSeconds();
    
    vec2.scaleAndAdd(this.mVelocity, this.mVelocity, this.mAcceleration, dt);
    
    
    let p = this.mXform.getPosition();
    vec2.scaleAndAdd(p, p, this.mVelocity, dt);
    
    this.mXform.incRotationByRad(this.mAngularVelocity * dt);
};

RigidShape.prototype.adjustPositionBy = function(v, delta) {
    let p = this.mXform.getPosition();
    vec2.scaleAndAdd(p, p, v, delta);
};

let kRigidShapeDelta = 0.01;
RigidShape.prototype.update = function () {

    if (this.mInvMass === 0)
        return;
    
    if (engine.Physics.getHasMotion())
        this.travel();
};
 
RigidShape.prototype.userSetsState = function() {
    let delta = 0;
    
    if (engine.keyboard.isPressed("ArrowUp")) {
        delta = kRigidShapeDelta;
    }
    if (engine.keyboard.isPressed("ArrowDown")) {
        delta = -kRigidShapeDelta;
    }
    if (delta !== 0) {
        if (engine.keyboard.isPressed("M")) {
            let m = 0;
            if (this.mInvMass > 0) 
                m = 1/this.mInvMass;
            this.setMass(m + delta*10);
        }
        if (engine.keyboard.isPressed("F")) {
            this.mFriction += delta;
            if (this.mFriction < 0)
                this.mFriction = 0;
            if (this.mFriction > 1)
                this.mFriction = 1;
        }
        if (engine.keyboard.isPressed("R")) {
            this.mRestitution += delta;
            if (this.mRestitution < 0)
                this.mRestitution = 0;
            if (this.mRestitution > 1)
                this.mRestitution = 1;
        }
    }
    
};

RigidShape.prototype.boundTest = function (otherShape) {
    let vFrom1to2 = [0, 0];
    vec2.subtract(vFrom1to2, otherShape.mXform.getPosition(), this.mXform.getPosition());
    let rSum = this.mBoundRadius + otherShape.mBoundRadius;
    let dist = vec2.length(vFrom1to2);
    if (dist > rSum) {
        
        return false;
    }
    return true;
};

RigidShape.prototype.draw = function(aCamera) {
    if (!this.mDrawBounds)
        return;
    
    let len = this.mBoundRadius * 0.5;
    
    let x = this.mXform.getXPos();
    let y = this.mXform.getYPos();
    
    this.mLine.setColor([1, 1, 1, 1]);
    this.mLine.setFirstVertex(x - len, y);  
    this.mLine.setSecondVertex(x + len, y); 
    this.mLine.draw(aCamera);
    
    this.mLine.setFirstVertex(x, y + len);  
    this.mLine.setSecondVertex(x, y - len); 
    this.mLine.draw(aCamera);
};

RigidShape.kNumCircleSides = 16;
RigidShape.prototype.drawCircle = function(aCamera, r) {
    let pos = this.mXform.getPosition();    
    let prevPoint = vec2.clone(pos);
    let deltaTheta = (Math.PI * 2.0) / RigidShape.kNumCircleSides;
    let theta = deltaTheta;
    prevPoint[0] += r;
    let i, x, y;
    for (i = 1; i <= RigidShape.kNumCircleSides; i++) {
        x = pos[0] + r * Math.cos(theta);
        y = pos[1] +  r * Math.sin(theta);
        
        this.mLine.setFirstVertex(prevPoint[0], prevPoint[1]);
        this.mLine.setSecondVertex(x, y);
        this.mLine.draw(aCamera);
        
        theta = theta + deltaTheta;
        prevPoint[0] = x;
        prevPoint[1] = y;
    }
};

let kPrecision = 2;
RigidShape.prototype.getCurrentState = function() {
    let m = this.mInvMass;
    if (m !== 0)
        m = 1/m;
    
    return "M=" + m.toFixed(kPrecision) +
           "(I=" + this.mInertia.toFixed(kPrecision) + ")" +
           " F=" + this.mFriction.toFixed(kPrecision) +
           " R=" + this.mRestitution.toFixed(kPrecision);
};

RigidShape.prototype.getType = function() { return this.mType; };

RigidShape.prototype.resolveParticleCollision = function(aParticle, xf) {
    let status = false;
    if (this.getType()==="RigidCircle"){
        status = engine.ParticleSystem.resolveCirclePos(this, aParticle);
        return status;
    }
    else if( this.getType()==="RigidRectangle"){
        status = engine.ParticleSystem.resolveRectPos(this, xf);
        return status;
    }
    else{return status;}
};

RigidShape.prototype.setTransform = function(xf){
    this.mXform = xf;
};
