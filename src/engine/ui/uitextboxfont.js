function UITextBoxFont(aString){
    FontRenderable.call(this, aString);
}

engine.core.inheritPrototype(UITextBoxFont, FontRenderable);

UITextBoxFont.prototype.draw = function(aCamera, startPos){
    let widthOfOneChar = this.mXform.getWidth() / this.mText.length;
    let heightOfOneChar = this.mXform.getHeight();
    let yPos = this.mXform.getYPos();
    let start;
    start=startPos/widthOfOneChar;
    let value = (startPos%widthOfOneChar)/widthOfOneChar;
    
    let xPos = this.mXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
    let charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
    for (charIndex = start; charIndex < this.mText.length; charIndex++) {
        aChar = this.mText.charCodeAt(charIndex);
        charInfo = engine.Fonts.getCharInfo(this.mFont, aChar);

        this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft, charInfo.mTexCoordRight,
            charInfo.mTexCoordBottom, charInfo.mTexCoordTop);
        if(charIndex===start&&value!==0){
            let split = charInfo.mTexCoordRight-charInfo.mTexCoordLeft;
            this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft+(split*value), charInfo.mTexCoordRight,
            charInfo.mTexCoordBottom, charInfo.mTexCoordTop);
        }

        xSize = widthOfOneChar * charInfo.mCharWidth;
        ySize = heightOfOneChar * charInfo.mCharHeight;
        if(charIndex===start&&value!==0){xSize = widthOfOneChar * charInfo.mCharWidth*(1-value);}
        this.mOneChar.getXform().setSize(xSize, ySize);

        xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
        yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;
        if(charIndex===start&&value!==0){xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5-(value);}
        if(charIndex===start&&value!==0){xPos=this.mXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5)-((widthOfOneChar/2)*value);}
        this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);
        this.mOneChar.getXform().setZPos(this.mXform.getZPos());
        this.mOneChar.draw(aCamera);
        xPos += widthOfOneChar;
        widthOfOneChar = this.mXform.getWidth() / this.mText.length;
    }
};
