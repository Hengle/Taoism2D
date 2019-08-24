"use strict";  

engine.assetManager.registerLoader({
    supportedExtensions: [".fnt",],

    load: (function () {
        return (
            fetch(name)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => (new window.DOMParser()).parseFromString(text, "text/xml"))
                .then(fontInfo => {
                    const bitmapName = String.prototype.slice.call(name, 0, -4) + ".png";
                    engine.assetManager.onLoaded(() => {
                        if (!engine.assetManager.isLoaded(bitmapName)) {
                            return true;
                        } else {
                            fontInfo.bitmapInfo = engine.assetManager.reference(bitmapName);
                            fontInfo.getCharInfo = getCharInfo;
                        }
                    });
                    return fontInfo;
                })
                .catch(err => {
                    console.error(err);
                })
        );

        function getCharInfo(aChar) {
            const commonPath = "font/common";
            const commonInfo = this.evaluate(commonPath, this, null, XPathResult.ANY_TYPE, null).iterateNext();
            if (commonInfo === null) {
                return null;
            }
            const charHeight = commonInfo.getAttribute("base");
        
            const charPath = "font/chars/char[@id=" + aChar + "]";
            const charInfo = this.evaluate(charPath, this, null, XPathResult.ANY_TYPE, null).iterateNext();
            if (charInfo === null) {
                return null;
            }
            const charWidth = charInfo.getAttribute("xadvance");
        
            const textureInfo = this.bitmapInfo;
            const leftPixel = Number(charInfo.getAttribute("x"));
            const rightPixel = leftPixel + Number(charInfo.getAttribute("width")) - 1;
            const topPixel = (textureInfo.mHeight - 1) - Number(charInfo.getAttribute("y"));
            const bottomPixel = topPixel - Number(charInfo.getAttribute("height")) + 1;
        
            return {
                // texture coordinate information
                mTexCoordLeft: leftPixel / (textureInfo.mWidth - 1),
                mTexCoordTop: topPixel / (textureInfo.mHeight - 1),
                mTexCoordRight: rightPixel / (textureInfo.mWidth - 1),
                mTexCoordBottom: bottomPixel / (textureInfo.mHeight - 1),
        
                // relative character size
                mCharWidth: charInfo.getAttribute("width") / charWidth,
                mCharHeight: charInfo.getAttribute("height") / charHeight,
                mCharWidthOffset: charInfo.getAttribute("xoffset") / charWidth,
                mCharHeightOffset: charInfo.getAttribute("yoffset") / charHeight,
                mCharAspectRatio: charWidth / charHeight,
            };
        };
    })(),

    // unload from GPU memory
    unload: name => {
        const bitmapName = String.prototype.slice.call(name, 0, -4) + ".png";
        engine.assetManager.dereference(bitmapName)
    },

});

