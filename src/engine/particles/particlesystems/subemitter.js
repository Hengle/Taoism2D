function SubEmitter(SubEmitterParams){
    this.MainParticleTexture = SubEmitterParams.MainParticleTexture;
    this.SubParticleTexture = SubEmitterParams.SubParticleTexture;
    this.xPos=SubEmitterParams.xPos;
    this.yPos=SubEmitterParams.yPos;
    this.width=SubEmitterParams.width;
    this.yAcceleration=SubEmitterParams.yAcceleration;
    this.life=SubEmitterParams.life;
    this.xVelocity=SubEmitterParams.xVelocity;
    this.yVelocity=SubEmitterParams.yVelocity;
    this.flicker=SubEmitterParams.flicker;
    this.intensity=SubEmitterParams.intensity;
    this.xAcceleration=SubEmitterParams.xAcceleration;
    this.size=SubEmitterParams.size;
    this.yOffset=SubEmitterParams.yOffset;
    this.startColor=SubEmitterParams.startColor;
    this.finalColor=SubEmitterParams.finalColor;
    this.subStartColor=SubEmitterParams.subStartColor;
    this.subFinalColor=SubEmitterParams.subFinalColor;
    this.physInherit=SubEmitterParams.physInherit;
    this.subParticleLife=SubEmitterParams.subParticleLife;
    this.subParticleSizeDelta=SubEmitterParams.subParticleSizeDelta;
    ParticleSystem.call(this, this.MainParticleTexture, this.xPos, this.yPos, this.width, this.yAcceleration, this.life, this.xVelocity, this.yVelocity, this.flicker, this.intensity, this.xAcceleration, this.size, this.yOffset, this.startColor, this.finalColor, 1);
    this.mSubParticles = new ParticleGameObjectSet();    
    this.mTimer = 60;
    
};
engine.core.inheritPrototype(SubEmitter,ParticleSystem);

SubEmitterParams = function(MainParticleTexture, SubParticleTexture, xPos, yPos, width, yAcceleration, life, xVelocity, yVelocity, flicker, intensity, xAcceleration, size, yOffset, startColor, finalColor, subStartColor, subFinalColor, physInherit, subParticleLife, subParticleSizeDelta){
    this.MainParticleTexture = MainParticleTexture||"assets/smoke/target.png";
    this.SubParticleTexture = SubParticleTexture||"assets/particlesystem/shock2.png";
    this.xPos=xPos||50;
    this.yPos=yPos||5;
    this.width=width||0;
    this.yAcceleration=yAcceleration||1;
    this.life=life||100;
    this.xVelocity=xVelocity||0;
    this.yVelocity=yVelocity||0;
    this.flicker=flicker||0;
    this.intensity=intensity||60;
    this.xAcceleration=xAcceleration||0;
    this.size=size||1;
    this.yOffset=yOffset||0;
    this.startColor=startColor||[1,1,1,1];
    this.finalColor=finalColor||[1,1,1,1];
    this.subStartColor=subStartColor||[1,1,1,1];
    this.subFinalColor=subFinalColor||[1,1,1,1];
    this.physInherit=physInherit||false;
    this.subParticleLife=subParticleLife||100;
    this.subParticleSizeDelta=subParticleSizeDelta||1.01;
};

SubEmitter.prototype.update = function(){
    this.mTimer--;
    if(this.mTimer < this.intensity ){
    let p = this.createParticle(this.xPos, this.yPos);
    this.mAllParticles.addToSet(p);
    this.mTimer = 60;
    }
    engine.ParticleSystem.update(this.mAllParticles);
    engine.ParticleSystem.update(this.mSubParticles);
    this.handleSubEmissions();
};

SubEmitter.prototype.draw = function(aCamera){
    this.mAllParticles.draw(aCamera);
    this.mSubParticles.draw(aCamera);
};

SubEmitter.prototype.handleSubEmissions = function(){
    let pSet = this.getSet().mSet;
    let setLength = pSet.length;
    for (let i = 0; i < setLength; i++){        
        let p;
        if (pSet[i].mCyclesToLive < 1)
            p = pSet[i].getParticle();
            if (p !== undefined){
                this.createSubParticle(p.mPosition[0],p.mPosition[1],p);
        }
    }
};

SubEmitter.prototype.createSubParticle = function(atX, atY, mP){
    let p = new ParticleGameObject(this.SubParticleTexture, atX, atY, this.subParticleLife);
    p.mDeltaColor = this.subStartColor;
    p.setFinalColor(this.subFinalColor);
    
    let r = 1;
    p.getXform().setSize(r, r);
    p.getXform().incRotationByDegree(Math.random()*360);        
    p.getParticle().setVelocity([0, 0]);
    p.getParticle().setAcceleration([0,0]);
    if(this.physInherit){
        let inheritedVel = mP.getVelocity();
        let inheritedAcc = mP.getAcceleration();
        p.getParticle().setVelocity(inheritedVel);
        p.getParticle().setAcceleration(inheritedAcc);
    }
    p.setSizeDelta(this.subParticleSizeDelta);    
    this.mSubParticles.addToSet(p);        
};

SubEmitter.prototype.setPhysInherit = function(){
    this.physInherit = !this.physInherit;
};

SubEmitter.prototype.setSubParticleLife = function(val){
    this.subParticleLife += val;
};

SubEmitter.prototype.setSubParticleSizeDelta = function(val){
    this.subParticleSizeDelta += val;
};

SubEmitter.prototype.getPhysInherit = function(){
    return this.physInherit;
};

SubEmitter.prototype.getSubParticleLife = function(){
    return this.subParticleLife;
};

SubEmitter.prototype.getSubParticleSizeDelta = function(){
    return this.subParticleSizeDelta.toFixed(2);
};
