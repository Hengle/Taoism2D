"use strict";
function UIElement(position, size) {
    this.mVisible = true;
    
    this.mUIXform = new Transform();
    if(position !== null)
        this.mUIXform.setPosition(position[0], position[1]);
    if(size !== null)
        this.mUIXform.setSize(size[0], size[1]);
};

UIElement.prototype.getUIXform = function() {
    return this.mUIXform;
};

UIElement.prototype.getUIBBox = function () {
    let xform = this.getUIXform();
    let b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    return b;
};

UIElement.prototype.draw = function(aCamera) {
};

UIElement.prototype.update = function() {
};

UIElement.prototype.setVisible = function(visible) {
    this.mVisible = visible;
};
