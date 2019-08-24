"use strict";  

function ShadowReceiver (theReceiverObject) {
    this.kShadowStencilBit = 0x01;              
    this.kShadowStencilMask = 0xFF;             
    this.mReceiverShader = engine.defaultResources.getShadowReceiverShader();
    
    this.mReceiver = theReceiverObject;
    
    this.mShadowCaster = [];                    
}
    
ShadowReceiver.prototype.addShadowCaster = function (lgtRenderable) {
    let c = new ShadowCaster(lgtRenderable, this.mReceiver);
    this.mShadowCaster.push(c);
};

ShadowReceiver.prototype.draw = function (aCamera) {
    let c;
    
    this.mReceiver.draw(aCamera);
    
    this._shadowRecieverStencilOn();
    let s = this.mReceiver.getRenderable().swapShader(this.mReceiverShader);
    this.mReceiver.draw(aCamera);
    this.mReceiver.getRenderable().swapShader(s);
    this._shadowRecieverStencilOff();
    
    for (c = 0; c < this.mShadowCaster.length; c++) {
        this.mShadowCaster[c].draw(aCamera);
    }
    
    this._shadowRecieverStencilDisable();
};

ShadowReceiver.prototype.update = function () {
    this.mReceiver.update();
};
