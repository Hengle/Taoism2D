"use strict";
function UISprite(sprite, position, size, uvPos) {
    UITexture.call(this, sprite, position, size);
    this.mRenderable = new SpriteRenderable(sprite);
    this.mRenderable._setShader(engine.defaultResources.getUnlitSpriteShader());
    if(uvPos !== null) {
        this.mRenderable.setElementUVCoordinate(uvPos[0], uvPos[1], uvPos[2], uvPos[3]);
    }
    this.mRenderable.getXform().setZPos(3);
}
engine.core.inheritPrototype(UISprite, UITexture);

UISprite.prototype.setElementPixelPositions = function(left, right, bottom, top) {
  this.mRenderable.setElementPixelPositions(left, right, bottom, top);  
};

UISprite.prototype.setElementUVCoordinate = function(left, right, bottom, top) {
  this.mRenderable.setElementUVCoordinate(left, right, bottom, top);  
};
