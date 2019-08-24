"use strict";

function ParticleEmitter(pos, num, createrFunc) {
    this.kMinToEmit = 5;

    this.mEmitPosition = pos;   

    this.mNumRemains = num;
    
    this.mParticleCreator = createrFunc;
}
ParticleEmitter.prototype.expired = function () { return (this.mNumRemains <= 0); };
ParticleEmitter.prototype.emitParticles = function (pSet) {
    let numToEmit = 0;
    if (this.mNumRemains < this.kMinToEmit) {
        numToEmit = this.mNumRemains;
    } else  {
        numToEmit = Math.random() * 0.2 * this.mNumRemains;
    }
    this.mNumRemains -= numToEmit;
    let i, p;
    for (i = 0; i < numToEmit; i++) {
        p = this.mParticleCreator(this.mEmitPosition[0], this.mEmitPosition[1]);
        pSet.addToSet(p);
    }
};
