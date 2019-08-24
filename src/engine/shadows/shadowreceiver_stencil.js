"use strict";  

ShadowReceiver.prototype._shadowRecieverStencilOn = function () {
        let gl = engine.graphics.gl;
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.enable(gl.STENCIL_TEST);
        gl.colorMask(false, false, false, false);
        gl.depthMask(false);
        gl.stencilFunc(gl.NEVER, this.kShadowStencilBit, this.kShadowStencilMask);
        gl.stencilOp(gl.REPLACE,gl.KEEP, gl.KEEP);
        gl.stencilMask(this.kShadowStencilMask);
    };

ShadowReceiver.prototype._shadowRecieverStencilOff = function () {
    let gl = engine.graphics.gl;
    gl.depthMask(gl.TRUE);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilFunc(gl.EQUAL, this.kShadowStencilBit, this.kShadowStencilMask);
    gl.colorMask( true, true, true, true );
};

ShadowReceiver.prototype._shadowRecieverStencilDisable = function () {
    let gl = engine.graphics.gl;
    gl.disable(gl.STENCIL_TEST); 
};
