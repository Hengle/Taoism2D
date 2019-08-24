"use strict";
function UIDropDown(position,text,textSize,textColor,boxColor){
    GameObjectSet.call(this);
    this.basePosition=position;
    this.size=textSize;
    this.color=textColor;
    this.click = -1;
    this.visible = false;
    this.headButton = new UIDDButton(position, text, textSize, textColor, boxColor, this.flipVisible, this);
    this.arrow = new TextureRenderable("assets/ui/ddarrow.png",position,this.size,this.size);
    this.arrow._setShader(engine.defaultResources.getUnlitTextureShader());
    this.arrow.getXform().setSize(this.size,this.size);
    this.arrow.getXform().setZPos(3);
    this.maxWidth = this.headButton.getWidth();
    this.headButton.setWidth(this.maxWidth+textSize);
}

engine.core.inheritPrototype(UIDropDown, GameObjectSet);

UIDropDown.prototype.update = function(aCamera){
    this.headButton.update(aCamera);
    if(this.visible===true){
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].update(aCamera);
        }
        for (i = 0; i < this.mSet.length; i++) {
            if(this.mSet[i].getClick()===true){this.click=i;}
        }
    if(this.click>=0){
        this.headButton.setText(this.mSet[this.click].getText());
        this.headButton.setBoxColor(this.mSet[this.click].getBoxColor());
        this.visible=false;
        this.click=-1;
        this.arrow.getXform().incRotationByDegree(180); 
    }
    else{
        if(engine.mouse.wasPressed(0)&&this.headButton.getClick()===false){
            this.visible=false;
            this.arrow.getXform().incRotationByDegree(180); 
        }
    }
    }
};

UIDropDown.prototype.addToSet = function (text, textColor, boxColor, callback, context, aCamera){
    let ypos=this.basePosition[1];
    let pixSize=this.size*(aCamera.getViewport()[2]/aCamera.getWCWidth());
    ypos=ypos-(pixSize*(this.mSet.length+1));
    let pos=[this.basePosition[0],ypos];
    let u = new UIDDButton(pos,text,this.size,textColor,boxColor,callback,context);
    this.mSet.push(u);
    if(u.getWidth()>this.maxWidth){
        let uWidth=u.getWidth();
        this.headButton.setWidth(uWidth+this.size);
        for (let i = 0; i < this.mSet.length; i++) {
            this.mSet[i].setWidth(uWidth);
        }
        this.maxWidth=uWidth;
    }
    else{
        u.setWidth(this.maxWidth);
    }
};
UIDropDown.prototype.flipVisible = function(){
    this.visible=!this.visible;
    this.arrow.getXform().incRotationByDegree(180);  
};

UIDropDown.prototype.draw = function(aCamera){
    this.headButton.draw(aCamera);
    let pos = this.headButton.getBoxPos();
    let tmp=pos[0]+(this.maxWidth/2);
    this.arrow.getXform().setPosition(tmp,pos[1]);
    this.arrow.draw(aCamera);
    if(this.visible===true){
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].draw(aCamera);
        }
    }
};

UIDropDown.prototype.getHeadButton = function(){
    return this.headButton;
};
