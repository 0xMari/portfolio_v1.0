const fragment_main = `


normal = perturbNormalArb( - vViewPosition, normal, vec2(dFdx(vDisplacement), dFdy(vDisplacement)), faceDirection ); 

`;

export default fragment_main;