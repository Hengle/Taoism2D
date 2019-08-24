"use strict"

function TextureInfo(name, w, h, id) {
    this.mName = name;
    this.mWidth = w;
    this.mHeight = h;
    this.mGLTexID = id;
    this.mColorArray = null;
}

engine.Textures = (function () {

    let activateTexture = function (textureName) {
        let gl = engine.graphics.gl;
        let texInfo = engine.ResourceMap.retrieveAsset(textureName);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    };

    let activateNormalMap = function (textureName) {
        let gl = engine.graphics.gl;
        let texInfo = engine.ResourceMap.retrieveAsset(textureName);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    };

    let deactivateTexture = function () {
        let gl = engine.graphics.gl;
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    let getTextureInfo = function (textureName) {
        return engine.ResourceMap.retrieveAsset(textureName);
    };

    let mPublic = {
        activateTexture,
        activateNormalMap,
        deactivateTexture,
        getTextureInfo,
    };
    return mPublic;
}());
