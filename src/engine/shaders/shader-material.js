"use strict";  

function ShaderMaterial(aIllumShader) {
    let gl = engine.graphics.gl;
    this.mKaRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ka");
    this.mKdRef = gl.getUniformLocation(aIllumShader, "uMaterial.Kd");
    this.mKsRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ks");
    this.mShineRef = gl.getUniformLocation(aIllumShader, "uMaterial.Shininess");
}

ShaderMaterial.prototype.loadToShader = function (aMaterial) {
    let gl = engine.graphics.gl;
    gl.uniform4fv(this.mKaRef, aMaterial.getAmbient());
    gl.uniform4fv(this.mKdRef, aMaterial.getDiffuse());
    gl.uniform4fv(this.mKsRef, aMaterial.getSpecular());
    gl.uniform1f(this.mShineRef, aMaterial.getShininess());
};

