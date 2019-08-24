"use strict"
engine.mouse = (function () {
    let _canvas = null;
    const _isPressedPrevious = [];
    const _isPressed = [];
    const _wasPressed = [];
    const _wasReleased = [];
    const _position = {
        x: -1,
        y: -1,
    }
    // register event callbacks
    const _on = {
        mousedown: null,
        mouseup: null,
        mousemove: null,
    };

    const _updatePosition = event => {
        let inside = false;
        const canvasClientRect = _canvas.getBoundingClientRect();
        const x = Math.round((event.clientX - canvasClientRect.left) * (_canvas.width / canvasClientRect.width));
        const y = Math.round((event.clientY - canvasClientRect.top) * (_canvas.height / canvasClientRect.height));

        if ((x >= 0) && (x < _canvas.width) &&
            (y >= 0) && (y < _canvas.height)) {
            _position.x = x;
            _position.y = _canvas.height - 1 - y;
            inside = true;
        }
        return inside;
    };

    const init = canvas => {
        _canvas = canvas;

        window.addEventListener('mousedown', event => {
            _on.mousedown && _on.mousedown(event);

            if (_updatePosition(event)) {
                _isPressed[event.button] = true;
            }

            event.preventDefault();
        });

        window.addEventListener('mouseup', event => {
            _on.mouseup && _on.mouseup(event);

            _updatePosition(event);
            _isPressed[event.button] = false;

            event.preventDefault();
        });

        window.addEventListener('mousemove', event => {
            _on.mousemove && _on.mousemove(event);

            _updatePosition(event);

            event.preventDefault();
        });
    };

    const update = () => {
        for (let button = 0; button < 3; button++) {
            _wasPressed[button] = (!_isPressedPrevious[button]) && _isPressed[button];
            _wasReleased[button] = _isPressedPrevious[button] && (!_isPressed[button]);
            _isPressedPrevious[button] = _isPressed[button];
        }
    }

    const on = (eventName, callback) => {
        if (!_on.hasOwnProperty(eventName)) {
            console.error(`Type Error: engine.mouse.on: The event name ${eventName} provided as parameter 1 is not a valid event name in ${$Object.keys(_on)}`);
        }
        if (typeof callback != "function") {
            console.error(`Type Error: engine.mouse.on: The callback ${callback} provided as parameter 2 is not a function`);
        }
        _on[eventName] = callback;
    }

    const position = {
        get x() {
            return _position.x;
        },
        get y() {
            return _position.y;
        }
    };

    return {
        init,
        update,
        position,

        on,
        isPressed: (button => _isPressed[button]),
        wasPressed: (button => _wasPressed[button]),
        wasReleased: (button => _wasReleased[button]),
    };
})();