"use strict";  

let kMinionWidth = 6*0.5;
let kMinionHeight = 4.8*0.5;
let kMinionRandomSize = 5;

function Minion(spriteTexture, atX, atY, createCircle, size) {
        
    let w = kMinionWidth + size;
    let h = kMinionHeight + size;
    
    this.mMinion = new TextureRenderable(spriteTexture);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(atX, atY);
    this.mMinion.getXform().setSize(w, h);
    if(createCircle===1){
       this.mMinion.getXform().setSize(h, h); 
    }

    GameObject.call(this, this.mMinion);
    
    let r;
    if (createCircle)
        r = new RigidCircle(this.getXform(), 0.35*Math.sqrt(w*w + h*h)); 
    else
        r = new RigidRectangle(this.getXform(), w, h);
    let vx = (Math.random() - 0.5);
    let vy = (Math.random() - 0.5);
    let speed = 20 + Math.random() * 10;
    r.setVelocity(vx * speed, vy * speed);
    this.setRigidBody(r);
    this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
}
engine.core.inheritPrototype(Minion, WASDObj);

Minion.prototype.update = function (aCamera) {
    GameObject.prototype.update.call(this);
};
