function Snow(SnowParams){
    this.xPos=SnowParams.xPos;
    this.yPos=SnowParams.yPos;
    this.width=SnowParams.width;
    this.yAcceleration=SnowParams.yAcceleration;
    this.life=SnowParams.life;
    this.xVelocity=SnowParams.xVelocity;
    this.yVelocity=SnowParams.yVelocity;
    this.flicker=SnowParams.flicker;
    this.intensity=SnowParams.intensity;
    this.xAcceleration=SnowParams.xAcceleration;
    this.size=SnowParams.size;
    this.yOffset=SnowParams.yOffset;   
    ParticleSystem.call(this, "assets/particlesystem/snowparticle.png", this.xPos, this.yPos, this.width, this.yAcceleration, this.life, this.xVelocity, this.yVelocity, this.flicker, this.intensity, this.xAcceleration, this.size, this.yOffset, [.6,.6,.6,1], [.6,.6,.6,1], -1);    
}

engine.core.inheritPrototype(Snow,ParticleSystem);

SnowParams = function(xPos, yPos, width, yAcceleration, life, xVelocity, yVelocity, flicker, intensity, xAcceleration, size, yOffset){
    this.xPos=xPos||50;
    this.yPos=yPos||80;
    this.width=width||50;
    this.yAcceleration=yAcceleration||5;
    this.life=life||140;
    this.xVelocity=xVelocity||0;
    this.yVelocity=yVelocity||0;
    this.flicker=flicker||0;
    this.intensity=intensity||3;
    this.xAcceleration=xAcceleration||0;
    this.size=size||-0.5;
    this.yOffset=yOffset||0;
};

Snow.prototype.update = function(){
    for(let i=0; i<this.intensity; i++){
    let p = this.createParticle(this.xPos, this.yPos);
    this.mAllParticles.addToSet(p);
    p.xf.setZPos(3);
    }
    engine.ParticleSystem.update(this.mAllParticles);
    this.wrapParticles();
};


Snow.prototype.wrapParticles = function(){    
    let pSet = this.getSet().mSet;
    let setLength = pSet.length;    
    for (let i = 0; i < setLength; i++){        
        this.applyDrift(pSet[i]);
    }
};

Snow.prototype.applyDrift = function(pGO){    
    let p = pGO.getParticle();    
    let pPos = p.getPosition();
    let pAccel = p.getAcceleration();
    if(pPos[1] < 6){        
        p.setAcceleration([0,0]);
        p.setVelocity([0,0]);
        p.mRotationVal = 0;        
    }
    if(pPos[1] < 0){
        pGO.mCyclesToLive = 0;
    }
    let pOPos = p.getOriginalPosition();
    let dist = Math.abs(pPos[0] - pOPos[0]);
    if(dist % (Math.floor(Math.random()*5)) < 0.1){
        let test = Math.floor(Math.random()*2);
        if(test)
            p.mDriftDir = !p.mDriftDir;
    }
    if(p.mDriftDir){        
        p.setAcceleration([pAccel[0]+.025,pAccel[1]]);
    }
    else{        
        p.setAcceleration([pAccel[0]-.025,pAccel[1]]);
    }
    if(p.mParallaxDir === 0){
        pGO.setSizeDelta(1.0005);
        p.setAcceleration([p.getAcceleration()[0],pAccel[1]-0.01]);
        pGO.getXform().setZPos(5);
    }
    if(p.mParrallaxDir === 2){
        pGO.setSizeDelta(.999);
        p.setAcceleration([p.getAcceleration()[0],pAccel[1]+.01]);
        pGO.getXform().setZPos(1);
    }
    if (pPos[0] > 100){
        pPos[0] = 0;
    }
    if (pPos[0] < 0){
        pPos[0] = 100;
    }    
    pGO.getXform().incRotationByDegree(p.mRotationVal*.05);
};
