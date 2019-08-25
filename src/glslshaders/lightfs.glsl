precision mediump float; 

uniform sampler2D uSampler;

uniform vec4 uPixelColor;  
uniform vec4 uGlobalAmbientColor; 
uniform float uGlobalAmbientIntensity;

#define kGLSLuLightArraySize 4

#define ePointLight       0
#define eDirectionalLight 1
#define eSpotLight        2

struct Light  {
    vec3 Position;      
    vec3 Direction;     
    vec4 Color;
    float Near;         
    float Far;
    float CosInner;     
    float CosOuter;     
    float Intensity;
    float DropOff;      
    bool  IsOn;
    int   LightType;    
};
uniform Light uLights[kGLSLuLightArraySize];  

varying vec2 vTexCoord;

float AngularDropOff(Light lgt, vec3 lgtDir, vec3 L) {
    float atten = 0.0;
    float cosL = dot(lgtDir, L);
    float num = cosL - lgt.CosOuter;
    if (num > 0.0) {
        if (cosL > lgt.CosInner) 
            atten = 1.0;
        else {
            float denom = lgt.CosInner - lgt.CosOuter;
            atten = smoothstep(0.0, 1.0, pow(num/denom, lgt.DropOff));
        }
    }
    return atten;
}

float DistanceDropOff(Light lgt, float dist) {
    float atten = 0.0;
    if (dist <= lgt.Far) {
        if (dist <= lgt.Near)
            atten = 1.0;  
        else {
            float n = dist - lgt.Near;
            float d = lgt.Far - lgt.Near;
            atten = smoothstep(0.0, 1.0, 1.0-(n*n)/(d*d)); 
        }   
    }
    return atten;
}

vec4 LightEffect(Light lgt) {    
    float aAtten = 1.0, dAtten = 1.0;

    if (lgt.LightType != eDirectionalLight) {
        vec3 lgtDir = -normalize(lgt.Direction.xyz);
        vec3 L = lgt.Position.xyz - gl_FragCoord.xyz;
        float dist = length(L); 
        L = L / dist;  
    
        if (lgt.LightType == eSpotLight) {
            aAtten = AngularDropOff(lgt, lgtDir, L);
        } 
        dAtten = DistanceDropOff(lgt, dist);
    }
    return dAtten * aAtten * lgt.Intensity * lgt.Color;
}

void main(void)  {
    vec4 textureMapColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    vec4 lgtResults = uGlobalAmbientIntensity * uGlobalAmbientColor;

    if (textureMapColor.a > 0.0) {
        for (int i=0; i<kGLSLuLightArraySize; i++) { 
            if (uLights[i].IsOn) { 
                lgtResults +=  LightEffect(uLights[i]);
            }
        }
    }
    lgtResults *= textureMapColor;

    vec3 r = vec3(lgtResults) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, textureMapColor.a);

     if (result.a < 0.01) 
        discard;

    gl_FragColor = result;
}
