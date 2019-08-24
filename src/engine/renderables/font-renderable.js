"use strict";  

function FontRenderable(aString) {
    this.mFont = engine.defaultResources.getDefaultFont();
    this.mOneChar = new SpriteRenderable(this.mFont + ".png");
    this.mXform = new Transform(); 
    this.mText = aString;
}

FontRenderable.prototype.draw = function (aCamera) {
    let widthOfOneChar = this.mXform.getWidth() / this.mText.length;
    let heightOfOneChar = this.mXform.getHeight();
    let yPos = this.mXform.getYPos();

    let xPos = this.mXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
    let charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
    for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
        aChar = this.mText.charCodeAt(charIndex);
        charInfo = engine.Fonts.getCharInfo(this.mFont, aChar);

        this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft, charInfo.mTexCoordRight,
            charInfo.mTexCoordBottom, charInfo.mTexCoordTop);

        xSize = widthOfOneChar * charInfo.mCharWidth;
        ySize = heightOfOneChar * charInfo.mCharHeight;
        this.mOneChar.getXform().setSize(xSize, ySize);

        xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
        yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;

        this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);
        this.mOneChar.getXform().setZPos(this.mXform.getZPos());
        this.mOneChar.draw(aCamera);

        xPos += widthOfOneChar;
    }
};

FontRenderable.prototype.getXform = function () { return this.mXform; };

FontRenderable.prototype.getText = function () { return this.mText; };

FontRenderable.prototype.setText = function (t) {
    this.mText = t;
    this.setTextHeight(this.getXform().getHeight());
};

FontRenderable.prototype.setTextHeight = function (h) {
    let charInfo = engine.Fonts.getCharInfo(this.mFont, "A".charCodeAt(0)); 
    let w = h * charInfo.mCharAspectRatio;
    this.getXform().setSize(w * this.mText.length, h);
};

FontRenderable.prototype.getSymbolSize = function() {
  let size = this.getXform().getSize();
  return vec2.fromValues(size[0] / this.mText.length, size[1]);
};

FontRenderable.prototype.getWidth = function() {
  let size = this.getXform().getSize();
  return size[0];
};

FontRenderable.prototype.getFont = function () { return this.mFont; };

FontRenderable.prototype.setFont = function (f) {
    this.mFont = f;
    this.mOneChar.setTexture(this.mFont + ".png");
};

FontRenderable.prototype.setColor = function (c) { this.mOneChar.setColor(c); };

FontRenderable.prototype.getColor = function () { return this.mOneChar.getColor(); };

FontRenderable.prototype.update = function () {};



