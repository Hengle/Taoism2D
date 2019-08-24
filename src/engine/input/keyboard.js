"use strict";  // Operate in Strict mode such that constiables must be declared before used!

engine.keyboard = (function () {
    const _isPressedPrevious = Object.create(null);
    const _isPressed = Object.create(null);
    const _wasPressed = Object.create(null);
    const _wasReleased = Object.create(null);
    // register event callbacks
    const _on = {
        keydown: null,
        keyup: null, }; const init = () => {
            window.addEventListener('keydown', event => {
            _on.keydown && _on.keydown(event);
            _isPressed[event.key] = true;
            event.preventDefault();
        });
        window.addEventListener('keyup', event => {
            _on.keyup && _on.keyup(event);
            _isPressed[event.key] = false;
            event.preventDefault();
        });
    };

    const update = () => {
        for (let key in _isPressed) {
            _wasPressed[key] = !_isPressedPrevious[key] && _isPressed[key];
            _wasReleased[key] = _isPressedPrevious[key] && !_isPressed[key];
            _isPressedPrevious[key] = _isPressed[key];
        }
    };

    const on = (eventName, callback) => {
        if (! _on.hasOwnProperty(eventName)) {
            console.error(`Type Error: engine.keyboard.on: The event name ${eventName} provided as parameter 1 is not a valid event name in ${$Object.keys(_on)}`);
        }
        if (typeof callback != "function") {
            console.error(`Type Error: engine.keyboard.on: The callback ${callback} provided as parameter 2 is not a function`);
        }
        _on[eventName] = callback;
    }

    return {
        init,
        update,

        on,
        isPressed: (key => _isPressed[key]),
        wasPressed: (key => _wasPressed[key]),
        wasReleased: (key => _wasReleased[key]),
        get wasPressedKeys() {
            const keys = Object.keys(_wasPressed);
            return keys.filter(key => _wasPressed[key] == true);
        },
    };
}());

