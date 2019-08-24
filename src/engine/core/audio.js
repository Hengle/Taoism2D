"use strict";

engine.audio = (function () {
    let _audioContext = null;
    let _bgAudioNode = null;
    
    let _bgGainNode = null;         // background volume
    let _cueGainNode = null;        // cue/special effects volume
    let _masterGainNode = null;     // overall/master volume

    let _volumeMultiplier = 0.05;   // map 0-100 to 0-0.5

    const init = () => {
        try {
            const audioContext = window.audioContext || window.webkitaudioContext;
            _audioContext = new audioContext();

            _masterGainNode = _audioContext.createGain();
            _masterGainNode.connect(_audioContext.destination);
            _masterGainNode.gain.value = 0.5;
            
            _bgGainNode = _audioContext.createGain();
            _bgGainNode.connect(_masterGainNode);
            _bgGainNode.gain.value = 0.5;
            
            _CueGainNode = _audioContext.createGain();
            _CueGainNode.connect(_masterGainNode);
            _CueGainNode.gain.value = 0.5;
        } catch (e) {alert("Web Audio Is not supported."); }
    };

    //  Play an audioclip one time. no loop
    const playACue = function (clipName, volume) {
        const clipInfo = engine.ResourceMap.retrieveAsset(clipName);
        if (clipInfo !== null) {
            // SourceNodes are one use only.
            const sourceNode = _audioContext.createBufferSource();
            sourceNode.buffer = clipInfo;
            sourceNode.start(0);
            
            // volume support for cue
            const gainNode = _audioContext.createGain();
            sourceNode.connect(gainNode);
            gainNode.connect(mCueGainNode);
            gainNode.gain.value = volume * mVolumeMultiplier;
        }
    };

    // Stops current background clip if playing and play the audioclip repeatly as new background clip.
    const playBackgroundAudio = function (clipName) {
        const clipInfo = engine.assetManager.reference(clipName);
        if (clipInfo !== null) {
            stopBackgroundAudio();

            _bgAudioNode = _audioContext.createBufferSource();
            _bgAudioNode.buffer = clipInfo;
            _bgAudioNode.loop = true;
            _bgAudioNode.start(0);
            
            _bgAudioNode.connect(_bgGainNode);
        }
    };
    
    const setBackgroundVolume = volume => {
        if(_bgGainNode !== null) {
            _bgGainNode.gain.value = (volume * _volumeMultiplier);
        }
    };
    
    const incBackgroundVolume = function (increment) {
        if(_bgGainNode !== null) {
            _bgGainNode.gain.value += (increment * _volumeMultiplier);
            
            if(_bgGainNode.gain.value < 0) {
                setBackgroundVolume(0);
            }
        }
    };

    const setMasterVolume = function (volume) {
        if(_masterGainNode !== null) {
            _masterGainNode.gain.value = (volume * _volumeMultiplier);
        }
    };
    

    const incMasterVolume = function (increment) {
        if(_masterGainNode !== null) {
            _masterGainNode.gain.value += (increment * _volumeMultiplier);
            
            if(_masterGainNode.gain.value < 0) {
                _masterGainNode.gain.value = 0;
            }
        }
    };
    
    const setCueVolume = function (volume) {
        if(_cueGainNode !== null) {
            _cueGainNode.gain.value = (volume * _volumeMultiplier);
        }
    };

    const stopBackgroundAudio = function () {
        if (_bgAudioNode != null) {
            _bgAudioNode.stop(0);
            _bgAudioNode = null;
        }
    };

    const isBackgroundAudioPlaying = () => mbgAudioNode !== null;

    return {
        init,
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
}());