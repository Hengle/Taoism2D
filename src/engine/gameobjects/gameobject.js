"use strict";  

function GameObject(renderableObj) {
    this.mRenderComponent = renderableObj;
    this.mVisible = true;
    this.mCurrentFrontDir = vec2.fromValues(0, 1);  
    this.mRigidBody = null;
    this.mDrawRenderable = true;
    this.mDrawRigidShape = false; 
}

GameObject.prototype.getXform = function () { return this.mRenderComponent.getXform(); };

GameObject.prototype.getBBox = function () {
    let xform = this.getXform();
    let b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    return b;
};

GameObject.prototype.setVisibility = function (f) { this.mVisible = f; };

GameObject.prototype.isVisible = function () { return this.mVisible; };

GameObject.prototype.setCurrentFrontDir = function (f) { vec2.normalize(this.mCurrentFrontDir, f); };


GameObject.prototype.getCurrentFrontDir = function () { return this.mCurrentFrontDir; };

GameObject.prototype.getRenderable = function () { return this.mRenderComponent; };

GameObject.prototype.setRigidBody = function (r) {
    this.mRigidBody = r;
};
GameObject.prototype.getRigidBody = function () { return this.mRigidBody; };
GameObject.prototype.toggleDrawRenderable = function() { 
    this.mDrawRenderable = !this.mDrawRenderable; };
GameObject.prototype.toggleDrawRigidShape = function() { 
    this.mDrawRigidShape = !this.mDrawRigidShape; };

GameObject.prototype.update = function () {
    if (this.mRigidBody !== null)
            this.mRigidBody.update();
};

GameObject.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        if (this.mDrawRenderable)
            this.mRenderComponent.draw(aCamera);
        if ((this.mRigidBody !== null) && (this.mDrawRigidShape))
            this.mRigidBody.draw(aCamera);
    }
};
