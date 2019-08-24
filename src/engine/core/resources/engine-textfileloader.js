"use strict";  
engine.TextFileLoader = (function () {
    let eTextFileType = Object.freeze({
        eXMLFile: 0,
        eTextFile: 1
    });

    let loadTextFile = function (fileName, fileType, callbackFunction) {
        if (!(engine.ResourceMap.isAssetLoaded(fileName))) {
            engine.ResourceMap.asyncLoadRequested(fileName);

            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(fileName + ": loading failed! [Hint: you cannot double click index.html to run this project. " +
                        "The index.html file must be loaded by a web-server.]");
                }
            };
            req.open('GET', fileName, true);
            req.setRequestHeader('Content-Type', 'text/xml');

            req.onload = function () {
                let fileContent = null;
                if (fileType === eTextFileType.eXMLFile) {
                    let parser = new DOMParser();
                    fileContent = parser.parseFromString(req.responseText, "text/xml");
                } else {
                    fileContent = req.responseText;
                }
                engine.ResourceMap.asyncLoadCompleted(fileName, fileContent);
                if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                    callbackFunction(fileName);
                }
            };
            req.send();
        } else {
            engine.ResourceMap.incAssetRefCount(fileName);
            if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                callbackFunction(fileName);
            }
        }
    };

    let unloadTextFile = function (fileName) {
        engine.ResourceMap.unloadAsset(fileName);
    };

    let mPublic = {
        loadTextFile,
        unloadTextFile,
        eTextFileType
    };
    return mPublic;
}());
