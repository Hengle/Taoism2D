"use strict";

engine.core.loop = (function () {
    let _FPS = 60;                   // Frame per second
    let _MPF = 1000 / _FPS;                   // Milliseconds per frame, used as max interval of each update, is setted by FPS.
    let _isRunning = false;

    let _previousTime = Date.now();
    let _lagTime = 0;

    const _runLoop = scene => {
        if (_isRunning) {
            requestAnimationFrame(() => {
                _runLoop(scene);
            });

            const currentTime = Date.now();
            const elapsedTime = currentTime - _previousTime;
            _previousTime = currentTime;
            _lagTime += elapsedTime;

            while ((_lagTime >= _MPF) && _isRunning) {
                engine.input.update();
                scene.update(_MPF);
                _lagTime -= _MPF;
            }
            scene.draw();    
        } else {
            scene.unloadScene();
        }
    };

    const start = scene => {
        _isRunning = true;

        _previousTime = Date.now();
        _lagTime = 0.0;
        requestAnimationFrame(() => { 
            _runLoop(scene); 
        });
    };

    const stop = function () {
        _isRunning = false;
    };

    return {
        get FPS() {
            return _FPS;         
        },
        set FPS(fps) {                          
            _FPS = fps;
            _MPF = 1000 / _FPS;
        },
        start,
        stop,

        getUpdateIntervalInSeconds() {
            return _MPF / 1000;
        }
    };
})();
