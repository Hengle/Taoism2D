"use strict"

engine.assetManager.registerLoader({

    supportedExtensions: [ ".xml", ],

    load: name =>
        fetch(name)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => (new window.DOMParser()).parseFromString(text, "text/xml"))
            .catch(err => {
                console.error(err);
            }),
});

