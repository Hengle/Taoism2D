"use strict";  

function ParticleRenderable(myTexture) {
    TextureRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, engine.defaultResources.getParticleShader());
}
engine.core.inheritPrototype(ParticleRenderable, TextureRenderable);
