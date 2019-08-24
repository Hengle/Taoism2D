"use strict";  

function ParticleLevel() {
    this.kUIButton = "assets/ui/button.png";
    
    this.mCamera = null;
    this.LevelSelect = null;
    this.FireButton = null;
    this.SmokeButton = null;
    this.SnowButton = null;
    this.DustButton = null;
    this.SFXButton = null;
    this.BackButton = null;
    this.UIText = null;
}
engine.core.inheritPrototype(ParticleLevel, Scene);


ParticleLevel.prototype.loadScene = function () {
    engine.Textures.loadTexture(this.kUIButton);
};

ParticleLevel.prototype.unloadScene = function () {
    engine.Textures.unloadTexture(this.kUIButton);
    if(this.LevelSelect==="Fire"){
        engine.core.startScene(new FireDemo());
    }
    else if(this.LevelSelect==="Smoke"){
        engine.core.startScene(new SmokeDemo());
    }
    else if(this.LevelSelect==="Snow"){
        engine.core.startScene(new SnowDemo());
    }
    else if(this.LevelSelect==="Dust"){
        engine.core.startScene(new DustDemo());
    }
    else if(this.LevelSelect==="SFX"){
        engine.core.startScene(new SFXDemo());
    }
    else if(this.LevelSelect==="Back"){
        engine.core.startScene(new MyGame());
    }    
};

ParticleLevel.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), 
        100,                     
        [0, 0, 800, 600]         
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    engine.defaultResources.setGlobalAmbientIntensity(3);
    
   
    this.FireButton = new UIButton(this.fireSelect,this,[400,450],[450,70],"Fire Demo",8);
    this.SmokeButton = new UIButton(this.smokeSelect,this,[400,375],[450,70],"Smoke Demo",8);
    this.SnowButton = new UIButton(this.snowSelect,this,[400,300],[450,70],"Snow Demo",8);
    this.DustButton = new UIButton(this.dustSelect,this, [400,220],[450,70],"Dust Demo",8);
    this.SFXButton = new UIButton(this.SFXSelect,this,[400,145],[450,70],"SFX Demo",8);
    this.BackButton = new UIButton(this.backSelect,this,[400,70],[450,70],"Go Back",8);
    this.UIText = new UIText("Select Particle Demo",[400,600],8,1,0,[0,0,0,1]);
};

ParticleLevel.prototype.draw = function () {
    engine.graphics.clear([0.9, 0.9, 0.9, 1.0]); 
    
    
    this.mCamera.setupViewProjection();
    this.FireButton.draw(this.mCamera);
    this.SmokeButton.draw(this.mCamera);
    this.SnowButton.draw(this.mCamera);
    this.DustButton.draw(this.mCamera);
    this.SFXButton.draw(this.mCamera);
    this.BackButton.draw(this.mCamera);
    this.UIText.draw(this.mCamera);
};

ParticleLevel.prototype.update = function () {
    this.FireButton.update();
    this.SmokeButton.update();
    this.SnowButton.update();
    this.DustButton.update();
    this.SFXButton.update();
    this.BackButton.update();
};

ParticleLevel.prototype.fireSelect = function(){
    this.LevelSelect="Fire";
    engine.core.loop.stop();
};

ParticleLevel.prototype.smokeSelect = function(){
    this.LevelSelect="Smoke";
    engine.core.loop.stop();
};

ParticleLevel.prototype.snowSelect = function(){
    this.LevelSelect="Snow";
    engine.core.loop.stop();
};

ParticleLevel.prototype.dustSelect = function(){
    this.LevelSelect="Dust";
    engine.core.loop.stop();
};

ParticleLevel.prototype.SFXSelect = function (){
    this.LevelSelect="SFX";
    engine.core.loop.stop();
}

ParticleLevel.prototype.backSelect = function(){
    this.LevelSelect="Back";
    engine.core.loop.stop();
};
