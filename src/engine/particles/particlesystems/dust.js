"use strict"

function Dust(DustParams){
    this.xPos=DustParams.xPos;
    this.yPos=DustParams.yPos;
    this.width=DustParams.width;
    this.yAcceleration=DustParams.yAcceleration;
    this.life=DustParams.life;
    this.xVelocity=DustParams.xVelocity;
    this.yVelocity=DustParams.yVelocity;
    this.flicker=DustParams.flicker;
    this.intensity=DustParams.intensity;
    this.xAcceleration=DustParams.xAcceleration;
    this.size=DustParams.size;
    this.yOffset=DustParams.yOffset;   
    ParticleSystem.call(this, "assets/particlesystem/particle.png", this.xPos, this.yPos, this.width, this.yAcceleration, this.life, this.xVelocity, this.yVelocity, this.flicker, this.intensity, this.xAcceleration, this.size, this.yOffset, [0,0,0,1], [.5,.5,.5,1], 1);    
}

engine.core.inheritPrototype(Dust,ParticleSystem);

let DustParams = function(xPos, yPos, width, yAcceleration, life, xVelocity, yVelocity, flicker, intensity, xAcceleration, size, yOffset){
    this.xPos=xPos||50;
    this.yPos=yPos||50;
    this.width=width||50;
    this.yAcceleration=yAcceleration||1;
    this.life=life||140;
    this.xVelocity=xVelocity||0;
    this.yVelocity=yVelocity||0;
    this.flicker=flicker||0;
    this.intensity=intensity||1;
    this.xAcceleration=xAcceleration||0;
    this.size=size||1;
    this.yOffset=yOffset||0;
};

Dust.prototype.update = function(){
    for(let i=0; i<this.intensity; i++){
    let p = this.createParticle(this.xPos, this.yPos);
    this.mAllParticles.addToSet(p);
    }
    engine.ParticleSystem.update(this.mAllParticles);
    let pSet = this.getSet().mSet;
    let setLength = pSet.length;    
    for (let i = 0; i < setLength; i++){
        this.applyDrift(pSet[i]);
        this.applySizeDelta(pSet[i]);
    }
};

Dust.prototype.applyDrift = function(pGO){
    let p = pGO.getParticle();
    let pAccel = p.getAcceleration();
    if(Math.floor(Math.random()*2) === 0){
        p.setAcceleration([pAccel[0]+(Math.random()-.5),pAccel[1]+(Math.random()-.5)]);
    }
    else{
        p.setAcceleration([pAccel[0]+(Math.random()-.5),pAccel[1]+(Math.random()-.5)]);
    }
};

Dust.prototype.applySizeDelta = function(pGO){
    if(Math.floor(Math.random()*2) === 0){
        pGO.setSizeDelta(1.01);
    }
    else{
        pGO.setSizeDelta(.99);
    }
};
