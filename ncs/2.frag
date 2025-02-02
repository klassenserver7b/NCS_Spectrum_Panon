in vec4 gl_FragCoord;

#request uniform "screen" screen
uniform ivec2 screen;
precision highp float;

#request uniform "time" time
uniform float time;

#request timecycle 0

out vec4 fragment;

layout(binding = 4, rgba32f)coherent uniform image2D image;
layout(binding = 5, r32ui)uniform uimage2D depthImage;

#request uniform "prev" prev
uniform sampler2D prev;

void main()
{
    vec4 img = imageLoad(image, ivec2(gl_FragCoord.xy));
    vec3 color = vec3(0.1216, 0.1216, 0.1216); //vec3(.0431,.1882,.8314); vec3(.2039,.051,.4941) vec3(.349,0.,1.) vec3(0.0, 0.3176, 1.0)(opacity=.03, cAS=0,op=.05,cAS=.04) vec3(1.0, 0.0, 0.298) (opacity=.2) vec3(0.1961, 0.0, 0.4549)(opacity=.05,cAS=.1) vec3(0.4196, 0.0314, 0.149)(op=.53,cAS=.13) vec3(0.0078, 0.0235, 0.0549),(op=.02,cAS=.6)
    
    float opacity = 0.1;
    
    const float colorIntensityAddStrength = 0.2;
    
    if ((img.r) != 0)
    {
        fragment.w = 1;
        float particleSize = img.b;
        
        uint depth = 0;
        depth = imageAtomicExchange(depthImage, ivec2(gl_FragCoord.xy), depth);
        
        fragment.xyz = color.xyz;
        fragment *= (pow(float(depth) / particleSize , colorIntensityAddStrength) - (colorIntensityAddStrength)) * (1 - pow(1 - opacity, float(depth) / particleSize));
        
        imageStore(image, ivec2(gl_FragCoord.xy), vec4(0));
    }
    else fragment = vec4(opacity + colorIntensityAddStrength , vec3(0));
}

