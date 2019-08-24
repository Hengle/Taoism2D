function Fire(FireParams){    
    this.xPos=FireParams.xPos;
    this.yPos=FireParams.yPos;
    this.width=FireParams.width;
    this.yAcceleration=FireParams.yAcceleration;
    this.life=FireParams.life;
    this.xVelocity=FireParams.xVelocity;
    this.yVelocity=FireParams.yVelocity;
    this.flicker=FireParams.flicker;
    this.intensity=FireParams.intensity;
    this.xAcceleration=FireParams.xAcceleration;
    this.size=FireParams.size;
    this.yOffset=FireParams.yOffset;   
    this.emberSelection = FireParams.emberSelection;
    this.taperSelection = FireParams.taperSelection;
    ParticleSystem.call(this, "assets/particlesystem/flameparticle.png", this.xPos, this.yPos, this.width, this.yAcceleration, this.life, this.xVelocity, this.yVelocity, this.flicker, this.intensity, this.xAcceleration, this.size, this.yOffset, [1,0,0,1], [3.5,.4,.3,.6], 1);
}
engine.core.inheritPrototype(Fire,ParticleSystem);

FireParams = function(xPos, yPos, width, yAcceleration, life, xVelocity, yVelocity, flicker, intensity, xAcceleration, size, yOffset, emberSelection, taperSelection){
    this.xPos=xPos || 50;
    this.yPos=yPos || 10;
    this.width=width || 3;
    this.yAcceleration=yAcceleration || 2;
    this.life=life || 20;
    this.xVelocity=xVelocity || 0;
    this.yVelocity=yVelocity || 20;
    this.flicker=flicker || 3;
    this.intensity=intensity || 6;
    this.xAcceleration= xAcceleration || 0;
    this.size=size || 3.5;
    this.yOffset=yOffset || 0;
    this.emberSelection = emberSelection || 10;
    this.taperSelection = taperSelection || 0;
};

Fire.prototype.update = function(){
    for(let i=0; i<this.intensity; i++){
    let p = this.createParticle(this.xPos, this.yPos);
    this.mAllParticles.addToSet(p);
    }
    engine.ParticleSystem.update(this.mAllParticles);
    this.applyEmbers();
    this.applyTaper();
};

Fire.prototype.applyEmbers = function(){
    let pSet = this.getSet().mSet;
    let setLength = pSet.length;    
    for (let i = 0; i < setLength; i++){
        let p = pSet[i].getParticle();
        if(p.mRotationVal < this.emberSelection){            
            pSet[i].setSizeDelta(.9);
            let pAccel = p.getAcceleration();
            if(Math.floor(Math.random()*2) === 0){
                p.setAcceleration([100,pAccel[1]]);        
            }
            else{        
                p.setAcceleration([-100,pAccel[1]]);
            }
        }
    }
};

Fire.prototype.applyTaper = function(){
    let pSet = this.getSet().mSet;
    let setLength = pSet.length;    
    for (let i = 0; i < setLength; i++){
        let p = pSet[i].getParticle();
        if(p.mRotationVal >= (100 - this.taperSelection) && p.mRotationVal >= this.emberSelection){        
            let pAccel = p.getAcceleration();
            if(Math.floor(Math.random()*2) === 0){
                pSet[i].setSizeDelta(1.01);        
                p.setAcceleration([pAccel[0],pAccel[1]*.9]);
            }
            else{
                pSet[i].setSizeDelta(.99);
                let v2c = new vec2.fromValues((this.xPos-p.getXPos())*50,pAccel[1]);        
                p.setAcceleration(v2c);
            }
        }    
    }
};


Fire.prototype.incEmberSelection = function(val){
    this.emberSelection += val;
    if(this.emberSelection < 0){
        this.emberSelection = 0;
    }
    if(this.emberSelection > 100){
        this.emberSelection = 100;
    }
};

Fire.prototype.incTaperSelection = function(val){
    this.taperSelection += val;
    if(this.taperSelection < 0){
        this.taperSelection = 0;
    }
    if(this.taperSelection > 100){
        this.taperSelection = 100;
    }
};

Fire.prototype.getTaperSelection = function(){
    return this.taperSelection;
};
Fire.prototype.getEmberSelection = function(){
    return this.emberSelection;
};
