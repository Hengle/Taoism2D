"use strict";  
engine.Stencil = (function () {
    let beginDrawToStencilBuffer  = function() {
        let gl = engine.graphics.gl;
        gl.enable(gl.STENCIL_TEST);     
        gl.stencilMask(0xFF);    
        
        gl.stencilFunc(gl.ALWAYS, 1, 0xFF);  
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE); 
        
        gl.depthMask(false);
        gl.colorMask(false, false, false, true);
    };
    
    let clearStencilBuffer  = function() {
        let gl = engine.graphics.gl;
        gl.clearStencil(0);      
        gl.clear(gl.STENCIL_BUFFER_BIT);
    };
    
    
    let endDrawToStencilBuffer = function() {
        let gl = engine.graphics.gl;
        gl.disable(gl.STENCIL_TEST);     
        gl.stencilMask(0x00);
        gl.stencilFunc(gl.NEVER, 0, 0x00);
        
        gl.depthMask(true);
        gl.colorMask(true, true, true, true);
    };
    
    let beginStencilCulling = function() {
        let gl = engine.graphics.gl;
        gl.enable(gl.STENCIL_TEST);     
        gl.stencilMask(0xFF);
        gl.stencilFunc(gl.EQUAL, 1, 0xFF); 
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP); 
    };
    
    let endStencilCulling = function () {
        let gl = engine.graphics.gl;
        gl.disable(gl.STENCIL_TEST);
    };


    let mPublic = {
        beginDrawToStencilBuffer,
        endDrawToStencilBuffer,
        clearStencilBuffer,
        beginStencilCulling,
        endStencilCulling
    };
    return mPublic;
}());
