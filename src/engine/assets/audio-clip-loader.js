"use strict";

engine.assetManager.registerLoader({

    supportedExtensions: [ ".wav", ".mp3", ],

    load: clipName => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if ((request.readyState === 4) && (request.status !== 200)) {
                    reject(`audio-clip-loader: Loading ${clipName} failed with request.readyState ${request.readyState} and request.status ${request.status}`);
                }
            };
            request.open('GET', clipName, true);
            request.responseType = 'arraybuffer';

            request.onload = () => {
                _AudioContext.decodeAudioData(request.response, buffer => {
                    resolve(buffer);
                });
            };
            request.send();
        })
    },

});    