"use strict";  
engine.ResourceMap = (function () {
    
    let MapEntry = function (rName) {
        this.mAsset = rName;
        this.mRefCount = 1;
    };

    let mNumOutstandingLoads = 0;

    let mLoadCompleteCallback = null;

    let mResourceMap = {};

    let asyncLoadRequested = function (rName) {
        mResourceMap[rName] = new MapEntry(rName); 
        ++mNumOutstandingLoads;
    };

    let asyncLoadCompleted = function (rName, loadedAsset) {
        if (!isAssetLoaded(rName)) {
            alert("engine.asyncLoadCompleted: [" + rName + "] not in map!");
        }
        mResourceMap[rName].mAsset = loadedAsset;
        --mNumOutstandingLoads;
        if(engine.LoadingIconConfig.isLevelSet()){
            engine.LoadingIconConfig.loadingUpdate();
        }
        _checkForAllLoadCompleted();
    };

    let _checkForAllLoadCompleted = function () {
        if ((mNumOutstandingLoads === 0) && (mLoadCompleteCallback !== null)) {
            let funToCall = mLoadCompleteCallback;
            mLoadCompleteCallback = null;
            funToCall();
        }
    };

    let setLoadCompleteCallback = function (funct) {
        mLoadCompleteCallback = funct;
        _checkForAllLoadCompleted();
    };

    
    let retrieveAsset = function (rName) {
        let r = null;
        if (rName in mResourceMap) {
            r = mResourceMap[rName].mAsset;
        } else {
            alert("engine.retrieveAsset: [" + rName + "] not in map!");
        }
        return r;
    };

    let isAssetLoaded = function (rName) {
        return (rName in mResourceMap);
    };

    let incAssetRefCount = function (rName) {
        mResourceMap[rName].mRefCount += 1;
    };

    let unloadAsset = function (rName) {
        let c = 0;
        if (rName in mResourceMap) {
            mResourceMap[rName].mRefCount -= 1;
            c = mResourceMap[rName].mRefCount;
            if (c === 0) {
                delete mResourceMap[rName];
            }
        }
        return c;
    };
    
    let getNumOutstandingLoads = function() {
        return mNumOutstandingLoads;
    };


    let mPublic = {
        asyncLoadRequested,
        asyncLoadCompleted,
        setLoadCompleteCallback,
        retrieveAsset,
        unloadAsset,
        isAssetLoaded,
        incAssetRefCount,
        getNumOutstandingLoads
    };
    return mPublic;
}());
