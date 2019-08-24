"use strict";  

function SFXDemo() {
    this.kUIButton = "assets/ui/button.png";
    this.kTargetTexture = "assets/smoke/target.png";
    this.mCamera = null;
    this.LevelSelect = null;
    this.mAllObjs = null;
    this.mPlatforms = null;
    this.mCurrentObj = 0;
    this.mTiny1 = null;
    this.mTiny2 = null;
    this.mTiny3 = null;    
    this.mAllParticles = null;
    this.mXParticles = null;
    this.mXSubParticles = null;
    this.mTarget = null;
    this.backButton = null;
    this.MainMenuButton = null;
    this.mDrawRigidShape = true;
    this.flip = true;
}
engine.core.inheritPrototype(SFXDemo, Scene);


SFXDemo.prototype.loadScene = function () {
    engine.Textures.loadTexture(this.kUIButton);
    engine.Textures.loadTexture(this.kTargetTexture);
    engine.Textures.loadTexture("assets/particlesystem/shock2.png");
    engine.Textures.loadTexture("assets/particlesystem/shock.png");
    engine.Textures.loadTexture("assets/particlesystem/particle.png");
    engine.Textures.loadTexture("assets/particlesystem/bubble.png");
    engine.Textures.loadTexture("assets/particlesystem/sparkle.png");
    document.getElementById("subemitter").style.display="block";
};

SFXDemo.prototype.unloadScene = function () {
    engine.Textures.unloadTexture(this.kUIButton);
    engine.Textures.unloadTexture(this.kTargetTexture);
    document.getElementById("subemitter").style.display="none";
    if(this.LevelSelect==="Back")
        engine.core.startScene(new ParticleLevel());
    else if(this.LevelSelect==="Main")
        engine.core.startScene(new MyGame());
};

SFXDemo.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), 
        100,                     
        [0, 0, 800, 600]         
    );
    this.mCamera.setBackgroundColor([0, 0, 0, 1]);
    engine.defaultResources.setGlobalAmbientIntensity(3);
    this.mFirstObject = 0;
    this.mCurrentObj = this.mFirstObject;
    this.mAllParticles = new GameObjectSet();
    let SEP = new SubEmitterParams("assets/particlesystem/particle.png", "assets/particlesystem/shock2.png", 95,1,0,-5,15,50,275,0,55,0,.1,0,[1,1,1,1], [1,0,1,1], [1,0,0,1], [1,0,1,1], true, 45, 1.05);
    this.mTiny1=new SubEmitter(SEP);
    this.mAllParticles.addToSet(this.mTiny1);
    SEP = new SubEmitterParams("assets/particlesystem/particle.png", "assets/particlesystem/sparkle.png", 5,1,0,-10,15,-40,275,0,55,0,.1,0,[1,1,1,1], [1,0,1,1], [1,0,0,1], [1,0,1,1], false, 30, 1.1);
    this.mTiny2=new SubEmitter(SEP);
    this.mAllParticles.addToSet(this.mTiny2);
    SEP = new SubEmitterParams("assets/particlesystem/bubble.png", "assets/particlesystem/shock.png", 50,1,10,4,50,0,20,0,40,0,1,0,[1,1,1,1], [1,.8,0,1], [1,0,0,0], [1,.8,0,1], false, 6, 1.125);
    // console.log(SEP);
    this.mTiny3=new SubEmitter(SEP);
    this.mAllParticles.addToSet(this.mTiny3);    
    this.mXParticles = new ParticleGameObjectSet();
    this.mXSubParticles = new ParticleGameObjectSet();
    this.mTarget = new GameObject(new SpriteRenderable(this.kTargetTexture));
    this.mTarget.getXform().setSize(3,3);
    
    this.mAllObjs = new GameObjectSet();
    this.mAllObjs.addToSet(this.mTarget);
    
    this.backButton = new UIButton(this.backSelect,this,[80,580],[160,40],"Go Back",4);
    this.MainMenuButton = new UIButton(this.mainSelect,this,[700,580],[200,40],"Main Menu",4);
};

SFXDemo.prototype.draw = function () {
    engine.graphics.clear([0, 0, 0, 1.0]); 

    this.mCamera.setupViewProjection();
    
    this.mCollisionInfos = []; 
    
    this.mTarget.draw(this.mCamera);
    this.mAllParticles.draw(this.mCamera);
    this.mXParticles.draw(this.mCamera);
    this.mXSubParticles.draw(this.mCamera);
    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
};

SFXDemo.prototype.update = function () {    
    engine.ParticleSystem.update(this.mAllParticles);    
    engine.ParticleSystem.update(this.mXParticles);
    engine.ParticleSystem.update(this.mXSubParticles);
    
    if (this.mCamera.isMouseInViewport()) {
        
    }
    if (engine.keyboard.wasPressed("ArrowLeft")) {
        this.mCurrentObj -= 1;
        if (this.mCurrentObj < this.mFirstObject)
            this.mCurrentObj = this.mAllParticles.size() - 1;
    }            
    if (engine.keyboard.wasPressed("ArrowRight")) {
        this.mCurrentObj += 1;
        if (this.mCurrentObj >= this.mAllParticles.size())
            this.mCurrentObj = this.mFirstObject;
    }

    let obj = this.mAllParticles.getObjectAt(this.mCurrentObj);
    
    if (engine.keyboard.wasPressed("Q")) {
        obj.incWidth(1);
    }
    if (engine.keyboard.wasPressed("W")) {
        obj.incWidth(-1);
    }
    if (engine.keyboard.wasPressed("A")) {
        obj.incyAcceleration(1);
    }
    if (engine.keyboard.wasPressed("S")) {
        obj.incyAcceleration(-1);
    }
    if (engine.keyboard.wasPressed("Z")) {
        obj.incLife(1);
    }
    if (engine.keyboard.wasPressed("X")) {
        obj.incLife(-1);
    }
    if (engine.keyboard.wasPressed("E")) {
        obj.incxVelocity(1);
    }
    if (engine.keyboard.wasPressed("R")) {
        obj.incxVelocity(-1);
    }
    if (engine.keyboard.wasPressed("D")) {
        obj.incyVelocity(1);
    }
    if (engine.keyboard.wasPressed("F")) {
        obj.incyVelocity(-1);
    }
    if (engine.keyboard.wasPressed("C")) {
        obj.incFlicker(1);
    }
    if (engine.keyboard.wasPressed("V")) {
        obj.incFlicker(-1);
    }
    if (engine.keyboard.wasPressed("T")) {
        obj.incIntensity(1);
    }
    if (engine.keyboard.wasPressed("Y")) {
        obj.incIntensity(-1);
    }
    if (engine.keyboard.wasPressed("G")) {
        obj.incxAcceleration(1);
    }
    if (engine.keyboard.wasPressed("H")) {
        obj.incxAcceleration(-1);
    }
    if (engine.keyboard.wasPressed("B")) {
        obj.incParticleSize(1);
    }
    if (engine.keyboard.wasPressed("N")) {
        obj.incParticleSize(-1);
    }
    if (engine.keyboard.wasPressed("U")) {
        obj.incyOffset(1);
    }
    if (engine.keyboard.wasPressed("I")) {
        obj.incyOffset(-1);
    }
    if (engine.keyboard.wasPressed("J")) {
        obj.setPhysInherit();
    }
    if (engine.keyboard.wasPressed("O")) {
        obj.setSubParticleLife(1);
    }
    if (engine.keyboard.wasPressed("P")) {
        obj.setSubParticleLife(-1);
    }
    if (engine.keyboard.wasPressed("K")) {
        obj.setSubParticleSizeDelta(.01);
    }
    if (engine.keyboard.wasPressed("L")) {
        obj.setSubParticleSizeDelta(-.01);
    }
    if (engine.keyboard.isPressed("M")){
        if (engine.keyboard.isPressed("Q")) {
            obj.incWidth(1);
        }
        if (engine.keyboard.isPressed("W")) {
            obj.incWidth(-1);
        }
        if (engine.keyboard.isPressed("A")) {
            obj.incyAcceleration(1);
        }
        if (engine.keyboard.isPressed("S")) {
            obj.incyAcceleration(-1);
        }
        if (engine.keyboard.isPressed("Z")) {
            obj.incLife(1);
        }
        if (engine.keyboard.isPressed("X")) {
            obj.incLife(-1);
        }
        if (engine.keyboard.isPressed("E")) {
            obj.incxVelocity(1);
        }
        if (engine.keyboard.isPressed("R")) {
            obj.incxVelocity(-1);
        }
        if (engine.keyboard.isPressed("D")) {
            obj.incyVelocity(1);
        }
        if (engine.keyboard.isPressed("F")) {
            obj.incyVelocity(-1);
        }
        if (engine.keyboard.isPressed("C")) {
            obj.incFlicker(1);
        }
        if (engine.keyboard.isPressed("V")) {
            obj.incFlicker(-1);
        }
        if (engine.keyboard.isPressed("T")) {
            obj.incIntensity(1);
        }
        if (engine.keyboard.isPressed("Y")) {
            obj.incIntensity(-1);
        }
        if (engine.keyboard.isPressed("G")) {
            obj.incxAcceleration(1);
        }
        if (engine.keyboard.isPressed("H")) {
            obj.incxAcceleration(-1);
        }
        if (engine.keyboard.isPressed("B")) {
            obj.incParticleSize(1);
        }
        if (engine.keyboard.isPressed("N")) {
            obj.incParticleSize(-1);
        }
        if (engine.keyboard.isPressed("U")) {
            obj.incyOffset(1);
        }
        if (engine.keyboard.isPressed("I")) {
            obj.incyOffset(-1);
        }
        if (engine.keyboard.isPressed("J")) {
        obj.setPhysInherit();
        }
        if (engine.keyboard.isPressed("O")) {
            obj.setSubParticleLife(1);
        }
        if (engine.keyboard.isPressed("P")) {
            obj.setSubParticleLife(-1);
        }
        if (engine.keyboard.isPressed("K")) {
            obj.setSubParticleSizeDelta(.01);
        }
        if (engine.keyboard.isPressed("L")) {
            obj.setSubParticleSizeDelta(-.01);
        }
    }
    
    if (engine.mouse.isPressed(0)){
    if (this.mCamera.isMouseInViewport()) {
        if(this.flip){
            this.createXParticle(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
        }
        this.flip = !this.flip;
    }}
    
    let p = obj.getPos();
    p[1] += 5;
    this.mTarget.getXform().setPosition(p[0], p[1]);
    this.updateValue(obj);
    this.MainMenuButton.update();
    this.backButton.update();    
    this.driftParticles();
    this.handleSubEmissions();
};

SFXDemo.prototype.createXParticle = function(atX, atY){
    let v2t = new vec2.fromValues(atX-50,atY-40);
    let life = 450;
    let p = new ParticleGameObject(this.kTargetTexture, 50,40, life);        
    p.getXform().setSize(0.5, 0.5);    
    p.getRenderable().setColor([0, 0, 1, 1]);
    p.setFinalColor([0, 1, 0, 1]);
    
    let scaledVec = new vec2.create;
    vec2.scale(scaledVec,v2t,2);
    p.getParticle().setVelocity(scaledVec);
    p.getParticle().setAcceleration(scaledVec);    
    p.setSizeDelta(1.001);    
    this.mXParticles.addToSet(p);
    let p2 = new ParticleGameObject(this.kTargetTexture, 50,40, life);
    p2.getXform().setSize(0.5, 0.5);    
    p2.getRenderable().setColor([0, 0, 1, 1]);
    p2.setFinalColor([0, 1, 0, 1]);
    
    let negVec = new vec2.create;
    vec2.negate(negVec,scaledVec);
    p2.getParticle().setVelocity(negVec);
    p2.getParticle().setAcceleration(negVec);    
    p2.setSizeDelta(1.001);
    this.mXParticles.addToSet(p2);
    
    p = new ParticleGameObject("assets/particlesystem/shock2.png", 50,40, 10);        
    p.getXform().setSize(2.5, 2.5);    
    p.getRenderable().setColor([1, 1, 1, 1]);
    p.setFinalColor([0, 0, 0, 1]);
    
    p.getParticle().setVelocity([0,0]);
    p.getParticle().setAcceleration([0,0]);    
    p.setSizeDelta(1.001);
    this.mXParticles.addToSet(p);
};


SFXDemo.prototype.driftParticles = function(){    
    let pSet = this.mTiny3.getSet().mSet;
    let setLength = pSet.length;    
    for (let i = 0; i < setLength; i++){
        let pGO = pSet[i];
        let p = pGO.getParticle();
        let pPos = p.getPosition();
        let pOPos = p.getOriginalPosition();
        let pAccel = p.getAcceleration();
        let dist = Math.abs(pPos[0] - pOPos[0]);    
        if(dist % (Math.floor(Math.random()*5)) < 0.1){
            let test = Math.floor(Math.random()*2);
            if(test)
                p.mDriftDir = !p.mDriftDir;
        }    
        if(p.mDriftDir){
            p.setAcceleration([10,pAccel[1]]);
        }
        else{
            p.setAcceleration([-10,pAccel[1]]);
        }
        if(p.mParallaxDir){
            pGO.setSizeDelta(1.0005);
            pGO.getXform().incYPosBy(-.01);        
        }
        else{
            pGO.setSizeDelta(.999);
            pGO.getXform().incYPosBy(.01);        
        }
    }
};


SFXDemo.prototype.handleSubEmissions = function(){
    let pSet = this.mXParticles.mSet;
    let setLength = pSet.length;
    for (let i = 0; i < setLength; i++){        
        let p;
        if (pSet[i].mCyclesToLive === 1)
            p = pSet[i].getParticle();
            if (p !== undefined){
                this.createSubParticle(p.mPosition[0],p.mPosition[1]);
        }
    }
};

SFXDemo.prototype.createSubParticle = function(atX, atY){    
    let p = new ParticleGameObject("assets/particlesystem/flare.png", atX, atY, 13);
    let rr = Math.random();
    let rg = Math.random();
    let rb = Math.random();    
    p.setFinalColor([rr,rg,rb]);
    
    p.getXform().setSize(1, 1);
    p.setSizeDelta(1.15);    
    this.mXSubParticles.addToSet(p); 
}

SFXDemo.prototype.updateValue = function(obj){
    document.getElementById("SEvalue1").innerHTML = obj.getWidth();
    document.getElementById("SEvalue2").innerHTML = obj.getyAcceleration();
    document.getElementById("SEvalue3").innerHTML = obj.getLife();
    document.getElementById("SEvalue4").innerHTML = obj.getxVelocity();
    document.getElementById("SEvalue5").innerHTML = obj.getyVelocity();
    document.getElementById("SEvalue6").innerHTML = obj.getFlicker();
    document.getElementById("SEvalue7").innerHTML = obj.getIntensity();
    document.getElementById("SEvalue8").innerHTML = obj.getxAcceleration();
    document.getElementById("SEvalue9").innerHTML = obj.getParticleSize();
    document.getElementById("SEvalue10").innerHTML = obj.getyOffset();
    document.getElementById("SEvalue11").innerHTML = obj.getPhysInherit();
    document.getElementById("SEvalue12").innerHTML = obj.getSubParticleLife();
    document.getElementById("SEvalue13").innerHTML = obj.getSubParticleSizeDelta();
};

SFXDemo.prototype.backSelect = function(){
    this.LevelSelect="Back";
    engine.core.loop.stop();
};

SFXDemo.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    engine.core.loop.stop();
};
