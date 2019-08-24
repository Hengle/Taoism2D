// Jump to the end of the file to see the interface of asset-manager.

"use strict";

engine.assetManager = (function () {
    const _assetCaches = Object.create(null);    // A map of asset name to cache infomation
    const _loaders = [];                         // Assets are loaded by loaders 
    let _totalLoading = 0;
    let _numLoaded = 0;
    let _allLoaedCallback = null;
    let _loadedCallbacks = [];

    // (name: string, dereference: function(name: string): void) => { name: string, loaded: boolean, cache: any, refCount: number, dereference: function(name: string): void }
    const _createCacheInfo = (name, unload) =>
        ({
            name,
            unload,                              // The function applied by the loader to realease resource (e.g. Unloading corresponding texture in GPU)
            refCount: 0,
            cache: null,
        });

    const _checkForAllLoaded = () => {
        if (_numLoaded == _totalLoading && _allLoaedCallback) {
            _numLoaded = _totalLoading = 0;

            const callback = _allLoaedCallback;
            _allLoaedCallback = null;
            callback();
        }

    }

    const onAllLoaded = callback => {
        if (typeof callback != "function") {
            console.error(`Type Error: Failed to execute onAllLoaded on engine.assetManager: The callback "${callback}" provided as parameter is not a function`);
        } else {
            _allLoaedCallback = callback;
            _checkForAllLoaded();
        }
    }

    const onLoaded = callback => {
        if (typeof callback != "function") {
            console.error(`Type Error: Failed to execute onLoaded on engine.assetManager: The callback "${callback}" provided as parameter is not a function`);
        } else {
            _loadedCallbacks.push(callback);
        }
    }

    // loader: { supportedExtensions: [ extension: string ], load: function(name: string): promise, dereference?: function(name: string) void, } => void
    const registerLoader = (loader = {}) => {
        const { supportedExtensions, load, unload, } = loader;
        if (!Array.isArray(supportedExtensions) || typeof load != "function" || !(unload == null || typeof unload == "function")) {
            console.error(`Type Error: Failed to execute registerLoader on engine.assetManager: The loader "${loader}" provided as parameter does not implement the interface "{ supportedExtensions: string[], load(name: string): promise, unload?(name: string): void }"`);
        } else {
            _loaders.push(loader);
        }
    };

    // assets: [ string ] / string => promise
    const load = assetNames => {
        if (_assetCaches[name] != undefined) return;

        const splitted = String.prototype.split.call(name, '.');
        if (splitted.length == 0) {
            console.warn(`engine.assetManager.load: Failed to load asset "${name}": It has no extension to specify a loader`);
            return;
        }

        const extension = splitted.pop().toLowerCase();
        const loader = _loaders.find(loader => loader.supportedExtensions.includes(extension));
        if (loader == undefined) {
            console.error(`engine.assetManager.load: Failed to load asset "${name}" with extension "${extension}": There is no loader associated with it.`);
            return;
        }

        _totalLoading += 1;
        const dereference = loader.unload ? loader.unload.bind(loader) : undefined;
        _assetCaches[name] = _createCacheInfo(name, unload);
        loader.load(name)
            .then(asset => {
                _numLoaded += 1;
                _assetCaches[name].cache = asset;
                _checkForAllLoaded();
                _loadedCallbacks.forEach((callback, i, callbacks) => {
                    if (callback() !== true) {
                        callbacks.splice(i, 1);
                    }
                });
            })
            .catch(err => {
                console.error(err);
            })
    };

    // name: string => boolean
    const isLoaded = name => {
        const cacheInfo = _assetCaches[name];

        if (cacheInfo == undefined) {
            return false;
        }
        return (cacheInfo.cache != null);
    };

    // name: string => object
    const reference = name => {
        const cacheInfo = _assetCaches[name];

        if (cacheInfo == null || cacheInfo.cache ==  null) {
            console.warn(`engine.assetManager.reference: Trying to reference asset ${name}, which is not even loaded. Don't worry, a new load request is sent, you're welcome !`);
            load(name);
            return null;
        }
        cacheInfo.refCount += 1;
        return cacheInfo.cache;
    };

    const dereference = name => {
        const cacheInfo = _assetCaches[name];
        if (cacheInfo == null || cacheInfo.cache ==  null) {
            console.warn(`engine.assetManager.dereference: Trying to dereference asset ${name}, which is not even loaded, Are you OK ?`);
            return;
        }
        cacheInfo.refCount -= 1;
        if (cacheInfo.refCount == 0) {
            cacheInfo.unload && cacheInfo.unload(name);
            delete _assetCaches[name];
        }
    }

    return {
        get totalLoading() { return _totalLoading; },                 // Read only. indicate loading process
        get numLoaded() { return _numLoaded; },                       // Read only. indicate loading process
        
        onAllLoaded,            // Rigister a callback, which will be called only once and removed when all assets are loaded, with that ${totalLoading} and ${numLoaded} will be reset to 0;
        onLoaded,               // Rigister a callback, which will be called when any asset is loaded, and if it's return value is not exactly ${true}, it will be removed.

        registerLoader,         // Assets are loaded by loaders with the interface { supportedExtensions: [ extension: string ], load: function(name: string): promise, dereference?: function(name: string) void, }
        load,                   // Asynchronously load
        isLoaded,               // As it's name implies

        reference,               // If loaded, return the asset cache, else return null. If succesfully referenced, remember to derefenrence  when no longer need to release resource.
        dereference,             // If none need the asset any more and all dereference it, the asset cache will be deleted.
    };
})();