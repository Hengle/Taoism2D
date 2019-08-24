function UITexture(myTexture, position, size) {
    UIRenderable.call(this, [1, 1, 1, 0], position, size);
    this.mRenderable = new TextureRenderable(myTexture);
    this.mRenderable._setShader(engine.defaultResources.getUnlitTextureShader());
    this.mRenderable.getXform().setZPos(3);
}
engine.core.inheritPrototype(UITexture, UIRenderable);

UITexture.prototype.setTexture = function (tex) {
    this.mRenderable.setTexture(tex);
};
