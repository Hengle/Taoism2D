"use strict";

engine.defaultResources = (function () {
    var mGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
    var mGlobalAmbientIntensity = 1;

    var getGlobalAmbientIntensity = function () { return mGlobalAmbientIntensity; };

    var setGlobalAmbientIntensity = function (v) { mGlobalAmbientIntensity = v; };

    var getGlobalAmbientColor = function () { return mGlobalAmbientColor; };

    var setGlobalAmbientColor = function (v) { mGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]); };
    var kUnlitFS = "src/glslshaders/unlitfs.glsl";
    var mUnlitShader = null;

    var kUnlitTextureFS = "src/glslshaders/unlittexturefs.glsl";
    var mUnlitTextureShader = null;
    var mUnlitSpriteShader = null;

    var kSimpleVS = "src/glslshaders/simplevs.glsl";
    var kSimpleFS = "src/glslshaders/simplefs.glsl";
    var mConstColorShader = null;

    var kTextureVS = "src/glslshaders/texturevs.glsl";
    var kTextureFS = "src/glslshaders/texturefs.glsl";
    var mTextureShader = null;
    var mSpriteShader = null;
    var kLineFS = "src/glslshaders/linefs.glsl";
    var mLineShader = null;

    var kLightFS = "src/glslshaders/lightfs.glsl";
    var mLightShader = null;

    var kIllumFS = "src/glslshaders/illumfs.glsl";
    var mIllumShader = null;

    var kShadowReceiverFS = "src/glslshaders/shadowreceiverfs.glsl";
    var mShadowReceiverShader = null;
    var kShadowCasterFS = "src/glslshaders/shadowcasterfs.glsl";
    var mShadowCasterShader = null;

    var kParticleFS = "src/glslshaders/particlefs.glsl";
    var mParticleShader = null;

    var kDefaultFont = "assets/fonts/system-default-font";
    var kParticleTexture = "assets/particlesystem/particle.png";
    var fireParticleTexture = "assets/particlesystem/flameparticle.png";
    var smokeParticleTexture = "assets/particlesystem/smokeparticle.png";
    var snowParticleTexture = "assets/particlesystem/snowparticle.png";
    var tinyParticleTexture = "assets/particlesystem/tiny.png";
    var dustParticleTexture = "assets/particlesystem/dust.png";
    var dust2ParticleTexture = "assets/particlesystem/dust2.png";
    var flareParticleTexture = "assets/particlesystem/flare.png";
    var shockParticleTexture = "assets/particlesystem/shock.png";
    var shock2ParticleTexture = "assets/particlesystem/shock2.png";
    var targetParticleTexture = "assets/fire/target.png";
    var sparkleParticleTexture = "assets/particlesystem/sparkle.png";
    var bubbleParticleTexture = "assets/particlesystem/bubble.png";

    var UIRadarButtonTexture = "assets/ui/radarbutton.png";
    var UIDropDownArrow = "assets/ui/ddarrow.png";
    var BarStencil = "assets/ui/barstencil.png";
    var VBarStencil = "assets/ui/vbarstencil.png";
    var SliderHandle = "assets/ui/sliderhandle.png";
    var VSliderHandle = "assets/ui/vsliderhandle.png";
    var SwitchToggleHandle = "assets/ui/switchtogglehandle.png";
    var SwitchToggleStencil = "assets/ui/switchtogglestencil.png";
    var ButtonStencil = "assets/ui/buttonstencil.png";

    var getDefaultFont = function () { return kDefaultFont; };

    var _createShaders = function (callBackFunction) {
        engine.ResourceMap.setLoadCompleteCallback(null);
        mUnlitShader = new UnlitShader(kSimpleVS, kUnlitFS);
        mUnlitTextureShader = new UnlitTextureShader(kTextureVS, kUnlitTextureFS);
        mUnlitSpriteShader = new UnlitSpriteShader(kTextureVS, kUnlitTextureFS);
        mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
        mTextureShader = new TextureShader(kTextureVS, kTextureFS);
        mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
        mLineShader = new LineShader(kSimpleVS, kLineFS);
        mLightShader = new LightShader(kTextureVS, kLightFS);
        mIllumShader = new IllumShader(kTextureVS, kIllumFS);
        mShadowReceiverShader = new SpriteShader(kTextureVS, kShadowReceiverFS);
        mShadowCasterShader = new ShadowCasterShader(kTextureVS, kShadowCasterFS);
        mParticleShader = new TextureShader(kTextureVS, kParticleFS);
        callBackFunction();
    };

    var getUnlitShader = function () { return mUnlitShader; };

    var getUnlitTextureShader = function () { return mUnlitTextureShader; };

    var getUnlitSpriteShader = function () { return mUnlitSpriteShader; };

    var getConstColorShader = function () { return mConstColorShader; };

    var getTextureShader = function () { return mTextureShader; };

    var getSpriteShader = function () { return mSpriteShader; };

    var getLineShader = function () { return mLineShader; };

    var getLightShader = function () { return mLightShader; };

    var getIllumShader = function () { return mIllumShader; };

    var getShadowReceiverShader = function () { return mShadowReceiverShader; };

    var getShadowCasterShader = function () { return mShadowCasterShader; };

    var getParticleShader = function () { return mParticleShader; };

    var init = function (callBackFunction) {
        engine.TextFileLoader.loadTextFile(kUnlitFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.TextFileLoader.loadTextFile(kUnlitTextureFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.TextFileLoader.loadTextFile(kSimpleVS, engine.TextFileLoader.eTextFileType.eTextFile);
        engine.TextFileLoader.loadTextFile(kSimpleFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.TextFileLoader.loadTextFile(kTextureVS, engine.TextFileLoader.eTextFileType.eTextFile);
        engine.TextFileLoader.loadTextFile(kTextureFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.TextFileLoader.loadTextFile(kLineFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.TextFileLoader.loadTextFile(kLightFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.TextFileLoader.loadTextFile(kIllumFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.TextFileLoader.loadTextFile(kShadowReceiverFS, engine.TextFileLoader.eTextFileType.eTextFile);
        engine.TextFileLoader.loadTextFile(kShadowCasterFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.TextFileLoader.loadTextFile(kParticleFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.Fonts.loadFont(kDefaultFont);
        engine.Textures.loadTexture(kParticleTexture);
        engine.Textures.loadTexture(fireParticleTexture);
        engine.Textures.loadTexture(smokeParticleTexture);
        engine.Textures.loadTexture(snowParticleTexture);
        engine.Textures.loadTexture(tinyParticleTexture);
        engine.Textures.loadTexture(dustParticleTexture);
        engine.Textures.loadTexture(dust2ParticleTexture);
        engine.Textures.loadTexture(flareParticleTexture);
        engine.Textures.loadTexture(shockParticleTexture);
        engine.Textures.loadTexture(shock2ParticleTexture);
        engine.Textures.loadTexture(targetParticleTexture);
        engine.Textures.loadTexture(bubbleParticleTexture);
        engine.Textures.loadTexture(sparkleParticleTexture);
        engine.Textures.loadTexture(UIRadarButtonTexture);
        engine.Textures.loadTexture(UIDropDownArrow);
        engine.Textures.loadTexture(BarStencil);
        engine.Textures.loadTexture(VBarStencil);
        engine.Textures.loadTexture(SliderHandle);
        engine.Textures.loadTexture(VSliderHandle);
        engine.Textures.loadTexture(SwitchToggleHandle);
        engine.Textures.loadTexture(SwitchToggleStencil);
        engine.Textures.loadTexture(ButtonStencil);

        engine.ResourceMap.setLoadCompleteCallback(function s() { _createShaders(callBackFunction); });
    };

    var cleanUp = function () {
        mUnlitShader.cleanUp();
        mUnlitTextureShader.cleanUp();
        mUnlitSpriteShader.cleanUp();
        mConstColorShader.cleanUp();
        mTextureShader.cleanUp();
        mSpriteShader.cleanUp();
        mLineShader.cleanUp();
        mLightShader.cleanUp();
        mIllumShader.cleanUp();
        mShadowReceiverShader.cleanUp();
        mShadowCasterShader.cleanUp();
        mParticleShader.cleanUp();

        engine.TextFileLoader.unloadTextFile(kUnlitFS);

        engine.TextFileLoader.unloadTextFile(kUnlitTextureFS);

        engine.TextFileLoader.unloadTextFile(kSimpleVS);
        engine.TextFileLoader.unloadTextFile(kSimpleFS);

        engine.TextFileLoader.unloadTextFile(kTextureVS);
        engine.TextFileLoader.unloadTextFile(kTextureFS);

        engine.TextFileLoader.unloadTextFile(kLineFS);


        engine.TextFileLoader.unloadTextFile(kLightFS);

        engine.TextFileLoader.unloadTextFile(kIllumFS);

        engine.TextFileLoader.unloadTextFile(kShadowReceiverFS, engine.TextFileLoader.eTextFileType.eTextFile);
        engine.TextFileLoader.unloadTextFile(kShadowCasterFS, engine.TextFileLoader.eTextFileType.eTextFile);

        engine.TextFileLoader.unloadTextFile(kParticleFS);

        engine.Fonts.unloadFont(kDefaultFont);

        engine.Textures.unloadTexture(kParticleTexture);
        engine.Textures.unloadTexture(fireParticleTexture);
        engine.Textures.unloadTexture(smokeParticleTexture);
        engine.Textures.unloadTexture(snowParticleTexture);
        engine.Textures.unloadTexture(tinyParticleTexture);
        engine.Textures.unloadTexture(dustParticleTexture);
        engine.Textures.unloadTexture(dust2ParticleTexture);
        engine.Textures.unloadTexture(flareParticleTexture);
        engine.Textures.unloadTexture(shockParticleTexture);
        engine.Textures.unloadTexture(shock2ParticleTexture);
        engine.Textures.unloadTexture(targetParticleTexture);
        engine.Textures.unloadTexture(bubbleParticleTexture);
        engine.Textures.unloadTexture(sparkleParticleTexture);
        engine.Textures.unloadTexture(UIRadarButtonTexture);
        engine.Textures.unloadTexture(UIDropDownArrow);
        engine.Textures.unloadTexture(BarStencil);
        engine.Textures.unloadTexture(VBarStencil);
        engine.Textures.unloadTexture(SliderHandle);
        engine.Textures.unloadTexture(VSliderHandle);
        engine.Textures.unloadTexture(SwitchToggleHandle);
        engine.Textures.unloadTexture(SwitchToggleStencil);
        engine.Textures.unloadTexture(ButtonStencil);
    };

    var mPublic = {
        init,
        getUnlitShader,
        getUnlitTextureShader,
        getUnlitSpriteShader,
        getConstColorShader,
        getTextureShader,
        getSpriteShader,
        getLineShader,
        getLightShader,
        getIllumShader,
        getShadowReceiverShader,
        getShadowCasterShader,
        getParticleShader,
        getDefaultFont,
        getGlobalAmbientColor,
        setGlobalAmbientColor,
        getGlobalAmbientIntensity,
        setGlobalAmbientIntensity,
        cleanUp
    };
    return mPublic;
}());
