"use strict";  

function MyGame() {
    this.kUIButton = "assets/ui/simplebutton.png";
    this.kCue = "assets/audiotest/bluelevel_cue.wav";
    
    this.mCamera = null;
    this.ParticleButton = null;
    this.PhysicsButton = null;
    this.UIButton = null;
    this.UIText = null;
    this.LevelSelect = null;
}
engine.core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    engine.Textures.loadTexture(this.kUIButton);
    engine.audioClips.loadAudio(this.kCue);
};

MyGame.prototype.unloadScene = function () {
    engine.Textures.unloadTexture(this.kUIButton);
    if(this.LevelSelect==="Particle"){
        engine.core.startScene(new ParticleLevel());
    }
    else if(this.LevelSelect==="Physics"){
        engine.core.startScene(new RigidShapeDemo());
    }
    else if(this.LevelSelect==="UI"){
        engine.core.startScene(new UIDemo());
    }
    engine.audioClips.unloadAudio(this.kCue);
};

MyGame.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), 
        100,                     
        [0, 0, 800, 600]         
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    engine.defaultResources.setGlobalAmbientIntensity(3);
    
    this.ParticleButton = new UIButton(this.particleSelect,this,[400,400],[600,100],"Particle Demos",8);
    this.PhysicsButton = new UIButton(this.physicsSelect,this,[400,300],[500,100],"Physics Demo",8);
    this.UIButton =  new UIButton(this.uiSelect,this,[400,200],[320,100],"UI Demo",8);
    this.UIText = new UIText("Game Engine Tech Demo",[400,600],8,1,0,[0,0,0,1]);
};

MyGame.prototype.draw = function () {
    engine.graphics.clear([0.9, 0.9, 0.9, 1.0]); 
    
    
    this.mCamera.setupViewProjection();
    this.ParticleButton.draw(this.mCamera);
    this.PhysicsButton.draw(this.mCamera);
    this.UIButton.draw(this.mCamera);
    this.UIText.draw(this.mCamera);
};

MyGame.prototype.update = function () {
    this.ParticleButton.update();
    this.PhysicsButton.update();
    this.UIButton.update();
    
    if (engine.keyboard.isPressed("ArrowRight")) {
        engine.audioClips.playACue(this.kCue, 0.1);
    }
};

MyGame.prototype.particleSelect = function(){
    this.LevelSelect="Particle";
    engine.core.loop.stop();
};

MyGame.prototype.physicsSelect = function(){
    this.LevelSelect="Physics";
    engine.core.loop.stop();
};

MyGame.prototype.uiSelect= function(){
    this.LevelSelect="UI";
    engine.core.loop.stop();
};
