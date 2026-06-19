const vertex = `



#define M_PI 3.1415926535897932384626433832795

varying vec3 vNormal;
varying float vPerlinStrenght;
varying vec3 vColor;

uniform float uTime;
uniform float uDistortionFrequency;
uniform float uDistortionStrenght;
uniform float uDisplacementFrequency;
uniform float uDisplacementStrenght;

uniform vec3 uLightAColor;
uniform vec3 uLightAPosition;
uniform float uLightAIntensity;
uniform vec3 uLightBColor;
uniform vec3 uLightBPosition;
uniform float uLightBIntensity;

uniform vec2 uSubdivision;

uniform float uFresnelOffset;
uniform float uFresnelMultiplier;
uniform float uFresnelPower;

uniform vec3 uOffset;

#pragma glslify: perlin4d = require('../partials/perlin4d.glsl')


vec3 getDisplacedPosition(vec3 _position){

  // vec3 offsetPosition = uOffsetDirection * uOffsetSpeed * uTime;

  vec3 distortedPosition = _position;
  distortedPosition += perlin4d(vec4(distortedPosition * uDistortionFrequency + uOffset, uTime)) * uDistortionStrenght;
  
  float perlinStrenght = perlin4d(vec4(distortedPosition * uDisplacementFrequency + uOffset, uTime));
  
  vec3 displacedPosition = _position;
  displacedPosition += normalize(_position) * perlinStrenght * uDisplacementStrenght;

  return displacedPosition;
}

void main(){
    
    //Position

    vec3 displacedPosition = getDisplacedPosition(position);

    vec4 viewPosition = viewMatrix * vec4 (displacedPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    float distanceA = (M_PI * 2.0) / uSubdivision.x ;
    float distanceB = M_PI / uSubdivision.y;

    vec3 biTangent = cross (normal, tangent.xyz);

    vec3 positionA = position + tangent.xyz * distanceA ;
    vec3 displacedPositionA = getDisplacedPosition(positionA);

    vec3 positionB = position + biTangent.xyz * distanceB ;
    vec3 displacedPositionB = getDisplacedPosition(positionB);

    vec3 computedNormal = cross(displacedPositionA - displacedPosition, displacedPositionB - displacedPosition);
    computedNormal = normalize(computedNormal);

    //Fresnel

    vec3 viewDirection = normalize(displacedPosition - cameraPosition);
    float fresnel = uFresnelOffset + (1.0 + dot(viewDirection, computedNormal)) * uFresnelMultiplier;
    fresnel = pow (max(0.0, fresnel), uFresnelPower);
    //fresnel = 1.0;


    //Color

    float lightAIntensity = max( 0.0, - dot(computedNormal.xyz, normalize( - uLightAPosition))) * uLightAIntensity;
    float lightBIntensity = max( 0.0, - dot(computedNormal.xyz, normalize( - uLightBPosition))) * uLightBIntensity;

    vec3 color = vec3(0.0);
    color = mix (color, uLightAColor, lightAIntensity * fresnel);
    color = mix (color, uLightBColor, lightBIntensity * fresnel);
    color = mix (color, vec3(1.0), clamp(pow(fresnel - 0.8, 3.0), 0.0, 1.0));


    //vNormal = normal;
    //vPerlinStrenght = displacedPosition.a;
    vColor = color;
    //gl_PointSize = 10.0;
}
`;

export default vertex;