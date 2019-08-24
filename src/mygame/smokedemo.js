"use strict";  

function SmokeDemo() {
    this.kPlatformTexture = "assets/smoke/platform.png";
    this.kTargetTexture = "assets/smoke/target.png";
    this.kTeacup = "assets/smoke/teapot.png";
    this.kBush = "assets/smoke/bush.png";
    this.kForest = "assets/smoke/forest.png";
    this.kUIButton = "assets/ui/button.png";
    
    this.mCamera = null;

    
    this.LevelSelect = null;

    this.mPlatforms = null;
    this.mAllSmoke = null;
    
    this.mCurrentObj = 0;
    this.mTarget = null;
    this.fire = null;
    this.mBush = null;
    this.mTeacup = null;
    this.mForest = null;
    this.backButton = null;
    this.MainMenuButton = null;
}
engine.core.inheritPrototype(SmokeDemo, Scene);


SmokeDemo.prototype.loadScene = function () {
    engine.Textures.loadTexture(this.kPlatformTexture);
    engine.Textures.loadTexture(this.kTargetTexture);
    engine.Textures.loadTexture(this.kTeacup);
    engine.Textures.loadTexture(this.kBush);
    engine.Textures.loadTexture(this.kForest);
    engine.Textures.loadTexture(this.kUIButton);
    document.getElementById("smoke").style.display="block";
};

SmokeDemo.prototype.unloadScene = function () {
    engine.Textures.unloadTexture(this.kPlatformTexture);
    engine.Textures.unloadTexture(this.kTargetTexture);
    engine.Textures.unloadTexture(this.kTeacup);
    engine.Textures.unloadTexture(this.kBush);
    engine.Textures.unloadTexture(this.kForest);
    engine.Textures.unloadTexture(this.kUIButton);
    document.getElementById("smoke").style.display="none";
    if(this.LevelSelect==="Back")
        engine.core.startScene(new ParticleLevel());
    else if(this.LevelSelect==="Main")
        engine.core.startScene(new MyGame());
};

SmokeDemo.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), 
        100,                     
        [0, 0, 800, 600]         
    );
    this.mCamera.setBackgroundColor([0.2, 0.2, 0.2, 1]);
    engine.defaultResources.setGlobalAmbientIntensity(3);
    
    this.mPlatforms = new GameObjectSet();
    this.mAllSmoke = new GameObjectSet();
    
    this.createBounds();
    this.mFirstObject = 0;
    this.mCurrentObj = this.mFirstObject;
    
    let sp = new SmokeParams(75,7,20,2,60,0,5,1,9,0,3.5,7,.1,.2,.1,1,.09);
    let m=new Smoke(sp);
    this.mAllSmoke.addToSet(m);
    
    sp = new SmokeParams(18.5,10,0,10,5,0,5,.9,2,0,1,1,.5,.5,.5,1,0);
    m=new Smoke(sp);
    this.mAllSmoke.addToSet(m);
    
    sp = new SmokeParams(25,60,20,-.5,125,0,0,1,2,0,10,10,.1,.1,.1,1,.05);
    m=new Smoke(sp);
    this.mAllSmoke.addToSet(m);
    
    let r = new TextureRenderable(this.kTargetTexture);
    this.mTarget = new GameObject(r);
    let xf = r.getXform();
    xf.setZPos(2);
    xf.setSize(3, 3);
    this.mBush = new TextureRenderable(this.kBush);
    this.mBush.getXform().setPosition(10,8);
    this.mBush.setColor([0, 0, 0, 0]);  
    this.mBush.getXform().setSize(6,6);
    this.mTeacup = new TextureRenderable(this.kTeacup);
    this.mTeacup.getXform().setPosition(15,9.5);
    this.mTeacup.setColor([0, 0, 0, 0]);  
    this.mTeacup.getXform().setSize(8,8);
    this.mForest = new TextureRenderable(this.kForest);
    this.mForest.getXform().setPosition(75,9);
    this.mForest.setColor([.1, .1, .1, .8]);
    this.mForest.getXform().setSize(48,12);
    this.backButton = new UIButton(this.backSelect,this,[80,580],[160,40],"Go Back",4);
    this.MainMenuButton = new UIButton(this.mainSelect,this,[700,580],[200,40],"Main Menu",4);
};

SmokeDemo.prototype.draw = function () {
    engine.graphics.clear([0.2, 0.2, 0.2, 1.0]); 

    this.mCamera.setupViewProjection();
    
    
    this.mTeacup.draw(this.mCamera);
    this.mForest.draw(this.mCamera);
    this.mTarget.draw(this.mCamera);
    this.mAllSmoke.draw(this.mCamera);
    
    this.mPlatforms.draw(this.mCamera);
    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
};

SmokeDemo.kBoundDelta = 0.1;
SmokeDemo.prototype.update = function () {
    engine.ParticleSystem.update(this.mAllSmoke);    
    if (engine.keyboard.wasPressed("ArrowLeft")) {
        this.mCurrentObj -= 1;
        if (this.mCurrentObj < this.mFirstObject)
            this.mCurrentObj = this.mAllSmoke.size() - 1;
    }            
    if (engine.keyboard.wasPressed("ArrowRight")) {
        this.mCurrentObj += 1;
        if (this.mCurrentObj >= this.mAllSmoke.size())
            this.mCurrentObj = this.mFirstObject;
    }

    let obj = this.mAllSmoke.getObjectAt(this.mCurrentObj);
    
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
    if (engine.keyboard.wasPressed("1")) {
        obj.incRVal(.01);
    }
    if (engine.keyboard.wasPressed("2")) {
        obj.incRVal(-.01);
    }
    if (engine.keyboard.wasPressed("3")) {
        obj.incGVal(.01);
    }
    if (engine.keyboard.wasPressed("4")) {
        obj.incGVal(-.01);
    }
    if (engine.keyboard.wasPressed("5")) {
        obj.incBVal(.01);
    }
    if (engine.keyboard.wasPressed("6")) {
        obj.incBVal(-.01);
    }
    if (engine.keyboard.wasPressed("7")) {
        obj.incAVal(.01);
    }
    if (engine.keyboard.wasPressed("8")) {
        obj.incAVal(-.01);
    }
    if (engine.keyboard.wasPressed("9")) {
        obj.incColorShift(.01);
    }
    if (engine.keyboard.wasPressed("0")) {
        obj.incColorShit(-.01);
    }
    if(engine.keyboard.isPressed("M")){
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
        if (engine.keyboard.isPressed("1")) {
            obj.incRVal(.01);
        }
        if (engine.keyboard.isPressed("2")) {
            obj.incRVal(-.01);
        }
        if (engine.keyboard.isPressed("3")) {
            obj.incGVal(.01);
        }
        if (engine.keyboard.isPressed("4")) {
            obj.incGVal(-.01);
        }
        if (engine.keyboard.isPressed("5")) {
            obj.incBVal(.01);
        }
        if (engine.keyboard.isPressed("6")) {
            obj.incBVal(-.01);
        }
        if (engine.keyboard.isPressed("7")) {
            obj.incAVal(.01);
        }
        if (engine.keyboard.isPressed("8")) {
            obj.incAVal(-.01);
        }
        if (engine.keyboard.isPressed("9")) {
            obj.incColorShift(.01);
        }
        if (engine.keyboard.isPressed("0")) {
            obj.incColorShift(-.01);
        }
    }

    let p = obj.getPos();
    this.mTarget.getXform().setPosition(p[0], p[1]);
    this.updateValue(obj);
    this.MainMenuButton.update();
    this.backButton.update();
};

SmokeDemo.prototype.updateValue = function(obj){
    document.getElementById("svalue1").innerHTML = obj.getWidth();
    document.getElementById("svalue2").innerHTML = obj.getyAcceleration();
    document.getElementById("svalue3").innerHTML = obj.getLife();
    document.getElementById("svalue4").innerHTML = obj.getxVelocity();
    document.getElementById("svalue5").innerHTML = obj.getyVelocity();
    document.getElementById("svalue6").innerHTML = obj.getFlicker();
    document.getElementById("svalue7").innerHTML = obj.getIntensity();
    document.getElementById("svalue8").innerHTML = obj.getxAcceleration();
    document.getElementById("svalue9").innerHTML = obj.getParticleSize();
    document.getElementById("svalue10").innerHTML = obj.getyOffset();
    document.getElementById("svalue11").innerHTML = obj.getRVal();
    document.getElementById("svalue12").innerHTML = obj.getGVal();
    document.getElementById("svalue13").innerHTML = obj.getBVal();
    document.getElementById("svalue14").innerHTML = obj.getAVal();
    document.getElementById("svalue15").innerHTML = obj.getColorShift();
};

SmokeDemo.prototype.createBounds = function() {
    let x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x+=30) 
        this.platformAt(x, y, w, 0);
};

SmokeDemo.prototype.platformAt = function (x, y, w, rot) {
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
    xf.setRotationInDegree(rot);
    this.mPlatforms.addToSet(g);
};

SmokeDemo.prototype.backSelect = function(){
    this.LevelSelect="Back";
    engine.core.loop.stop();
};

SmokeDemo.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    engine.core.loop.stop();
};
