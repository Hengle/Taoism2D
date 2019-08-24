"use strict";  

let kWASDDelta = 0.3;

function WASDObj() {
}
engine.core.inheritPrototype(WASDObj, GameObject);

WASDObj.prototype.keyControl = function () {
    let xform = this.getXform();
    if (engine.keyboard.isPressed("W")) {
        xform.incYPosBy(kWASDDelta);
    }
    if (engine.keyboard.isPressed("S")) {
        xform.incYPosBy(-kWASDDelta);
    }
    if (engine.keyboard.isPressed("A")) {
        xform.incXPosBy(-kWASDDelta);
    }
    if (engine.keyboard.isPressed("D")) {
        xform.incXPosBy(kWASDDelta);
    }
    if (engine.keyboard.isPressed("Z")) {
        xform.incRotationByDegree(1);
    }
    if (engine.keyboard.isPressed("X")) {
        xform.incRotationByDegree(-1);
    }
    
    this.getRigidBody().userSetsState();
    
    
};
