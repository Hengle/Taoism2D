"use strict";

RigidRectangle.prototype.checkCircRecVertex = function(v, circPt, r, info) {
    
    let dis = vec2.length(v);
    
    if (dis > r)
        return false;
    let radiusVec = [0, 0];
    let ptAtCirc = [0, 0];
    vec2.scale(v, v, 1/dis); 
    vec2.scale(radiusVec, v, -r);
    vec2.add(ptAtCirc, circPt, radiusVec);
    info.setInfo(r - dis, v, ptAtCirc);
    return true;
};

RigidRectangle.prototype.collideRectCirc = function (otherCir, collisionInfo) {
    let outside = false;
    let bestDistance = -Number.MAX_VALUE;
    let nearestEdge = 0; 
    let vToC = [0, 0];
    let circ2Pos = [0, 0], projection;
    let i = 0;
    while ((!outside) && (i<4)) {
        
        circ2Pos = otherCir.getCenter();
        vec2.subtract(vToC, circ2Pos, this.mVertex[i]);
        projection = vec2.dot(vToC, this.mFaceNormal[i]);
        if (projection > bestDistance) {
            outside = (projection > 0); 
            bestDistance = projection;
            nearestEdge = i;
        }
        i++;
    }
    let dis;
    let radiusVec = [0, 0];
    let ptAtCirc = [0, 0];
    
    if (!outside) { 
        
        vec2.scale(radiusVec, this.mFaceNormal[nearestEdge], otherCir.mRadius);
        dis = otherCir.mRadius - bestDistance; 
        vec2.subtract(ptAtCirc, circ2Pos, radiusVec);
        collisionInfo.setInfo(dis, this.mFaceNormal[nearestEdge], ptAtCirc);
        return true;
    }
    
    

    
    
    let v1 = [0, 0], v2 = [0, 0];
    vec2.subtract(v1, circ2Pos, this.mVertex[nearestEdge]);
    vec2.subtract(v2, this.mVertex[(nearestEdge + 1) % 4], this.mVertex[nearestEdge]);
    let dot = vec2.dot(v1, v2);

    if (dot < 0) {
        return this.checkCircRecVertex(v1, circ2Pos, otherCir.mRadius, collisionInfo);
    } else {
        
        
        
        
        vec2.subtract(v1, circ2Pos, this.mVertex[(nearestEdge + 1) % 4]);
        vec2.scale(v2, v2, -1);
        dot = vec2.dot(v1, v2); 
        if (dot < 0) {
            return this.checkCircRecVertex(v1, circ2Pos, otherCir.mRadius, collisionInfo);
        } else {
            
            if (bestDistance < otherCir.mRadius) {
                vec2.scale(radiusVec, this.mFaceNormal[nearestEdge], otherCir.mRadius);
                dis = otherCir.mRadius - bestDistance;
                vec2.subtract(ptAtCirc, circ2Pos, radiusVec);
                collisionInfo.setInfo(dis, this.mFaceNormal[nearestEdge], ptAtCirc);
                return true;
            } else {
                return false;
            }
        }
    }
    return true;
};
