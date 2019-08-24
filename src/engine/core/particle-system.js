"use strict";  
engine.ParticleSystem = (function () {
    let mSystemtAcceleration = [0, -50.0];
    
    let mFrom1to2 = [0, 0];
    let mCircleCollider = null; 
    
    let resolveCirclePos = function (circShape, particle) {
        let collided = false;
        let pos = particle.getPosition();
        let cPos = circShape.getCenter();
        vec2.subtract(mFrom1to2, pos, cPos);
        let dist = vec2.length(mFrom1to2);
        if (dist < circShape.getRadius()) {
            vec2.scale(mFrom1to2, mFrom1to2, 1/dist);
            vec2.scaleAndAdd(pos, cPos, mFrom1to2, circShape.getRadius());
            collided = true;
        }
        return collided;
    };
    
    let resolveRectPos = function (rectShape, xf) {
        if (mCircleCollider === null)
            mCircleCollider = new RigidCircle(null, 0.0);  
        mCircleCollider.setTransform(xf);
        if (mCircleCollider.boundTest(rectShape)) {
            let rPInfo = new CollisionInfo();
            if (rectShape.collisionTest(mCircleCollider, rPInfo)) {
                vec2.subtract(mFrom1to2, mCircleCollider.getCenter(), rectShape.getCenter());
                if (vec2.dot(mFrom1to2, rPInfo.getNormal()) < 0)
                    mCircleCollider.adjustPositionBy(rPInfo.getNormal(), -rPInfo.getDepth());
                else
                    mCircleCollider.adjustPositionBy(rPInfo.getNormal(), rPInfo.getDepth());
            }
        }
    };
    
    let processObjSet = function(obj, pSet) {
        let s1 = obj.getRigidBody();  
        let i, p;
        for (i=0; i<pSet.size(); i++) {
            let x = pSet.getObjectAt(i).getX();
            p = pSet.getObjectAt(i).getParticle();  
            s1.resolveParticleCollision(p,x);
        }
    };
    
    let collideWithRigidSet = function(objSet, pSet) {
        let i;
        for (i=0; i<objSet.size(); i++) {
            processObjSet(objSet.getObjectAt(i), pSet);
        }
    };
    
    let getSystemtAcceleration = function() { return mSystemtAcceleration; };
    
    let setSystemtAcceleration = function (g) { mSystemtAcceleration = g; };

    let update = function (pSet) {
        pSet.update();
    };

    let mPublic = {
        getSystemtAcceleration,
        setSystemtAcceleration,
        resolveCirclePos,
        resolveRectPos,
        processObjSet,
        collideWithRigidSet,
        update
    };

    return mPublic;
}());
