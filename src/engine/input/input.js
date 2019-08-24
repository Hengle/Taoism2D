"use strict";  

engine.input = {
    init: canvas => {
        engine.keyboard.init(canvas);
        engine.mouse.init(canvas);
    },
    
    update: () => {
        engine.keyboard.update();
        engine.mouse.update();

    }
}