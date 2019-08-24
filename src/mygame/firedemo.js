"use strict";  

function FireDemo() {
    this.kPlatformTexture = "assets/fire/platform.png";
    this.kTargetTexture = "assets/smoke/target.png";
    this.kTorch = "assets/fire/torch3.png";
    this.kVolc = "assets/fire/volc.png";
    this.kPillar = "assets/fire/pillar.png";
    this.kForest = "assets/fire/forest.png";
    this.kUIButton = "assets/ui/button.png";
    
    this.mCamera = null;

    this.mPlatforms = null;
    this.mAllFire = null;
    this.mFire1 = null;
    this.mFire2 = null;
    this.mCurrentObj = 0;
    this.mTarget = null;
    this.mTorch = null;
    this.mVolc = null;
    this.mPillar = null;
    this.backButton = null;
    this.MainMenuButton = null;
    this.LevelSelect = null;
}
engine.core.inheritPrototype(FireDemo, Scene);


FireDemo.prototype.loadScene = function () {
    engine.Textures.loadTexture(this.kPlatformTexture);
    engine.Textures.loadTexture(this.kTargetTexture);
    engine.Textures.loadTexture(this.kTorch);
    engine.Textures.loadTexture(this.kVolc);
    engine.Textures.loadTexture(this.kPillar);
    engine.Textures.loadTexture(this.kForest);
    engine.Textures.loadTexture(this.kUIButton);
    document.getElementById("fire").style.display="block";
};

FireDemo.prototype.unloadScene = function () {
    engine.Textures.unloadTexture(this.kPlatformTexture);
    engine.Textures.unloadTexture(this.kTargetTexture);
    engine.Textures.unloadTexture(this.kTorch);
    engine.Textures.unloadTexture(this.kVolc);
    engine.Textures.unloadTexture(this.kPillar);
    engine.Textures.unloadTexture(this.kForest);
    engine.Textures.unloadTexture(this.kUIButton);
    document.getElementById("fire").style.display="none";
    if(this.LevelSelect==="Back")
        engine.core.startScene(new ParticleLevel());
    else if(this.LevelSelect==="Main")
        engine.core.startScene(new MyGame());
};

FireDemo.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), 
        100,                     
        [0, 0, 800, 600]         
    );
    this.mCamera.setBackgroundColor([0.2, 0.2, 0.2, 1]);
    engine.defaultResources.setGlobalAmbientIntensity(3);
    
    this.mPlatforms = new GameObjectSet();
    this.mAllFire = new GameObjectSet();
    
    this.createBounds();
    this.mFirstObject = 0;
    this.mCurrentObj = this.mFirstObject;    
    
    let fParams = new FireParams(20,13,3,40,12,0,20,2,7,0,3.5,5,25,75)
    this.mFire1 = new Fire(fParams);
    this.mAllFire.addToSet(this.mFire1);
    fParams = new FireParams(50,19,1,0,10,0,3,1,1,0,3.5,1,0,100);
    this.mFire2 = new Fire(fParams);
    this.mAllFire.addToSet(this.mFire2);
    
    fParams = new FireParams(80,19,1,-20,13,20,50,1,8,0,3.5,0,100,0);
    this.mFire3 = new Fire(fParams);
    this.mAllFire.addToSet(this.mFire3);    
                
    let r = new TextureRenderable(this.kTargetTexture);
    this.mTarget = new GameObject(r);
    let xf = r.getXform();
    xf.setSize(3, 3);
    
    this.mTorch = new TextureRenderable(this.kTorch);
    this.mTorch.getXform().setPosition(50,13);
    this.mTorch.setColor([0, 0, 0, 1]);  
    this.mTorch.getXform().setSize(8,16);
    
    this.mVolc = new TextureRenderable(this.kVolc);
    this.mVolc.getXform().setPosition(80,12);
    this.mVolc.setColor([0, 0, 0, 1]);  
    this.mVolc.getXform().setSize(60,15);
    
    this.mPillar = new TextureRenderable(this.kPillar);
    this.mPillar.getXform().setPosition(20,8);
    this.mPillar.setColor([0, 0, 0, 1]);  
    this.mPillar.getXform().setSize(7,7);    
    
    this.backButton = new UIButton(this.backSelect,this,[80,580],[160,40],"Go Back",4);
    this.MainMenuButton = new UIButton(this.mainSelect,this,[700,580],[200,40],"Main Menu",4);
};

FireDemo.prototype.draw = function () {
    engine.graphics.clear([0.2, 0.2, 0.2, 1.0]); 

    this.mCamera.setupViewProjection();
    
    this.mTorch.draw(this.mCamera);
    this.mVolc.draw(this.mCamera);
    this.mPillar.draw(this.mCamera);
    this.mTarget.draw(this.mCamera);
    this.mAllFire.draw(this.mCamera);
    this.mPlatforms.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
    this.MainMenuButton.draw(this.mCamera);
};

FireDemo.kBoundDelta = 0.1;
FireDemo.prototype.update = function () {    
    engine.ParticleSystem.update(this.mAllFire);
    
    if (engine.keyboard.wasPressed("ArrowLeft")) {
        this.mCurrentObj -= 1;
        if (this.mCurrentObj < this.mFirstObject)
            this.mCurrentObj = this.mAllFire.size() - 1;
    }            
    if (engine.keyboard.wasPressed("ArrowRight")) {
        this.mCurrentObj += 1;
        if (this.mCurrentObj >= this.mAllFire.size())
            this.mCurrentObj = this.mFirstObject;
    }

    let obj = this.mAllFire.getObjectAt(this.mCurrentObj);
    
    
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
    if (engine.keyboard.wasPressed("O")) {
        obj.incEmberSelection(1);
        
    }
    if (engine.keyboard.wasPressed("P")) {
        obj.incEmberSelection(-1);
        
    }
    if (engine.keyboard.wasPressed("K")) {
        obj.incTaperSelection(1);
        
    }
    if (engine.keyboard.wasPressed("L")) {
        obj.incTaperSelection(-1);
        
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
        if (engine.keyboard.isPressed("O")) {
        obj.incEmberSelection(1);
        
        }
        if (engine.keyboard.isPressed("P")) {
            obj.incEmberSelection(-1);
            
        }
        if (engine.keyboard.isPressed("K")) {
        obj.incTaperSelection(1);
        
        }
        if (engine.keyboard.isPressed("L")) {
            obj.incTaperSelection(-1);
            
        }
    }
       
    let p = obj.getPos();
    this.mTarget.getXform().setPosition(p[0], p[1]);
    this.updateValue(obj);
    this.backButton.update();
    this.MainMenuButton.update();
};

FireDemo.prototype.updateValue = function(obj){
    document.getElementById("fvalue1").innerHTML = obj.getWidth();
    document.getElementById("fvalue2").innerHTML = obj.getyAcceleration();
    document.getElementById("fvalue3").innerHTML = obj.getLife();
    document.getElementById("fvalue4").innerHTML = obj.getxVelocity();
    document.getElementById("fvalue5").innerHTML = obj.getyVelocity();
    document.getElementById("fvalue6").innerHTML = obj.getFlicker();
    document.getElementById("fvalue7").innerHTML = obj.getIntensity();
    document.getElementById("fvalue8").innerHTML = obj.getxAcceleration();
    document.getElementById("fvalue9").innerHTML = obj.getParticleSize();
    document.getElementById("fvalue10").innerHTML = obj.getyOffset();
    document.getElementById("fvalue11").innerHTML = obj.getEmberSelection();
    document.getElementById("fvalue12").innerHTML = obj.getTaperSelection();
};

FireDemo.prototype.createBounds = function() {
    let x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x+=30) 
        this.platformAt(x, y, w, 0);
};

FireDemo.prototype.platformAt = function (x, y, w, rot) {
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

FireDemo.prototype.backSelect = function(){
    this.LevelSelect="Back";
    engine.core.loop.stop();
};

FireDemo.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    engine.core.loop.stop();
};
