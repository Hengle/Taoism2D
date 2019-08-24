"use strict";  

function RigidShapeDemo() {
    this.kTargetTexture = "assets/rigidshape/target.png";
    this.kIce = "assets/rigidshape/ice.png";
    this.kWood = "assets/rigidshape/wood.png";
    this.kDirt = "assets/rigidshape/dirt.png";
    this.kMud = "assets/rigidshape/mud.png";
    this.kRock = "assets/rigidshape/rock.png";
    this.kBouncy = "assets/rigidshape/ball.png";
    this.kBall = "assets/rigidshape/soccerball.png";
    this.kWoodBall = "assets/rigidshape/woodball.png";
    this.kParticleTexture = "assets/rigidshape/dirtparticle.png";
    this.kBowlingBall = "assets/rigidshape/bowlingball.png";
    
    this.kUIButton = "assets/ui/simplebutton.png";
    
    this.mCamera = null;
    
    this.mArenaStatus = null;
    this.mLabels = null;
    
    this.world = null;
    this.backButton = null;
    
    this.mCurrentObj = 0;
    this.mTarget = null;
}
engine.core.inheritPrototype(RigidShapeDemo, Scene);


RigidShapeDemo.prototype.loadScene = function () {
    engine.Textures.loadTexture(this.kTargetTexture);
    engine.Textures.loadTexture(this.kWood);
    engine.Textures.loadTexture(this.kDirt);
    engine.Textures.loadTexture(this.kIce);
    engine.Textures.loadTexture(this.kMud);
    engine.Textures.loadTexture(this.kRock);
    engine.Textures.loadTexture(this.kBouncy);
    engine.Textures.loadTexture(this.kBall);
    engine.Textures.loadTexture(this.kWoodBall);
    engine.Textures.loadTexture(this.kParticleTexture);
    engine.Textures.loadTexture(this.kBowlingBall);
    engine.Textures.loadTexture(this.kUIButton);
    document.getElementById("physics").style.display="block";
};

RigidShapeDemo.prototype.unloadScene = function () {
    engine.Textures.unloadTexture(this.kTargetTexture);
    engine.Textures.unloadTexture(this.kWood);
    engine.Textures.unloadTexture(this.kDirt);
    engine.Textures.unloadTexture(this.kIce);
    engine.Textures.unloadTexture(this.kMud);
    engine.Textures.unloadTexture(this.kRock);
    engine.Textures.unloadTexture(this.kBouncy);
    engine.Textures.unloadTexture(this.kBall);
    engine.Textures.unloadTexture(this.kWoodBall);
    engine.Textures.unloadTexture(this.kBowlingBall);
    engine.Textures.unloadTexture(this.kUIButton);
    document.getElementById("physics").style.display="none";
    engine.core.startScene(new MyGame());
};

RigidShapeDemo.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), 
        100,                     
        [0, 0, 800, 600]         
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    engine.defaultResources.setGlobalAmbientIntensity(3);
    this.world = new GameObjectSet();
    let m;
    m = new Arena(-1.5,0,47,47*.75,.6,.01,1,2,this.kIce,false); 
    this.world.addToSet(m);
    m = new Arena(48.5,38.5,47,47*.75,.01,.1,0,5,this.kMud,true); 
    this.world.addToSet(m);
    m = new Arena(-1.5,38.5,47,47*.75,.8,.5,0,2,this.kWood,false); 
    this.world.addToSet(m);
    m = new Arena(48.5,0,47,47*.75,.3,.7,3,4,this.kDirt,false); 
    this.world.addToSet(m);
    
    
    let r = new TextureRenderable(this.kTargetTexture);
    this.mTarget = new GameObject(r);
    let xf = r.getXform();
    xf.setSize(3, 3);
    
    this.mFirstObject = 0;
    this.mCurrentObj = this.mFirstObject;
    
    this.mLabels=new GameObjectSet();
    m;
    m = new FontRenderable("Ice");
    m.setColor([1, 1, 1, 1]);
    m.getXform().setPosition(20, 39);
    m.setTextHeight(2.5);
    this.mLabels.addToSet(m);
    
    m = new FontRenderable("Wood");
    m.setColor([1, 1, 1, 1]);
    m.getXform().setPosition(20, 77);
    m.setTextHeight(2.5);
    this.mLabels.addToSet(m);
    
    m = new FontRenderable("Dirt");
    m.setColor([1, 1, 1, 1]);
    m.getXform().setPosition(70, 39);
    m.setTextHeight(2.5);
    this.mLabels.addToSet(m);
    
    m = new FontRenderable("Mud");
    m.setColor([1, 1, 1, 1]);
    m.getXform().setPosition(70, 77);
    m.setTextHeight(2.5);
    this.mLabels.addToSet(m);
    
    this.mArenaStatus = new FontRenderable("");
    this.mArenaStatus.setColor([0, 0, 0, 1]);
    this.mArenaStatus.getXform().setPosition(5, 42);
    this.mArenaStatus.setTextHeight(2.5);
    
    this.backButton = new UIButton(this.backSelect,this,[400,580],[160,40],"Go Back",4);
};

RigidShapeDemo.prototype.draw = function () {
    engine.graphics.clear([0.9, 0.9, 0.9, 1.0]);

    this.mCamera.setupViewProjection();
    /*for (var i = 0; i<this.mCollisionInfos.length; i++) 
        this.mCollisionInfos[i].draw(this.mCamera); */
    this.mCollisionInfos = []; 
    
    this.world.draw(this.mCamera);
    this.mTarget.draw(this.mCamera);
    this.mArenaStatus.draw(this.mCamera);
    this.mLabels.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
};

RigidShapeDemo.kBoundDelta = 0.1;
RigidShapeDemo.prototype.update = function () {
    let area = this.world.getObjectAt(this.mCurrentObj);
    let pos = area.getPos();
    
    if (engine.keyboard.wasPressed("ArrowLeft")) {
        area.cycleFoward();
    }
    if (engine.keyboard.wasPressed("ArrowRight")) {
        area.cycleBackward();
    }
    
    if (engine.keyboard.isPressed("C")) {
        area.incRestitution(-.01);
    }
    if (engine.keyboard.isPressed("V")) {
        area.incRestitution(.01);
    }
    if (engine.keyboard.isPressed("B")) {
        area.incFriction(-.01);
    }
    if (engine.keyboard.isPressed("N")) {
        area.incFriction(.01);
    }
    if (engine.keyboard.wasPressed("H")) {
        area.radomizeVelocity();
    }
    
    if (engine.keyboard.wasPressed("U")) {
        area.createBouncy(pos[0]+15,pos[1]+20,2);
    }
    if (engine.keyboard.wasPressed("J")) {
        area.createBall(pos[0]+15,pos[1]+20,4);
    }
    if (engine.keyboard.wasPressed("I")) {
        area.createRock(pos[0]+15,pos[1]+20,5);
    }
    
    if (engine.keyboard.wasPressed("K")) {
        area.createWood(pos[0]+15,pos[1]+20,4);
    }
    if (engine.keyboard.wasPressed("O")) {
        area.createIce(pos[0]+15,pos[1]+20,5);
    }
    
    if (engine.keyboard.wasPressed("L")) {
        area.createBowlingBall(pos[0]+15,pos[1]+20,3);
    }
    
    if (engine.keyboard.wasPressed("Z")) {
        area.lightOff();
        this.mCurrentObj -= 1;
        if (this.mCurrentObj < this.mFirstObject)
            this.mCurrentObj = this.world.size() - 1;
    }            
    if (engine.keyboard.wasPressed("X")) {
        area.lightOff();
        this.mCurrentObj += 1;
        if (this.mCurrentObj >= this.world.size())
            this.mCurrentObj = this.mFirstObject;
    }
    this.world.getObjectAt(this.mCurrentObj).lightOn();
    this.world.update();
    let obj = area.getObject();
    area.physicsReport();
    obj.keyControl();

    let p = obj.getXform().getPosition();
    this.mTarget.getXform().setPosition(p[0], p[1]);
    this.backButton.update();
    this.mArenaStatus.setText(area.getCurrentState());
};

RigidShapeDemo.prototype.backSelect = function(){
    engine.core.loop.stop();
};
