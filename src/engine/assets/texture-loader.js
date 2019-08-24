"use strict";  

engine.assetManager.registerLoader({
    supportedExtensions: [ ".bmp", "jpg", "jpeg", "png", ],

    load(name) {
        return Promise((resove, reject) => {
            const image = new Image();
            image.onload = () => {
                const gl = engine.graphics.gl;
                const texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
                resolve ({
                    texture,
                    width: image.naturalWidth,
                    height: image.naturalHeight,
                });
            }
            image.onerror(reject);
            image.src = name;
        });
    },

    // unload from GPU memory
    unload(name) {
        const gl = engine.graphics.gl;
        const texureInfo = engine.assetManager.retrieve(name);

        gl.deleteTexture(texureInfo.texture);
    },
 
});
