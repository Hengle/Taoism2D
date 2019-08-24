"use strict";  

function DustDemo() {
    this.kUIButton = "assets/ui/button.png";
    this.kTargetTexture = "assets/smoke/target.png";
    this.mCamera = null;
    this.LevelSelect = null;
    
    this.mAllObjs = null;
    this.mPlatforms = null;
    this.mCurrentObj = 0;
    
    this.mAllDust = null;    
    this.mDust1 = null;
    this.mDust2 = null;
    this.mDust3 = null;
    
    this.mXParticles = null;
    
    this.mTarget = null;
    this.backButton = null;
    this.MainMenuButton = null;
    
    this.mHolder = [25,25];
    this.mAngle = 0;
    this.mTimer = 90;
    this.mDrawRigidShape = true;
    this.r = null;
    
}
engine.core.inheritPrototype(DustDemo, Scene);

DustDemo.prototype.loadScene = function () {
    engine.Textures.loadTexture(this.kUIButton);
    engine.Textures.loadTexture(this.kTargetTexture);
    document.getElementById("dust").style.display="block";
};

DustDemo.prototype.unloadScene = function () {
    engine.Textures.unloadTexture(this.kUIButton);
    engine.Textures.unloadTexture(this.kTargetTexture);
    document.getElementById("dust").style.display="none";
    if(this.LevelSelect==="Back")
        engine.core.startScene(new ParticleLevel());
    else if(this.LevelSelect==="Main")
        engine.core.startScene(new MyGame());
};

DustDemo.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), 
        100,                     
        [0, 0, 800, 600]         
    );
    this.mCamera.setBackgroundColor([0, 0, 0, 1]);
    engine.defaultResources.setGlobalAmbientIntensity(3);
    this.mFirstObject = 0;
    this.mCurrentObj = this.mFirstObject;
    
    this.mAllDust = new GameObjectSet();
    
    let dustParams = new DustParams(50,40,50,-.5,300,0,0,1,1,0,1,40);
    this.mDust1 = new Dust(dustParams);
    this.mAllDust.addToSet(this.mDust1);
    
    dustParams = new DustParams(1,1,50,5,150,0,0,1,4,5,1,10);
    this.mDust2 = new Dust(dustParams);
    this.mAllDust.addToSet(this.mDust2);
    
    this.mXParticles = new ParticleGameObjectSet();  
    
    let r = new TextureRenderable(this.kTargetTexture);
    this.mTarget = new GameObject(r);
    let xf = r.getXform();
    xf.setZPos(2);
    xf.setSize(3, 3);
    this.backButton = new UIButton(this.backSelect,this,[80,580],[160,40],"Go Back",4);
    this.MainMenuButton = new UIButton(this.mainSelect,this,[700,580],[200,40],"Main Menu",4);
};

DustDemo.prototype.draw = function () {
    engine.graphics.clear([0, 0, 0, 1.0]); 
    this.mCamera.setupViewProjection();
       
    this.mAllDust.draw(this.mCamera);
    this.mXParticles.draw(this.mCamera);
    this.mTarget.draw(this.mCamera);
    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
};

DustDemo.prototype.update = function () {
    engine.ParticleSystem.update(this.mAllDust);
    engine.ParticleSystem.update(this.mXParticles);
    
    if (engine.keyboard.wasPressed("ArrowLeft")) {
        this.mCurrentObj -= 1;
        if (this.mCurrentObj < this.mFirstObject)
            this.mCurrentObj = this.mAllDust.size() - 1;
    }            
    if (engine.keyboard.wasPressed("ArrowRight")) {
        this.mCurrentObj += 1;
        if (this.mCurrentObj >= this.mAllDust.size())
            this.mCurrentObj = this.mFirstObject;
    }

    let obj = this.mAllDust.getObjectAt(this.mCurrentObj);
    
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
    }
    let p = obj.getPos();
    p[0] += 25;
    p[1] += 20;
    this.mTarget.getXform().setPosition(p[0], p[1]);
    this.updateValue(obj);
    this.MainMenuButton.update();
    this.backButton.update();
    this.updateHolder();
    this.updateClickEffect();
    this.killDust();
};


DustDemo.prototype.killDust = function(){
    let pSet = this.mDust1.getSet().mSet;
    let setLength = pSet.length;    
    for (let i = 0; i < setLength; i++){
        let pPos = pSet[i].getParticle().getPosition();
        if(pPos[0] > 100 || pPos[0] < 50){
            pSet[i].mCyclesToLive = 0;
        }
        if(pPos[1] > 80 || pPos[1] < 41){
            pSet[i].mCyclesToLive = 0;
        }
    }
    pSet = this.mDust2.getSet().mSet;
    setLength = pSet.length;    
    for (let i = 0; i < setLength; i++){
        let pPos = pSet[i].getParticle().getPosition();
        if(pPos[0] > 50 || pPos[0] < 0){
            pSet[i].mCyclesToLive = 0;
        }
        if(pPos[1] > 39 || pPos[1] < 0){
            pSet[i].mCyclesToLive = 0;
        }
    }
};

DustDemo.prototype.updateHolder = function(){
    this.mHolder[0] = 25 + 10*Math.cos(this.mAngle);
    this.mHolder[1] = 60 + 10*Math.sin(this.mAngle);
    this.mAngle += .05;
    if(this.mAngle > 360){
        this.mAngle = 0;
    }
    this.createDParticle(this.mHolder[0],this.mHolder[1]);
};

DustDemo.prototype.updateClickEffect = function(){
    if(this.mTimer === 0){
        this.createXParticle(75,20);
        this.createDParticle(75,20);
        this.mTimer = 90;
    }else{
        this.mTimer--;
    }
};

DustDemo.prototype.createDParticle = function(atX, atY){
    let pTexture;
    if(Math.floor(Math.random()*2)){
        pTexture = "assets/particlesystem/dust.png";
    }else{
        pTexture = "assets/particlesystem/dust2.png";
    }      
    let p = new ParticleGameObject(pTexture,atX,atY,90);
    p.getRenderable().setColor([1,1,1,1]);
    p.setFinalColor([0, 0, 0, 1]);
    let r = 10 + Math.random() * 2.5;
    p.getXform().setSize(r, r);    
    p.getXform().incRotationByDegree(Math.random()*360);

    p.getParticle().setVelocity([1, 1]);
    p.getParticle().setAcceleration([0,0]);
    
    p.setSizeDelta(1.0+Math.random()*0.01);
    this.mXParticles.addToSet(p);
            
};

DustDemo.prototype.createXParticle = function(atX, atY){
    let p = new ParticleGameObject("assets/particlesystem/shock.png", atX, atY, 12);
    p.getRenderable().setColor([1, 1, 1, .1]);
    
    let r = 5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);
    p.getXform().incRotationByDegree(Math.random()*360);        
    p.getParticle().setVelocity([0, 0]);
    p.getParticle().setAcceleration([0,0]);
    p.setSizeDelta(1.1);    
    this.mXParticles.addToSet(p);
        
    p = new ParticleGameObject("assets/particlesystem/shock2.png", atX, atY, 10);
    p.getRenderable().setColor([1, 1, 1, 1]);    
    r = 9 + Math.random() * 2.5;
    p.getXform().setSize(r, r);    
    p.getParticle().setVelocity([0, 0]);
    p.getParticle().setAcceleration([0,0]);
    p.setSizeDelta(.99);
    this.mXParticles.addToSet(p);
};

DustDemo.prototype.updateValue = function(obj){
    document.getElementById("dvalue1").innerHTML = obj.getWidth();
    document.getElementById("dvalue2").innerHTML = obj.getyAcceleration();
    document.getElementById("dvalue3").innerHTML = obj.getLife();
    document.getElementById("dvalue4").innerHTML = obj.getxVelocity();
    document.getElementById("dvalue5").innerHTML = obj.getyVelocity();
    document.getElementById("dvalue6").innerHTML = obj.getFlicker();
    document.getElementById("dvalue7").innerHTML = obj.getIntensity();
    document.getElementById("dvalue8").innerHTML = obj.getxAcceleration();
    document.getElementById("dvalue9").innerHTML = obj.getParticleSize();
    document.getElementById("dvalue10").innerHTML = obj.getyOffset();
};

DustDemo.prototype.backSelect = function(){
    this.LevelSelect="Back";
    engine.core.loop.stop();
};

DustDemo.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    engine.core.loop.stop();
};
