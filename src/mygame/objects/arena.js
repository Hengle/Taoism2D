"use strict";

function Arena(x,y,w,h,res,frct,s1,s2, art, p){
    this.mShapes = new GameObjectSet();
    this.mPset = new ParticleGameObjectSet();
    this.createBounds(x,y,w,h,res,frct,art);
    this.firstObject = this.mShapes.size();
    this.currentObject = this.firstObject;
    this.createObj(x+15,y+20,s1,s2);
    this.rep = p;
    this.pos = [x,y];
}

Arena.prototype.draw = function(aCamera){
    this.mShapes.draw(aCamera);
    if(this.rep===true){
       this.mPset.draw(aCamera); 
    }
};

Arena.prototype.update = function(){
    this.mShapes.update();
    if(this.rep===true){
        this.reportVelocity();
        this.mPset.update();
        this.particleCollision();
    }
    engine.Physics.processCollision(this.mShapes,[]);
};

Arena.prototype.createObj = function(x,y,s1,s2){
    let tmp=s1;
    for(let i=0; i<2; i++){
        if(tmp===0){
            this.createBouncy(x,y,2);
        }
        else if(tmp===1){
            this.createBall(x,y,4);
        }
        else if(tmp===2){
            this.createRock(x,y,5);
        }
        else if(tmp===3){
            this.createWood(x,y,4);
        }
        else if(tmp===4){
            this.createIce(x,y,5);
        }
        else{
            this.createBowlingBall(x,y,3);
        }
        tmp=s2;
        x+=10;
    }
};

Arena.prototype.createBounds = function(x,y,w,h,res,frct,art) {
    
    this.platformAt((x+3)+(w/2),y+3,w+3,0,res,frct,art);
    this.platformAt((x+3)+(w/2),y+3+h,w+3,0,res,frct,art);
    this.platformAt(x+3,(y+3)+(h/2),h+3,90,res,frct,art);
    this.platformAt(x+3+w,(y+3)+(h/2),h+3,90,res,frct,art);
};

Arena.prototype.incRestitution = function(inc){
    let res = this.mShapes.getObjectAt(0).getRigidBody().getRestitution();
    for(let i=0; i<4; i++){
        if(res+inc>1){
            this.mShapes.getObjectAt(i).getRigidBody().setRestitution(1);
        }
        else if(res+inc<0){
            this.mShapes.getObjectAt(i).getRigidBody().setRestitution(0);
        }
        else{
            this.mShapes.getObjectAt(i).getRigidBody().setRestitution(res+inc);
        }
    }
};

Arena.prototype.incFriction = function(inc){
    let frct = this.mShapes.getObjectAt(0).getRigidBody().getFriction();
    for(let i=0; i<4; i++){
        if(frct+inc<0){
            this.mShapes.getObjectAt(i).getRigidBody().setFriction(0);
        }
        else{
            this.mShapes.getObjectAt(i).getRigidBody().setFriction(frct+inc);
        }
    }
};

Arena.prototype.radomizeVelocity = function()
{
    let kSpeed = 40;
    let i = 0;
    for (i = this.firstObject; i<this.mShapes.size(); i++) {
        let obj = this.mShapes.getObjectAt(i);
        let rigidShape = obj.getRigidBody();
        let x = (Math.random() - 0.5) * kSpeed;
        let y = .6 * kSpeed * 0.5 + 2;
        rigidShape.setVelocity(x, y);
    }
};
Arena.prototype.lightOn = function(){
    for(let i=0; i<4; i++){
        this.mShapes.getObjectAt(i).getRenderable().setColor([1,1,1,.6]);
    }
};

Arena.prototype.lightOff = function(){
    for(let i=0; i<4; i++){
        this.mShapes.getObjectAt(i).getRenderable().setColor([1,1,1,0]);
    }
};

Arena.prototype.cycleBackward = function() {
    this.currentObject -= 1;
    if (this.currentObject < this.firstObject)
        this.currentObject = this.mShapes.size() - 1;
};            
Arena.prototype.cycleFoward = function() {
    this.currentObject += 1;
    if (this.currentObject >= this.mShapes.size())
        this.currentObject = this.firstObject;
};
Arena.prototype.getObject = function() {
    return this.mShapes.getObjectAt(this.currentObject);
};

Arena.prototype.wallAt = function (x, y, h, res, frct, art) {
    let w = 3;
    let p = new TextureRenderable(art);
    let xf = p.getXform();
    xf.setSize(w, h);
    xf.setPosition(x, y);
    let g = new GameObject(p);
    let r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRigidShape();
    
    r.setMass(0);
    r.setRestitution(res);
    r.setFriction(frct);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    this.mShapes.addToSet(g);
};

Arena.prototype.platformAt = function (x, y, w, rot, res, frct, art) {
    let h = 3;
    let p = new TextureRenderable(art);
    let xf = p.getXform();
    xf.setSize(w, h);
    xf.setPosition(x, y);
    let g = new GameObject(p);
    let r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRigidShape();
    
    r.setMass(0);
    r.setRestitution(res);
    r.setFriction(frct);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mShapes.addToSet(g);
};

Arena.prototype.createBouncy = function(x,y,size){
    let m = new Minion("assets/rigidshape/ball.png", x, y, 1, size);
    this.mShapes.addToSet(m);
    m.getRigidBody().setRestitution(.9);
    m.toggleDrawRenderable();
    m.toggleDrawRigidShape();
};

Arena.prototype.createBall = function(x,y,size){
    let m = new Minion("assets/rigidshape/soccerball.png", x, y, 1, size);
    this.mShapes.addToSet(m);
    m.getRigidBody().setRestitution(.7);
    m.getRigidBody().setFriction(.6);
    m.toggleDrawRenderable();
    m.toggleDrawRigidShape();
};

Arena.prototype.createIce = function(x,y,size){
    let m = new Minion("assets/rigidshape/ice.png", x, y, 0, size);
    this.mShapes.addToSet(m);
    m.getRigidBody().setRestitution(.4);
    m.getRigidBody().setFriction(.01);
    m.toggleDrawRenderable();
    m.toggleDrawRigidShape();
};

Arena.prototype.createRock = function(x,y,size){
    let m = new Minion("assets/rigidshape/rock.png", x, y, 0, size);
    this.mShapes.addToSet(m);
    m.getRigidBody().setMass(20);
    m.getRigidBody().setRestitution(.4);
    m.toggleDrawRenderable();
    m.toggleDrawRigidShape();
};

Arena.prototype.createWood = function(x,y,size){
    let m = new Minion("assets/rigidshape/woodball.png", x, y, 1, size);
    this.mShapes.addToSet(m);
    m.getRigidBody().setMass(5);
    m.getRigidBody().setRestitution(.5);
    m.getRigidBody().setFriction(.5);
    m.toggleDrawRenderable();
    m.toggleDrawRigidShape();
};

Arena.prototype.createBowlingBall= function(x,y,size){
    let m = new Minion("assets/rigidshape/bowlingball.png", x, y, 1, size);
    this.mShapes.addToSet(m);
    m.getRigidBody().setRestitution(.3);
    m.getRigidBody().setFriction(.2);
    m.getRigidBody().setMass(10);
    m.toggleDrawRenderable();
    m.toggleDrawRigidShape();
};

Arena.prototype.physicsReport = function(){
    let num1 = this.mShapes.getObjectAt(this.currentObject).getRigidBody().getInvMass();
    if(num1!==0){
        num1=1/num1;
    }
    let num2 = this.mShapes.getObjectAt(this.currentObject).getRigidBody().getRestitution();
    let num3 = this.mShapes.getObjectAt(this.currentObject).getRigidBody().getFriction();
   document.getElementById("value11").innerHTML = +num1.toFixed(2);
   document.getElementById("value12").innerHTML = +num2.toFixed(2);
   document.getElementById("value13").innerHTML = +num3.toFixed(2);
};

Arena.prototype.getCurrentState = function() {
    let num2 = this.mShapes.getObjectAt(0).getRigidBody().getRestitution();
    let num3 = this.mShapes.getObjectAt(0).getRigidBody().getFriction();
    return "Arena Physics Values: Friction=" + num3.toFixed(2) +
           " Restitution=" + num2.toFixed(2);
};

Arena.prototype.reportVelocity = function(){
    let info = new CollisionInfo();
    
    for(let i=this.firstObject; i<this.mShapes.size(); i++){
        if(this.mShapes.getObjectAt(0).getRigidBody().collisionTest(this.mShapes.getObjectAt(i).getRigidBody(),info)===true){
            if(this.mShapes.getObjectAt(i).getRigidBody().getVelocity()[1]<=-15){
                this.mPset.addEmitterAt([this.mShapes.getObjectAt(i).getRenderable().getXform().getPosition()[0],this.pos[1]+6], 20, this.createParticle);
            }
        }
    }
};

Arena.prototype.getPos = function(){
    return this.pos;
};

Arena.prototype.particleCollision = function(){
    for(let i=0; i<4; i++){
        engine.ParticleSystem.processObjSet(this.mShapes.getObjectAt(i),this.mPset);
    }
};

Arena.prototype.createParticle = function(atX, atY) {
    let life = 30 + Math.random() * 200;
    let p = new ParticleGameObject("assets/rigidshape/dirtparticle.png", atX, atY, life);
    p.getRenderable().setColor([.61, .30, .08, 1]);
    
    let r = Math.random() * 2.5;
    p.getXform().setSize(r, r);
    
    p.setFinalColor([.61, .30, .08, 1]);
    
    let fx = 30 * Math.random() - 60 * Math.random();
    let fy = 20 * Math.random()+10;
    p.getParticle().setVelocity([fx, fy]);
    
    p.setSizeDelta(0.985);
    
    return p;
};
