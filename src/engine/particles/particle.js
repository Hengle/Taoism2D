"use strict";

function Particle(pos) {
    this.kPadding = 0.5;   
    
    this.mPosition = pos;  
    this.mOriginalPosition = null;
    this.mVelocity = vec2.fromValues(0, 0);
    this.mAcceleration = engine.ParticleSystem.getSystemtAcceleration();
    this.mDrag = 0.95; 
    
    this.mPositionMark = new LineRenderable();
    this.mDrawBounds = false;
    this.mDriftDir = Math.floor(Math.random()*2); 
    this.mSpin1 = Math.floor(Math.random()*2);    
    this.mSpin2 = Math.floor(Math.random()*2);    
    this.mParallaxDir = Math.floor(Math.random()*3); 
    this.mRotationVal = Math.floor(Math.random()*100); 
}

Particle.prototype.draw = function (aCamera) {
    if (!this.mDrawBounds) {
        return;
    }
    
    
    let x = this.mPosition[0];
    let y = this.mPosition[1];

    this.mPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  
    this.mPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); 
    this.mPositionMark.draw(aCamera);

    this.mPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);  
    this.mPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding); 
    this.mPositionMark.draw(aCamera);
};

Particle.prototype.update = function () {
    let dt = engine.core.loop.getUpdateIntervalInSeconds();
    
    let p = this.getPosition();
    vec2.scaleAndAdd(this.mVelocity, this.mVelocity, this.mAcceleration, dt);
    vec2.scale(this.mVelocity, this.mVelocity, this.mDrag);
    vec2.scaleAndAdd(p, p, this.mVelocity, dt);
};

Particle.prototype.setColor = function (color) {
    this.mPositionMark.setColor(color);
};

Particle.prototype.getColor = function () { return this.mPositionMark.getColor(); };

Particle.prototype.setDrawBounds = function(d) { this.mDrawBounds = d; };

Particle.prototype.getDrawBounds = function() { return this.mDrawBounds; };

Particle.prototype.setPosition = function (xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); };

Particle.prototype.getPosition = function () { return this.mPosition; };

Particle.prototype.getOriginalPosition = function () { return this.mOriginalPosition; };


Particle.prototype.getXPos = function () { return this.mPosition[0]; };

Particle.prototype.setXPos = function (xPos) { this.mPosition[0] = xPos; };

Particle.prototype.getYPos = function () { return this.mPosition[1]; };

Particle.prototype.setYPos = function (yPos) { this.mPosition[1] = yPos; };

Particle.prototype.setVelocity = function (f) { this.mVelocity = f; };

Particle.prototype.getVelocity = function () { return this.mVelocity; };

Particle.prototype.setAcceleration = function (g) { this.mAcceleration = g; };

Particle.prototype.getAcceleration = function () { return this.mAcceleration; };

Particle.prototype.setDrag = function (d) { this.mDrag = d; };

Particle.prototype.getDrag = function () { return this.mDrag; };
