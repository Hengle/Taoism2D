"use strict";  

engine.core = (function () {

    const init = (htmlCanvasID, myGame) => {
        let canvas;

        if (htmlCanvasID != undefined) {
            canvas = document.getElementById(htmlCanvasID);
            if (canvas == null) {
                throw new Error(`Cannot find a canvas element named: ${htmlCanvasID}`);
            }
        } else {
            canvas = document.createElement("canvas");
            document.body.appendChild(canvas);
            console.log(`The engine automatically create a canvas for you: ${canvas}`);
        }
        engine.graphics.init(canvas);
        engine.vertexBuffer.init();
        engine.input.init(canvas);
        engine.audioClips.init();
        // engine.Physics.init();
        engine.layerManager.init();

        // Inits DefaultResources, when done, invoke the anonymous function to call startScene(myGame).
        engine.defaultResources.init(function () { startScene(myGame); });

    };

    function startScene(scene) {
        engine.LoadingIconConfig.start();
        scene.loadScene();
        engine.LoadingIconConfig.loadCountSet();
        engine.ResourceMap.setLoadCompleteCallback(() => {
                engine.LoadingIconConfig.stop();
                scene.initialize();
                engine.core.loop.start(scene);
            }
        );
    };


    const inheritPrototype = function (subClass, superClass) {
        let prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    // Detaches and removes the resources from the DefaultResources Program
    const cleanUp = function () {
        engine.defaultResources.cleanUp();
        engine.vertexBuffer.cleanUp();
    };

    return {
        init,
        inheritPrototype,
        startScene,
        cleanUp,
    };
}());