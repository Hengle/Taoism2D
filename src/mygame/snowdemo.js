"use strict";  

function SnowDemo() {
    this.kPlatformTexture = "assets/snow/platform.png";
    this.kTree1Texture = "assets/snow/tree1.png";
    this.kTree2Texture = "assets/snow/tree2.png";
    this.kTree3Texture = "assets/snow/tree3.png";
    this.kUIButton = "assets/ui/button.png";
    this.mCamera = null;
    this.LevelSelect = null;
    this.mAllObjs = null;
    
    this.mPlatforms = null;
    this.mTrees = null;
    this.mSnow = null;
    this.backButton = null;
    this.MainMenuButton = null;
    this.mDrawRigidShape = true;

}
engine.core.inheritPrototype(SnowDemo, Scene);


SnowDemo.prototype.loadScene = function () {
    engine.Textures.loadTexture(this.kPlatformTexture);
    engine.Textures.loadTexture(this.kTree1Texture);
    engine.Textures.loadTexture(this.kTree2Texture);
    engine.Textures.loadTexture(this.kTree3Texture);
    engine.Textures.loadTexture(this.kUIButton);

    document.getElementById("particle").style.display="block";
};

SnowDemo.prototype.unloadScene = function () {
    engine.Textures.unloadTexture(this.kPlatformTexture);
    engine.Textures.unloadTexture(this.kUIButton);
    engine.Textures.unloadTexture(this.kTree1Texture);
    engine.Textures.unloadTexture(this.kTree2Texture);
    engine.Textures.unloadTexture(this.kTree3Texture);
    document.getElementById("particle").style.display="none";
    if(this.LevelSelect==="Back")
        engine.core.startScene(new ParticleLevel());
    else if(this.LevelSelect==="Main")
        engine.core.startScene(new MyGame());
};

SnowDemo.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), 
        100,                     
        [0, 0, 800, 600]         
    );
    this.mCamera.setBackgroundColor([0.2, 0.2, 0.2, 1]);
    engine.defaultResources.setGlobalAmbientIntensity(3);
    
    this.mPlatforms = new GameObjectSet();
    this.mTrees = new GameObjectSet();
    this.createBounds();
    
    let tree = new TextureRenderable(this.kTree1Texture);
    let xf = tree.getXform(); 
    xf.setSize(20, 20);
    xf.setPosition(20, 15);
    xf.setZPos(0);
    this.mTrees.addToSet(tree);
    
    let tree2 = new TextureRenderable(this.kTree2Texture);
    let xf2 = tree2.getXform(); 
    xf2.setSize(30, 30);
    xf2.setPosition(50, 20);
    xf2.setZPos(2);
    this.mTrees.addToSet(tree2);
    
    let tree3 = new TextureRenderable(this.kTree3Texture);
    let xf3 = tree3.getXform(); 
    xf3.setSize(40, 40);
    xf3.setPosition(85, 25);
    xf3.setZPos(4);
    this.mTrees.addToSet(tree3);
        
    let snowParams = new SnowParams();
    this.mSnow = new Snow(snowParams);
    
    this.mAllObjs = new GameObjectSet();
    this.mAllObjs.addToSet(this.mTarget);
    this.backButton = new UIButton(this.backSelect,this,[80,580],[160,40],"Go Back",4);
    this.MainMenuButton = new UIButton(this.mainSelect,this,[700,580],[200,40],"Main Menu",4);
};

SnowDemo.prototype.draw = function () {
    engine.graphics.clear([0.2, 0.2, 0.2, 1.0]); 

    this.mCamera.setupViewProjection();
    /*for (var i = 0; i<this.mCollisionInfos.length; i++) 
        this.mCollisionInfos[i].draw(this.mCamera); */ 
    this.mCollisionInfos = []; 
    
    this.mSnow.draw(this.mCamera);
    this.mPlatforms.draw(this.mCamera);
    this.mTrees.draw(this.mCamera);
    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
};


SnowDemo.prototype.update = function () {
    engine.ParticleSystem.update(this.mSnow);
    
    if (engine.keyboard.wasPressed("Q")) {
        this.mSnow.incWidth(1);
    }
    if (engine.keyboard.wasPressed("W")) {
        this.mSnow.incWidth(-1);
    }
    if (engine.keyboard.wasPressed("A")) {
        this.mSnow.incyAcceleration(1);
    }
    if (engine.keyboard.wasPressed("S")) {
        this.mSnow.incyAcceleration(-1);
    }
    if (engine.keyboard.wasPressed("Z")) {
        this.mSnow.incLife(1);
    }
    if (engine.keyboard.wasPressed("X")) {
        this.mSnow.incLife(-1);
    }
    if (engine.keyboard.wasPressed("E")) {
        this.mSnow.incxVelocity(1);
    }
    if (engine.keyboard.wasPressed("R")) {
        this.mSnow.incxVelocity(-1);
    }
    if (engine.keyboard.wasPressed("D")) {
        this.mSnow.incyVelocity(1);
    }
    if (engine.keyboard.wasPressed("F")) {
        this.mSnow.incyVelocity(-1);
    }
    if (engine.keyboard.wasPressed("C")) {
        this.mSnow.incFlicker(1);
    }
    if (engine.keyboard.wasPressed("V")) {
        this.mSnow.incFlicker(-1);
    }
    if (engine.keyboard.wasPressed("T")) {
        this.mSnow.incIntensity(1);
    }
    if (engine.keyboard.wasPressed("Y")) {
        this.mSnow.incIntensity(-1);
    }
    if (engine.keyboard.wasPressed("G")) {
        this.mSnow.incxAcceleration(1);
    }
    if (engine.keyboard.wasPressed("H")) {
        this.mSnow.incxAcceleration(-1);
    }
    if (engine.keyboard.wasPressed("B")) {
        this.mSnow.incParticleSize(1);
    }
    if (engine.keyboard.wasPressed("N")) {
        this.mSnow.incParticleSize(-1);
    }
    if (engine.keyboard.wasPressed("U")) {
        this.mSnow.incyOffset(1);
    }
    if (engine.keyboard.wasPressed("I")) {
        this.mSnow.incyOffset(-1);
    }
    this.updateValue();
    this.MainMenuButton.update();
    this.backButton.update();    
};

SnowDemo.prototype.updateValue = function(){
    document.getElementById("pvalue1").innerHTML = this.mSnow.getWidth();
    document.getElementById("pvalue2").innerHTML = this.mSnow.getyAcceleration();
    document.getElementById("pvalue3").innerHTML = this.mSnow.getLife();
    document.getElementById("pvalue4").innerHTML = this.mSnow.getxVelocity();
    document.getElementById("pvalue5").innerHTML = this.mSnow.getyVelocity();
    document.getElementById("pvalue6").innerHTML = this.mSnow.getFlicker();
    document.getElementById("pvalue7").innerHTML = this.mSnow.getIntensity();
    document.getElementById("pvalue8").innerHTML = this.mSnow.getxAcceleration();
    document.getElementById("pvalue9").innerHTML = this.mSnow.getParticleSize();
    document.getElementById("pvalue10").innerHTML = this.mSnow.getyOffset();
};

SnowDemo.prototype.createBounds = function() {
    let x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x+=30) 
        this.platformAt(x, y, w, 0);
};

SnowDemo.prototype.platformAt = function (x, y, w, rot) {
    let h = w / 8;
    let p = new TextureRenderable(this.kPlatformTexture);
    p.setColor([0,0,0,1]);
    let xf = p.getXform();

    let g = new GameObject(p);
    let r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    
    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setZPos(2);
    xf.setRotationInDegree(rot);
    this.mPlatforms.addToSet(g);
};

SnowDemo.prototype.backSelect = function(){
    this.LevelSelect="Back";
    engine.core.loop.stop();
};

SnowDemo.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    engine.core.loop.stop();
};
