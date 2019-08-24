"use strict";  

engine.eLayer = Object.freeze({
    eBackground: 0,
    eShadowReceiver: 1,
    eActors: 2,
    eFront: 3,
    eHUD: 4
});

engine.layerManager = (function () {
    let kNumLayers = 5;
    
    let mAllLayers = [];
    
    let init = function() {
        mAllLayers[engine.eLayer.eBackground] = new GameObjectSet();
        mAllLayers[engine.eLayer.eShadowReceiver] = new GameObjectSet();
        mAllLayers[engine.eLayer.eActors] = new GameObjectSet();
        mAllLayers[engine.eLayer.eFront] = new GameObjectSet();
        mAllLayers[engine.eLayer.eHUD] = new GameObjectSet();
    };
    
    let cleanUp = function() {
        init();
    };
    
    let drawAllLayers = function(aCamera) {
        let i;
        for (i=0; i<kNumLayers; i++) {
            mAllLayers[i].draw(aCamera);
        }
    };
    
    let updateAllLayers = function() {
        let i;
        for (i=0; i<kNumLayers; i++) {
            mAllLayers[i].update();
        }
    };
    
    
    let drawLayer = function(layerEnum, aCamera) {
        mAllLayers[layerEnum].draw(aCamera);
    };
    
    let updateLayer = function(layerEnum) {
        mAllLayers[layerEnum].update();
    };
    
    let addToLayer = function(layerEnum, obj) {
        mAllLayers[layerEnum].addToSet(obj);
    };
    
    let addAsShadowCaster = function(obj) {
        let i;
        for (i = 0; i<mAllLayers[engine.eLayer.eShadowReceiver].size(); i++) {
            mAllLayers[engine.eLayer.eShadowReceiver].getObjectAt(i).addShadowCaster(obj);
        }
    };
    
    let removeFromLayer = function(layerEnum, obj) {
        mAllLayers[layerEnum].removeFromSet(obj);
    };
    
    let moveToLayerFront = function(layerEnum, obj) {
        mAllLayers[layerEnum].moveToLast(obj);
    };
    
    let layerSize = function (layerEnum) {
        return mAllLayers[layerEnum].size();
    };

    let mPublic = {
        init,
        drawAllLayers,
        updateAllLayers,
        cleanUp,

        drawLayer,
        updateLayer,
        addToLayer,
        addAsShadowCaster,
        removeFromLayer,
        moveToLayerFront,
        layerSize
    };

    return mPublic;
}());
