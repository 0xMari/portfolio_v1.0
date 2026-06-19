const vertex_main =`
vec3 coords = normal;
coords.y += uTime;
vec3 noisePattern = vec3(noise(coords));
float pattern = wave((noisePattern + uTime));

// varyings
vDisplacement = pattern;


float displacement = (vDisplacement / 30.0) ;

transformed += normalize(objectNormal) * displacement;

`;

export default vertex_main;