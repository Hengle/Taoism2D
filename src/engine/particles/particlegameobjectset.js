"use strict";

function ParticleGameObjectSet() {
    GameObjectSet.call(this);
    this.mEmitterSet = [];
}
engine.core.inheritPrototype(ParticleGameObjectSet, GameObjectSet);

ParticleGameObjectSet.prototype.addEmitterAt = function (p, n, func) {
    let e = new ParticleEmitter(p, n, func);
    this.mEmitterSet.push(e);
};

ParticleGameObjectSet.prototype.draw = function (aCamera) {
    let gl = engine.graphics.gl;
    gl.blendFunc(gl.ONE, gl.ONE);  
    GameObjectSet.prototype.draw.call(this, aCamera);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); 
};

ParticleGameObjectSet.prototype.update = function () {
    GameObjectSet.prototype.update.call(this);
    
    let i, e, obj;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.hasExpired()) {
            this.removeFromSet(obj);
        }
    }
    
    for (i=0; i<this.mEmitterSet.length; i++) {
        e = this.mEmitterSet[i];
        e.emitParticles(this);
        if (e.expired()) {
            this.mEmitterSet.splice(i, 1);
        }
    }
};
