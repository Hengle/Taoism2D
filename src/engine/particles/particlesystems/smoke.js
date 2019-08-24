function Smoke(SmokeParams){
    this.xPos=SmokeParams.xPos;
    this.yPos=SmokeParams.yPos;
    this.width=SmokeParams.width;
    this.yAcceleration=SmokeParams.yAcceleration;
    this.life=SmokeParams.life;
    this.xVelocity=SmokeParams.xVelocity;
    this.yVelocity=SmokeParams.yVelocity;
    this.flicker=SmokeParams.flicker;
    this.intensity=SmokeParams.intensity;
    this.xAcceleration=SmokeParams.xAcceleration;
    this.size=SmokeParams.size;
    this.yOffset=SmokeParams.yOffset;
    this.rVal=SmokeParams.rVal;
    this.gVal=SmokeParams.gVal;
    this.bVal=SmokeParams.bVal;
    this.aVal=SmokeParams.aVal;
    this.colorShift=SmokeParams.colorShift;
    ParticleSystem.call(this, "assets/particlesystem/smokeparticle.png", this.xPos, this.yPos, this.width, this.yAcceleration, this.life, this.xVelocity, this.yVelocity, this.flicker, this.intensity, this.xAcceleration, this.size, this.yOffset, [0,0,0,1], [1,1,1,1], 1);    
};
engine.core.inheritPrototype(Smoke,ParticleSystem);


SmokeParams = function(xPos, yPos, width, yAcceleration, life, xVelocity, yVelocity, flicker, intensity, xAcceleration, size, yOffset, rVal, gVal, bVal, aVal, colorShift){
    this.xPos=xPos||50;
    this.yPos=yPos||50;
    this.width=width||0;
    this.yAcceleration=yAcceleration||1;
    this.life=life||140;
    this.xVelocity=xVelocity||0;
    this.yVelocity=yVelocity||0;
    this.flicker=flicker||0;
    this.intensity=intensity||1;
    this.xAcceleration=xAcceleration||0;
    this.size=size||1;
    this.yOffset=yOffset||0;
    this.rVal=rVal||.1;
    this.gVal=gVal||.1;
    this.bVal=bVal||.1;
    this.aVal=aVal||1;
    this.colorShift=colorShift||0;
};

Smoke.prototype.update = function(){
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
        this.applyColor(pSet[i]);
    }
};

Smoke.prototype.applyDrift = function(pGO){
    let p = pGO.getParticle();
    let pAccel = p.getAcceleration();
    if(Math.floor(Math.random()*2) === 0){
        p.setAcceleration([pAccel[0]+.1,pAccel[1]]);
    }
    else{
        p.setAcceleration([pAccel[0]-.1,pAccel[1]]);
    }
};


Smoke.prototype.applySizeDelta = function(pGO){
    let p = pGO.getParticle();
    if(p.mSpin1 || p.mSpin2){
        if(Math.floor(Math.random()*2) === 0){
            pGO.setSizeDelta(1.0125);
            pGO.getXform().incRotationByDegree(p.mRotationVal*.05);
        }
        else{
            pGO.setSizeDelta(.99);
            pGO.getXform().incRotationByDegree(p.mRotationVal*-.05);
        }    
    }
};

Smoke.prototype.applyColor = function(pGO){
    let p = pGO.getParticle();
    if(p.mSpin1)
        pGO.setFinalColor([this.rVal+this.colorShift,this.gVal+this.colorShift,this.bVal+this.colorShift,this.aVal]);
    if(p.mSpin2)
        pGO.setFinalColor([this.rVal+this.colorShift,this.gVal+this.colorShift,this.bVal-this.colorShift,this.aVal]);
    if(!p.mSpin1)
        pGO.setFinalColor([this.rVal+this.colorShift,this.gVal-this.colorShift,this.bVal-this.colorShift,this.aVal]);
    if(!p.mSpin2)
        pGO.setFinalColor([this.rVal-this.colorShift,this.gVal-this.colorShift,this.bVal-this.colorShift,this.aVal]);
};

Smoke.prototype.incRVal = function(val){
    this.rVal += (val);    
    if(this.rVal < 0){
        this.rVal = 0;
    }
    if(this.rVal > 1){
        this.rVal = 1;
    }
};

Smoke.prototype.incGVal = function(val){
    this.gVal += (val);    
    if(this.gVal < 0){
        this.gVal = 0;
    }
    if(this.gVal > 1){
        this.gVal = 1;
    }
};

Smoke.prototype.incBVal = function(val){
    this.bVal += (val);    
    if(this.bVal < 0){
        this.bVal = 0;
    }
    if(this.bVal > 1){
        this.bVal = 1;
    }
};

Smoke.prototype.incAVal = function(val){
    this.aVal += (val);    
    if(this.aVal < 0){
        this.aVal = 0;
    }
    if(this.aVal > 1){
        this.aVal = 1;
    }
};

Smoke.prototype.incColorShift = function(val){
    this.colorShift += (val);    
    if(this.colorShift < 0){
        this.colorShift = 0;
    }
    if(this.colorShift > 1){
        this.colorShift = 1;
    }
};

Smoke.prototype.getRVal = function(){
  return this.rVal.toFixed(2);  
};
Smoke.prototype.getGVal = function(){
  return this.gVal.toFixed(2);  
};
Smoke.prototype.getBVal = function(){
  return this.bVal.toFixed(2);  
};
Smoke.prototype.getAVal = function(){
  return this.aVal.toFixed(2);  
};
Smoke.prototype.getColorShift = function(){
  return this.colorShift.toFixed(2);  
};
