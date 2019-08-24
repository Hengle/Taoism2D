"use strict";  

engine.audioClips = (function () {
    let mAudioContext = null;
    let mBgAudioNode = null;
    
    let mBgGainNode = null;         
    let mCueGainNode = null;        
    let mMasterGainNode = null;     
    let mVolumeMultiplier = 0.05;   

    let init = function () {
        try {
            let AudioContext = window.AudioContext || window.webkitAudioContext;
            mAudioContext = new AudioContext();
            mMasterGainNode = mAudioContext.createGain();
            mMasterGainNode.connect(mAudioContext.destination);
            mMasterGainNode.gain.value = 0.5;
            
            mBgGainNode = mAudioContext.createGain();
            mBgGainNode.connect(mMasterGainNode);
            mBgGainNode.gain.value = 0.5;
            
            mCueGainNode = mAudioContext.createGain();
            mCueGainNode.connect(mMasterGainNode);
            mCueGainNode.gain.value = 0.5;
        } catch (err) {
            alert("Web Audio Is not supported."); 
        }
    };

    let loadAudio = function (clipName) {
        if (!(engine.ResourceMap.isAssetLoaded(clipName))) {
            engine.ResourceMap.asyncLoadRequested(clipName);

            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(clipName + ": loading failed! [Hint: you cannot double click index.html to run this project. " +
                        "The index.html file must be loaded by a web-server.]");
                }
            };
            req.open('GET', clipName, true);
            req.responseType = 'arraybuffer';

            req.onload = function () {
                mAudioContext.decodeAudioData(req.response,
                    function (buffer) {
                        engine.ResourceMap.asyncLoadCompleted(clipName, buffer);
                    }
                    );
            };
            req.send();
        } else {
            engine.ResourceMap.incAssetRefCount(clipName);
        }
    };

    let unloadAudio = function (clipName) {
        engine.ResourceMap.unloadAsset(clipName);
    };

    let playACue = function (clipName, volume) {
        let clipInfo = engine.ResourceMap.retrieveAsset(clipName);
        if (clipInfo !== null) {
            let sourceNode = mAudioContext.createBufferSource();
            sourceNode.buffer = clipInfo;
            sourceNode.start(0);
            
            let gainNode = mAudioContext.createGain();
            sourceNode.connect(gainNode);
            gainNode.connect(mCueGainNode);
            gainNode.gain.value = volume * mVolumeMultiplier;
        }
    };

    let playBackgroundAudio = function (clipName) {
        let clipInfo = engine.ResourceMap.retrieveAsset(clipName);
        if (clipInfo !== null) {
            stopBackgroundAudio();

            mBgAudioNode = mAudioContext.createBufferSource();
            mBgAudioNode.buffer = clipInfo;
            mBgAudioNode.loop = true;
            mBgAudioNode.start(0);
            
            mBgAudioNode.connect(mBgGainNode);
        }
    };
    
    let setBackgroundVolume = function (volume) {
        if(mBgGainNode !== null) {
            mBgGainNode.gain.value = (volume * mVolumeMultiplier);
        }
    };
    
    let incBackgroundVolume = function (increment) {
        if(mBgGainNode !== null) {
            mBgGainNode.gain.value += (increment * mVolumeMultiplier);
            
            if(mBgGainNode.gain.value < 0) {
                setBackgroundVolume(0);
            }
        }
    };
    
    let setMasterVolume = function (volume) {
        if(mMasterGainNode !== null) {
            mMasterGainNode.gain.value = (volume * mVolumeMultiplier);
        }
    };
    
    let incMasterVolume = function (increment) {
        if(mMasterGainNode !== null) {
            mMasterGainNode.gain.value += (increment * mVolumeMultiplier);
            
            if(mMasterGainNode.gain.value < 0) {
                mMasterGainNode.gain.value = 0;
            }
        }
    };
    
    let setCueVolume = function (volume) {
        if(mCueGainNode !== null) {
            mCueGainNode.gain.value = (volume * mVolumeMultiplier);
        }
    };

    let stopBackgroundAudio = function () {
        if (mBgAudioNode !== null) {
            mBgAudioNode.stop(0);
            mBgAudioNode = null;
        }
    };

    let isBackgroundAudioPlaying = function () {
        return (mBgAudioNode !== null);
    };

    let mPublic = {
        init,
        loadAudio,
        unloadAudio,
        playACue,
        playBackgroundAudio,
        setBackgroundVolume,
        incBackgroundVolume,
        setMasterVolume,
        incMasterVolume,
        setCueVolume,
        stopBackgroundAudio,
        isBackgroundAudioPlaying
    };
    return mPublic;
}());
