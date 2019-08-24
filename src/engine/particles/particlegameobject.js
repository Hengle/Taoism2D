"use strict";  

function ParticleGameObject(texture, atX, atY, cyclesToLive) {
    let renderableObj = new ParticleRenderable(texture);
    this.xf = renderableObj.getXform();
    this.xf.setPosition(atX, atY);
    GameObject.call(this, renderableObj);
    
    this.mParticle = new Particle(this.xf.getPosition());
    this.mParticle.mOriginalPosition = [atX,atY];
    
    this.mDeltaColor = [0, 0, 0, 0];
    this.mSizeDelta = 0;
    this.mCyclesToLive = cyclesToLive;
}
engine.core.inheritPrototype(ParticleGameObject, GameObject);

ParticleGameObject.prototype.setFinalColor = function(f) {    
    vec4.sub(this.mDeltaColor, f, this.mRenderComponent.getColor());
    if (this.mCyclesToLive !== 0) {
        vec4.scale(this.mDeltaColor, this.mDeltaColor, 1/this.mCyclesToLive);
    }
};

ParticleGameObject.prototype.setSizeDelta = function(d) {
    this.mSizeDelta = d;
};

ParticleGameObject.prototype.hasExpired = function() {
    return (this.mCyclesToLive < 0);
};

ParticleGameObject.prototype.update = function () {
    this.mParticle.update();
    this.getXform().setPosition(this.mParticle.getXPos(), this.mParticle.getYPos());
    
    this.mCyclesToLive--;
    let c = this.mRenderComponent.getColor();
    vec4.add(c, c, this.mDeltaColor);
    
    let xf = this.getXform();
    let s = xf.getWidth() * this.mSizeDelta;
    xf.setSize(s, s);
};
ParticleGameObject.prototype.getParticle = function () { return this.mParticle; };
ParticleGameObject.prototype.getX = function () { return this.getXform(); };
