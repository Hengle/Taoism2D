"use strict";  
engine.Fonts = (function () {
    let _storeLoadedFont = function (fontInfoSourceString) {
        let fontName = fontInfoSourceString.slice(0, -4);  
        let fontInfo = engine.ResourceMap.retrieveAsset(fontInfoSourceString);
        fontInfo.FontImage = fontName + ".png";
        engine.ResourceMap.asyncLoadCompleted(fontName, fontInfo); 
    };

    let loadFont = function (fontName) {
        if (!(engine.ResourceMap.isAssetLoaded(fontName))) {
            let fontInfoSourceString = fontName + ".fnt";
            let textureSourceString = fontName + ".png";

            engine.ResourceMap.asyncLoadRequested(fontName); 

            engine.Textures.loadTexture(textureSourceString);
            engine.TextFileLoader.loadTextFile(fontInfoSourceString,
                            engine.TextFileLoader.eTextFileType.eXMLFile, _storeLoadedFont);
        } else {
            engine.ResourceMap.incAssetRefCount(fontName);
        }
    };

    let unloadFont = function (fontName) {
        engine.ResourceMap.unloadAsset(fontName);
        if (!(engine.ResourceMap.isAssetLoaded(fontName))) {
            let fontInfoSourceString = fontName + ".fnt";
            let textureSourceString = fontName + ".png";

            engine.Textures.unloadTexture(textureSourceString);
            engine.TextFileLoader.unloadTextFile(fontInfoSourceString);
        }
    };

    let getCharInfo = function (fontName, aChar) {
        const fontInfo = engine.ResourceMap.retrieveAsset(fontName);

        const commonPath = "font/common";
        const commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null).iterateNext();
        if (commonInfo === null) {
            return null;
        }
        const charHeight = commonInfo.getAttribute("base");

        const charPath = "font/chars/char[@id=" + aChar + "]";
        const charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null).iterateNext();
        if (charInfo === null) {
            return null;
        }
        const charWidth = charInfo.getAttribute("xadvance");

        const textureInfo = engine.Textures.getTextureInfo(fontInfo.FontImage);
        const leftPixel = Number(charInfo.getAttribute("x"));
        const rightPixel = leftPixel + Number(charInfo.getAttribute("width")) - 1;
        const topPixel = (textureInfo.mHeight - 1) - Number(charInfo.getAttribute("y"));
        const bottomPixel = topPixel - Number(charInfo.getAttribute("height")) + 1;

        return {
            mTexCoordLeft: leftPixel / (textureInfo.mWidth - 1),
            mTexCoordTop: topPixel / (textureInfo.mHeight - 1),
            mTexCoordRight: rightPixel / (textureInfo.mWidth - 1),
            mTexCoordBottom: bottomPixel / (textureInfo.mHeight - 1),

            mCharWidth: charInfo.getAttribute("width") / charWidth,
            mCharHeight: charInfo.getAttribute("height") / charHeight,
            mCharWidthOffset: charInfo.getAttribute("xoffset") / charWidth,
            mCharHeightOffset: charInfo.getAttribute("yoffset") / charHeight,
            mCharAspectRatio: charWidth / charHeight,
        }
    };

    let mPublic = {
        loadFont,
        unloadFont,
        getCharInfo
    };
    return mPublic;
}());
