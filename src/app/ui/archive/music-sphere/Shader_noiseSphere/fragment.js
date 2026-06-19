const fragment = `


varying vec3 vNormal;
varying float vPerlinStrenght;
varying vec3 vColor;

void main(){

    gl_FragColor = vec4 (vColor, 1);
}
`;

export default fragment;