"use strict";  

function TextureInfo(name, w, h, id) {
    this.mName = name;
    this.mWidth = w;
    this.mHeight = h;
    this.mGLTexID = id;
    this.mColorArray = null;
}

engine.Textures = (function () {

    let _processLoadedImage = function (textureName, image) {
        let gl = engine.graphics.gl;

        let textureID = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, textureID);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);

        let texInfo = new TextureInfo(textureName, image.naturalWidth, image.naturalHeight, textureID);
        engine.ResourceMap.asyncLoadCompleted(textureName, texInfo);
    };

    let loadTexture = function (textureName) {
        if (!(engine.ResourceMap.isAssetLoaded(textureName))) {
            let img = new Image();

            engine.ResourceMap.asyncLoadRequested(textureName);

            img.onload = function () {
                _processLoadedImage(textureName, img);
            };
            img.src = textureName;
        } else {
            engine.ResourceMap.incAssetRefCount(textureName);
        }
    };

    let unloadTexture = function (textureName) {
        let gl = engine.graphics.gl;
        let texInfo = engine.ResourceMap.retrieveAsset(textureName);
        gl.deleteTexture(texInfo.mGLTexID);
        engine.ResourceMap.unloadAsset(textureName);
    };

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
        loadTexture,
        unloadTexture,
        activateTexture,
        activateNormalMap,
        deactivateTexture,
        getTextureInfo,
    };
    return mPublic;
}());
