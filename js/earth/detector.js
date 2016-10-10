/**
 * Global namespace
 * @namespace
 */
var EARTH = EARTH || {};

/**
 * The earth script
 * @constructor
 *
 *
 */
EARTH.Detector = function(){

    this.textureLoader                              = new THREE.TextureLoader();

    this.uniforms =                                   {
        map:      { type: 't', value: null },
        uoffset:  { type: 'f', value: -0.0270 },
        voffset:  { type: 'f', value: 0.0060 }
    };

    this.shaderMaterial                             = null;
    this.geometry                                   = new THREE.SphereGeometry(1, 32, 32);

    this.object                                     = null;

    this.scene                                      = new THREE.Scene();
}

EARTH.Detector.prototype.setupDetector = function(){
    this.uniforms.map.value = this.textureLoader.load("/images/earth/map_indexed.png")
    this.uniforms.map.value.magFilter = THREE.NearestFilter;
    this.uniforms.map.value.minFilter = THREE.NearestFilter;

    this.shaderMaterial = new THREE.ShaderMaterial( {
        uniforms:       this.uniforms,
        vertexShader:   document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShaderDetector' ).textContent
    });

    this.object = new THREE.Mesh(this.geometry, this.shaderMaterial);

    this.scene.add(this.object);
}
