"use strict";  

function TiledGameObject(renderableObj) {
    this.mShouldTile = true;  
    GameObject.call(this, renderableObj);
}
engine.core.inheritPrototype(TiledGameObject, GameObject);

TiledGameObject.prototype.setIsTiled = function (t) {
    this.mShouldTile = t;
};

TiledGameObject.prototype.shouldTile = function () {
    return this.mShouldTile;
};

TiledGameObject.prototype._drawTile = function(aCamera) {
    let xf = this.getXform();
    let w = xf.getWidth();
    let h = xf.getHeight();
    let pos = xf.getPosition();
    let left = pos[0] - (w/2);
    let right = left + w;
    let top = pos[1] + (h/2);
    let bottom = top - h;
    
    let wcPos = aCamera.getWCCenter();
    let wcLeft = wcPos[0] - (aCamera.getWCWidth() / 2);
    let wcRight = wcLeft + aCamera.getWCWidth();
    let wcBottom = wcPos[1] - (aCamera.getWCHeight() / 2);
    let wcTop = wcBottom + aCamera.getWCHeight();
    
    let dx = 0, dy = 0; 
    if (right < wcLeft) { 
        dx = Math.ceil((wcLeft - right)/w) * w;
    } else {
        if (left > wcLeft) { 
            dx = -Math.ceil((left-wcLeft)/w) * w;
        }
    }
    if (top < wcBottom) { 
        dy = Math.ceil((wcBottom - top)/h) * h;
    } else {
        if (bottom > wcBottom) {  
            dy = -Math.ceil((bottom - wcBottom)/h) * h;
        }
    }
    
    let sX = pos[0];
    let sY = pos[1];
    
    xf.incXPosBy(dx);
    xf.incYPosBy(dy);
    right = pos[0] + (w/2);
    top = pos[1] + (h/2);
    
    let nx = 1, ny = 1; 
    nx = Math.ceil((wcRight - right) / w);
    ny = Math.ceil((wcTop - top) / h);
    
    let cx = nx;
    let xPos = pos[0];
    while (ny >= 0) {
        cx = nx;
        pos[0] = xPos;
        while (cx >= 0) {
            this.mRenderComponent.draw(aCamera);
            xf.incXPosBy(w);
            --cx;
        }
        xf.incYPosBy(h);
        --ny;
    }
    
    pos[0] = sX;
    pos[1] = sY;
};

TiledGameObject.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        if (this.shouldTile()) {
            this._drawTile(aCamera);
        } else {
            this.mRenderComponent.draw(aCamera);  
        }
    }
};
