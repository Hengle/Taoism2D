"use strict"

engine.assetManager.registerLoader({

    supportedExtensions: [ ".txt", ".glsl", ],

    load: name =>
        fetch(name)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                return response.text();
            })
            .catch(err => {
                console.error(err);
            }),
});

