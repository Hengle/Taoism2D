function UIRenderable(color, position, size) {
    this.mRenderable = new Renderable();
    this.mRenderable._setShader(engine.defaultResources.getUnlitShader());
    this.mRenderable.setColor(color);
    this.mRenderable.getXform().setZPos(3);
    
    UIElement.call(this, position, size);
}
engine.core.inheritPrototype(UIRenderable, UIElement);

UIRenderable.prototype.draw = function (aCamera) {
    this._applyUIXform(this.mRenderable, aCamera);
    this.mRenderable.draw(aCamera);
};


UIRenderable.prototype._applyUIXform = function(renderable, aCamera) {
    let camPos = aCamera.getWCCenter();
    let rendXform = renderable.getXform();
    let WCPos = aCamera.VPpixelPosToWC(this.mUIXform.getPosition());
    let WCSize = aCamera.VPpixelSizeVec2ToWC(this.mUIXform.getSize());
    rendXform.setPosition(WCPos[0], WCPos[1]);
    rendXform.setSize(WCSize[0], WCSize[1]);
};

UIRenderable.prototype.setColor = function(c) {
    this.mRenderable.setColor(c);
};
