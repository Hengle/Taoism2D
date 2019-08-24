function ParticleSystem(texture, xPos, yPos, width, yAcceleration, life, xVelocity, yVelocity, flicker, intensity, xAcceleration, size, yOffset, startColor, finalColor, yMultiplier){
    this.mAllParticles = new ParticleGameObjectSet();
    this.texture=texture;
    this.xPos=xPos;
    this.yPos=yPos;
    this.width=width;
    this.yAcceleration=yAcceleration;
    this.life=life;
    this.xVelocity=xVelocity;
    this.yVelocity=yVelocity;
    this.flicker=flicker;
    this.intensity=intensity;
    this.xAcceleration=xAcceleration;
    this.size=size;
    this.yOffset=yOffset;
    this.startColor=startColor;
    this.finalColor=finalColor;
    this.yMultiplier=yMultiplier;
    this.sizeBase=1;
}

ParticleSystem.prototype.incWidth = function(inc){
    this.width+=inc;
};

ParticleSystem.prototype.incyOffset = function(inc){
    this.yOffset+=inc;
};

ParticleSystem.prototype.incyAcceleration = function(inc){
    this.yAcceleration+=inc;
};

ParticleSystem.prototype.incLife = function(inc){
    this.life+=inc;
};

ParticleSystem.prototype.incxVelocity = function(inc){
    this.xVelocity+=inc;
};

ParticleSystem.prototype.incParticleSize = function(inc){
    this.size+=inc;
};

ParticleSystem.prototype.incyVelocity = function(inc){
    this.yVelocity+=inc;
};

ParticleSystem.prototype.incFlicker = function(inc){
    this.flicker+=inc;
};

ParticleSystem.prototype.incIntensity = function(inc){
    this.intensity+=inc;
};

ParticleSystem.prototype.incxAcceleration = function(inc){
    this.xAcceleration+=inc;
};


ParticleSystem.prototype.getSet = function(){
    return this.mAllParticles;
};

ParticleSystem.prototype.getWidth = function(){
    return this.width;
};

ParticleSystem.prototype.getyOffset = function(){
    return this.yOffset;
};

ParticleSystem.prototype.getyAcceleration = function(){
    return this.yAcceleration;
};

ParticleSystem.prototype.getLife = function(){
    return this.life;
};

ParticleSystem.prototype.getxVelocity = function(){
    return this.xVelocity;
};

ParticleSystem.prototype.getParticleSize = function(){
    return this.size;
};

ParticleSystem.prototype.getyVelocity = function(){
    return this.yVelocity;
};

ParticleSystem.prototype.getFlicker = function(){
    return this.flicker;
};

ParticleSystem.prototype.getIntensity = function(){
    return this.intensity;
};

ParticleSystem.prototype.getxAcceleration = function(){
    return this.xAcceleration;
};

ParticleSystem.prototype.getStartColor = function(){
    return this.startColor;
};

ParticleSystem.prototype.getFinalColor = function(){
    return this.finalColor;
};

ParticleSystem.prototype.getyMultiplier = function(){
    return this.yMultiplier;
};

ParticleSystem.prototype.getSizeBase = function(){
    return this.sizeBase;
};

ParticleSystem.prototype.getPos = function(){
    return [this.xPos,this.yPos];
};

ParticleSystem.prototype.setWidth = function(width){
    this.width=width;
};

ParticleSystem.prototype.setyAcceleration = function(yAcceleration){
    this.yAcceleration=yAcceleration;
};

ParticleSystem.prototype.setLife = function(life){
    this.life=life;
};

ParticleSystem.prototype.setxVelocity = function(xVelocity){
    this.xVelocity=xVelocity;
};

ParticleSystem.prototype.setyVelocity = function(yVelocity){
    this.yVelocity=yVelocity;
};

ParticleSystem.prototype.setFlicker = function(flicker){
    this.flicker=flicker;
};

ParticleSystem.prototype.setIntensity = function(intensity){
    this.intensity=intensity;
};

ParticleSystem.prototype.setxAcceleration = function(xAcceleration){
    this.xAcceleration=xAcceleration;
};

ParticleSystem.prototype.setSize = function(size){
    this.size=size;
};

ParticleSystem.prototype.setyOffset = function(yOffset){
    this.yOffset=yOffset;
};

ParticleSystem.prototype.setPos = function(xPos,yPos){
    this.xPos=xPos;
    this.yPos=yPos;
};

ParticleSystem.prototype.setStartColor = function(color){
    this.startColor=color;
};

ParticleSystem.prototype.setFinalColor = function(color){
    this.finalColor=color;
};

ParticleSystem.prototype.setyMultiplier = function(num){
    this.yMultiplier=num;
};

ParticleSystem.prototype.setSizeBase = function(num){
    this.sizeBase=num;
};

ParticleSystem.prototype.update = function(){
    for(let i=0; i<this.intensity; i++){
    let p = this.createParticle(this.xPos, this.yPos);
    this.mAllParticles.addToSet(p);
    }
    engine.ParticleSystem.update(this.mAllParticles);
};

ParticleSystem.prototype.draw = function(aCamera){
    this.mAllParticles.draw(aCamera);
};

ParticleSystem.prototype.processCollision = function(objSet){
    engine.ParticleSystem.collideWithRigidSet(objSet, this.mAllParticles);
};

ParticleSystem.prototype.createParticle = function(atX,atY) {
    let life = this.life + Math.random() * (this.life*10);
    let width = -this.width + 
                  this.width*2 *
                  Math.random();
    let yOffset = this.yMultiplier *
                  this.yOffset *
                  Math.random();
    
    let p = new ParticleGameObject(this.texture, atX+width, atY+yOffset, life);
    let sTemp = Array.from(this.startColor);
    p.getRenderable().setColor(sTemp);
    
    let r = this.sizeBase + Math.random() * this.size;
    p.getXform().setSize(r, r);
    
    let fTemp = Array.from(this.finalColor);
    p.setFinalColor(fTemp);
    
    let fx;
    if (width > 0) {
        fx = 5 +
             ((-this.xVelocity+10) * -1) *
             Math.random();
    }
    else {
        fx = (5 * -1) +
             (-this.xVelocity+10) *
             Math.random();
    }
    let fy = 0 +
             this.yMultiplier*
             this.yVelocity *
             Math.random();
    p.getParticle().setVelocity([fx, fy]);
    p.setSizeDelta(1-(this.flicker*.005));
    p.getParticle().setAcceleration([this.xAcceleration*5, this.yMultiplier*this.yAcceleration*5]);
    return p;
};
