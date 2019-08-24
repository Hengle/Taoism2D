"use strict";  

function UIDemo() {
    this.kUIButton = "assets/ui/electricbutton.png";
    this.kUIButton2 = "assets/ui/bluebutton.png";
    this.kBG = "assets/ui/bg.png";
    this.kBgClip = "assets/audiotest/bgclip.mp3";
    this.kCue = "assets/audiotest/bluelevel_cue.wav";

    
    this.mCamera = null;
    this.bg = null;
    this.Slider = null;
    this.Slider2 = null;
    this.Bar = null;
    this.Bar2 = null;
    this.Toggle = null;
    this.Toggle2 = null;
    this.SwitchToggle = null;
    this.radarbox = null;
    this.UIButton1 = null;
    this.UIButton2 = null;
    this.UIText = null;
    this.UIRadio = null;
    this.UITextBox = null;
    this.UIDDButton = null;
    this.backButton = null;
    this.demoSelect = 0;
    this.cameraFlip = false;
}
engine.core.inheritPrototype(UIDemo, Scene);


UIDemo.prototype.loadScene = function () {
    engine.Textures.loadTexture(this.kUIButton);
    engine.Textures.loadTexture(this.kUIButton2);
    engine.Textures.loadTexture(this.kBG);
    engine.audioClips.loadAudio(this.kBgClip);
    engine.audioClips.loadAudio(this.kCue);
};

UIDemo.prototype.unloadScene = function () {
    engine.audioClips.stopBackgroundAudio();
    engine.audioClips.unloadAudio(this.kBgClip);
    engine.audioClips.unloadAudio(this.kCue);
    engine.Textures.unloadTexture(this.kUIButton);
    engine.Textures.unloadTexture(this.kUIButton2);
    engine.Textures.unloadTexture(this.kBG);
    engine.core.startScene(new MyGame());
};

UIDemo.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), 
        100,                     
        [0, 0, 800, 600]         
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    engine.defaultResources.setGlobalAmbientIntensity(10);
    
    this.Bar = new UIBar([400, 400],[480,40]);
    this.Bar.setMidElemColor([0.6,0,0,1]);
    this.Bar2 = new UIBar([125, 290],[40,480]);
    this.Bar2.setMidVisible(false);
    this.Bar2.configInterpolation(240,0.025);
    this.Bar2.setTopElemColor([0.4,1,0.4,1]);
    this.UIButton1 = new UISpriteButton(this.kUIButton, this.barValueDown,this,[300,350],[160,40],"-10",3.5);
    this.UIButton1.setTextColor([1,1,1,1]);
    this.UIButton2 = new UISpriteButton(this.kUIButton2, this.barValueUp,this,[500,350],[160,40],"+10",3.5);
    this.UIButton2.setTextColor([1,1,1,1]);
    
    this.Slider = new UISlider([400, 100],[480,40]);
    this.Slider.setMaxValue(1);
    this.Slider.setMultiplier(100);
    this.Slider.setToFixedValue(0);
    this.Slider.setSnap(true);
    this.Slider.setSnapBy(0.1);
    this.Slider2 = new UISlider([50, 290],[40,480]);
    this.Slider2.setColor([1,1,0,1]);
    this.Slider2.setHandleColor([1,0.50,0,1]);
    this.Slider2.setTextColor([1,1,1,1]);
    
    this.Toggle = new UIToggle([350,300], [300,40],["A","B","C","D", "E"],4);
    this.Toggle2 = new UIToggle([650,300], [110, 115],["Look","I'm","Vertical"],2.5);
    this.Toggle2.setSelectionColor([1,0,0.5,1]);
    this.Toggle2.setSelectedTextColor([0.75,1,0,1]);
    this.SwitchToggle = new UISwitchToggle([500, 250], [80,40]);
    
    this.UIText = new UIText("UI Testing Ground",[400,600],8,1,0,[1,1,1,1]);
    this.UITextBox = new UITextBox([500,200],6,35,[1,1,1,1],[0,0,0,1],this.UITextBoxTest,this);
    
    this.radarbox=new Renderable();
    this.radarbox.getXform().setPosition(40,30);
    this.radarbox.getXform().setSize(20,20);
    this.radarbox.setColor([1,1,1,1]);
    
    this.bg = new TextureRenderable(this.kBG);
    this.bg.getXform().setSize(200,160);
    this.bg.getXform().setPosition(30,20);
    this.UIDDButton = new UIDropDown([400,500],"Pick",6,[0,0,0,1],[1,1,1,1]);
    this.UIDDButton.addToSet("Bar Demo",[0,0,0,1],[1,0,0,1],this.barSelect,this,this.mCamera);
    this.UIDDButton.addToSet("Slider Demo",[0,0,0,1],[1,1,0,1],this.sliderSelect,this,this.mCamera);
    this.UIDDButton.addToSet("Toggle Demo",[0,0,0,1],[1,0,1,1],this.toggleSelect,this,this.mCamera);
    this.UIDDButton.addToSet("Text Demo",[0,0,0,1],[0,0,1,1],this.textBoxSelect,this,this.mCamera);
    this.UIDDButton.addToSet("Radio Demo",[0,0,0,1],[0,1,0,1],this.radarSelect,this,this.mCamera);
    this.UIDDButton.addToSet("All Demos",[0,0,0,1],[1,1,1,1],this.allSelect,this,this.mCamera);
    this.UIRadio=new UIRadio(this.setToRed,this,[200,200],"Red",2,[0.5,0.5,0.5,1],this.mCamera);
    this.UIRadio.addToSet(this.setToBlue,this,"Blue",[0.5,0.5,0.5,1],this.mCamera);
    this.UIRadio.addToSet(this.setToGreen,this,"Green",[0.5,0.5,0.5,1],this.mCamera);
    this.backButton = new UIButton(this.backSelect,this,[80,20],[160,40],"Go Back",4);
    engine.audioClips.playBackgroundAudio(this.kBgClip);
};

UIDemo.prototype.draw = function () {
    engine.graphics.clear([0.9, 0.9, 0.9, 1.0]); 
    
    this.mCamera.setupViewProjection();
    
    this.bg.draw(this.mCamera);
    
    this.radarbox.draw(this.mCamera);
    if(this.demoSelect===1||this.demoSelect===6){
        this.Bar.draw(this.mCamera);
        this.Bar2.draw(this.mCamera);
        this.UIButton1.draw(this.mCamera);
        this.UIButton2.draw(this.mCamera);
    }
    if(this.demoSelect===2||this.demoSelect===6){
        this.Slider.draw(this.mCamera);
        this.Slider2.draw(this.mCamera);
    }
    if(this.demoSelect===3||this.demoSelect===6){
        this.Toggle.draw(this.mCamera);
        this.Toggle2.draw(this.mCamera);
        this.SwitchToggle.draw(this.mCamera);
    }
    if(this.demoSelect===4||this.demoSelect===6){
        this.UITextBox.draw(this.mCamera);
    }
    if(this.demoSelect===5||this.demoSelect===6){
        this.UIRadio.draw(this.mCamera);
    }
    this.UIText.draw(this.mCamera);
    this.UIDDButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
};

UIDemo.prototype.update = function () {
    if(this.demoSelect===1||this.demoSelect===6){
        this.Slider.update();
        this.Bar.update();
        this.Bar2.update();
        this.UIButton1.update();
        this.UIButton2.update();
    }
    if(this.demoSelect===2||this.demoSelect===6){
        this.Slider.update();
        engine.audioClips.setBackgroundVolume(this.Slider.getCurrentValue());
        this.Slider2.update();
        engine.audioClips.setMasterVolume(this.Slider2.getCurrentValue());
        if(engine.keyboard.wasPressed("C")){
            engine.audioClips.playACue(this.kCue, 0.5);
        }
    }
    else {
        engine.audioClips.setBackgroundVolume(0);
    }
    if(this.demoSelect===3||this.demoSelect===6){
        this.Toggle.update();
        this.Toggle2.update();
        this.SwitchToggle.update();
    }
    if(this.demoSelect===4||this.demoSelect===6){
        this.UITextBox.update(this.mCamera);
    }
    if(this.demoSelect===5||this.demoSelect===6){
        this.UIRadio.update();
    }
    this.UIDDButton.update(this.mCamera);
    this.backButton.update();
    let center = this.mCamera.getWCCenter();
    if(this.cameraFlip===false){
        this.mCamera.setWCCenter(center[0]+.1,center[1]);
    }
    else{
        this.mCamera.setWCCenter(center[0]-.1,center[1]);
    }
    if(center[0]>60){
        this.cameraFlip=true;
    }
    else if(center[0]<10){
        this.cameraFlip=false;
    }
    this.mCamera.update();
};

UIDemo.prototype.barValueUp = function() {
    this.Bar.incCurrentValue(10);
    this.Bar2.incCurrentValue(10);
};

UIDemo.prototype.barValueDown = function(){
    this.Bar.incCurrentValue(-10);
    this.Bar2.incCurrentValue(-10);
};

UIDemo.prototype.setToRed = function() {
    this.radarbox.setColor([1,0,0,1]);
};

UIDemo.prototype.setToBlue = function() {
    this.radarbox.setColor([0,0,1,1]);
};

UIDemo.prototype.setToGreen = function() {
    this.radarbox.setColor([0,1,0,1]);
};

UIDemo.prototype.barSelect = function(){
    this.demoSelect=1;
};

UIDemo.prototype.sliderSelect = function() {
    this.demoSelect=2;
};

UIDemo.prototype.toggleSelect = function() {
    this.demoSelect=3;
};

UIDemo.prototype.textBoxSelect = function(){
    this.demoSelect=4;
};

UIDemo.prototype.radarSelect = function(){
    this.demoSelect=5;
};

UIDemo.prototype.allSelect = function(){
    this.demoSelect=6;
};

UIDemo.prototype.UITextBoxTest = function(){
    this.UIText.setText(this.UITextBox.getEnteredValue());
};

UIDemo.prototype.backSelect = function(){
    engine.core.loop.stop();
};
