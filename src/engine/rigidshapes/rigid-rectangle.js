"use strict";

let RigidRectangle = function (xf, width, height) {
    RigidShape.call(this, xf);
    this.mType = "RigidRectangle";
    this.mWidth = width;
    this.mHeight = height;
    this.mBoundRadius = Math.sqrt(width * width + height * height) / 2;
    this.mVertex = [];
    this.mFaceNormal = [];
    
    this.setVertices();
    this.computeFaceNormals();
    
    this.updateInertia();
};
engine.core.inheritPrototype(RigidRectangle, RigidShape);

RigidRectangle.prototype.updateInertia = function () {
    if (this.mInvMass === 0) {
        this.mInertia = 0;
    } else {
        
        this.mInertia = (1 / this.mInvMass) * (this.mWidth * this.mWidth + this.mHeight * this.mHeight) / 12;
        this.mInertia = 1 / this.mInertia;
    }
};

RigidRectangle.prototype.incShapeSizeBy= function (dt) {
    this.mHeight += dt;
    this.mWidth += dt;
};

RigidRectangle.prototype.adjustPositionBy = function(v, delta) {
    RigidShape.prototype.adjustPositionBy.call(this, v, delta);
    this.setVertices();
    this.rotateVertices();
};

RigidRectangle.prototype.setVertices = function () {
    let center = this.mXform.getPosition();
    let hw = this.mWidth / 2;
    let hh = this.mHeight / 2;
    
    this.mVertex[0] = vec2.fromValues(center[0] - hw, center[1] - hh);
    this.mVertex[1] = vec2.fromValues(center[0] + hw, center[1] - hh);
    this.mVertex[2] = vec2.fromValues(center[0] + hw, center[1] + hh);
    this.mVertex[3] = vec2.fromValues(center[0] - hw, center[1] + hh);    
};

RigidRectangle.prototype.computeFaceNormals = function () {
    
    
    for (let i = 0; i<4; i++) {
        let v = (i+1) % 4;
        let nv = (i+2) % 4;
        this.mFaceNormal[i] = vec2.clone(this.mVertex[v]);
        vec2.subtract(this.mFaceNormal[i], this.mFaceNormal[i], this.mVertex[nv]);
        vec2.normalize(this.mFaceNormal[i], this.mFaceNormal[i]);
    }
};

RigidRectangle.prototype.rotateVertices = function () {
    let center = this.mXform.getPosition();
    let r = this.mXform.getRotationInRad();
    for (let i = 0; i<4; i++) {
        vec2.rotateWRT(this.mVertex[i], this.mVertex[i], r, center);
    }
    this.computeFaceNormals();
};

RigidRectangle.prototype.drawAnEdge = function (i1, i2, aCamera) {
    this.mLine.setFirstVertex(this.mVertex[i1][0], this.mVertex[i1][1]);  
    this.mLine.setSecondVertex(this.mVertex[i2][0], this.mVertex[i2][1]); 
    this.mLine.draw(aCamera);
};

RigidRectangle.prototype.draw = function (aCamera) {
    RigidShape.prototype.draw.call(this, aCamera);
    this.mLine.setColor([0, 0, 0, 1]);
    let i = 0;
    for (i=0; i<4; i++) {
        this.drawAnEdge(i, (i+1)%4, aCamera);
    }
    
    if (this.mDrawBounds) {
        this.mLine.setColor([1, 1, 1, 1]);
        this.drawCircle(aCamera, this.mBoundRadius);
    }
};

RigidRectangle.prototype.update = function () {
    RigidShape.prototype.update.call(this);
    this.setVertices();
    this.rotateVertices();
};
