"use strict";

RigidRectangle.prototype.collisionTest = function (otherShape, collisionInfo) {
    let status = false;
    if (otherShape.mType === "RigidCircle") {
        status = this.collideRectCirc(otherShape, collisionInfo);
    } else {
        status = this.collideRectRect(this, otherShape, collisionInfo);
    }
    return status;
};

let SupportStruct = function () {
    this.mSupportPoint = null;
    this.mSupportPointDist = 0;
};
let tmpSupport = new SupportStruct();
RigidRectangle.prototype.findSupportPoint = function (dir, ptOnEdge) {
    
    let vToEdge = [0, 0];
    let projection;

    tmpSupport.mSupportPointDist = -Number.MAX_VALUE;
    tmpSupport.mSupportPoint = null;
    
    for (let i = 0; i < this.mVertex.length; i++) {
        vec2.subtract(vToEdge, this.mVertex[i], ptOnEdge);
        projection = vec2.dot(vToEdge, dir);
        
        
        
        if ((projection > 0) && (projection > tmpSupport.mSupportPointDist)) {
            tmpSupport.mSupportPoint = this.mVertex[i];
            tmpSupport.mSupportPointDist = projection;
        }
    }
};

RigidRectangle.prototype.findAxisLeastPenetration = function (otherRect, collisionInfo) {

    let n;
    let supportPoint;

    let bestDistance = Number.MAX_VALUE;
    let bestIndex = null;

    let hasSupport = true;
    let i = 0;

    let dir = [0, 0];
    while ((hasSupport) && (i < this.mFaceNormal.length)) {
        n = this.mFaceNormal[i];

        vec2.scale(dir, n, -1);
        let ptOnEdge = this.mVertex[i];
        otherRect.findSupportPoint(dir, ptOnEdge);
        hasSupport = (tmpSupport.mSupportPoint !== null);
        
        
        if ((hasSupport) && (tmpSupport.mSupportPointDist < bestDistance)) {
            bestDistance = tmpSupport.mSupportPointDist;
            bestIndex = i;
            supportPoint = tmpSupport.mSupportPoint;
        }
        i = i + 1;
    }
    if (hasSupport) {
        
        let bestVec = [0, 0];
        vec2.scale(bestVec, this.mFaceNormal[bestIndex], bestDistance);
        let atPos = [0, 0];
        vec2.add(atPos, supportPoint, bestVec);
        collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], atPos);
    }
    return hasSupport;
};
let collisionInfoR1 = new CollisionInfo();
let collisionInfoR2 = new CollisionInfo();
RigidRectangle.prototype.collideRectRect = function (r1, r2, collisionInfo) {
    let status1 = false;
    let status2 = false;

    
    status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);

    if (status1) {
        status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);
        if (status2) {
            let depthVec = [0, 0];
            
            if (collisionInfoR1.getDepth() < collisionInfoR2.getDepth()) {
                vec2.scale(depthVec, collisionInfoR1.getNormal(), collisionInfoR1.getDepth());
                let pos = [0, 0];
                vec2.subtract(pos, collisionInfoR1.mStart, depthVec);
                collisionInfo.setInfo(collisionInfoR1.getDepth(), collisionInfoR1.getNormal(), pos);
            } else {
                vec2.scale(depthVec, collisionInfoR2.getNormal(), -1);
                collisionInfo.setInfo(collisionInfoR2.getDepth(), depthVec, collisionInfoR2.mStart);
            }
        } 
    }
    return status1 && status2;
};
