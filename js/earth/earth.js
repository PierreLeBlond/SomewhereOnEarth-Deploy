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
EARTH.Earth = function(){

    this.textureLoader                              = new THREE.TextureLoader();

    this.uniforms                                   = null;
    this.shaderMaterial                             = null;
    this.geometry                                   = new THREE.SphereGeometry(1, 64, 64 );

    this.earthObject                                = null;

    this.hollowShader                               = new THREE.SpriteMaterial({
        map: this.textureLoader.load("/images/earth/spark.png"),
        size: 100.0
    });
    this.hollowObject                               = new THREE.Sprite(this.hollowShader);
}

/**
 * Setup the earth script
*/
EARTH.Earth.prototype.setupEarth = function(){

    var indexMap = this.textureLoader.load("/images/earth/map_indexed.png");

    indexMap.magFilter = THREE.NearestFilter;
    indexMap.minFilter = THREE.NearestFilter;

    this.uniforms = {
        map:{ type: 't', value: this.textureLoader.load("/images/earth/earth_map.png")},
        indexmap: { type: 't', value: indexMap},
        heightmap: { type: 't', value: this.textureLoader.load("/images/earth/earth_height_map_med.jpg")},
        lookindex: { type: 'i', value: 5 },
        pickedindex: { type: 'i', value: 5 },
        uoffset:{ type: 'f', value: 0.000 },
        voffset:{ type: 'f', value: 0.000 }
    };

    //

    this.shaderMaterial = new THREE.ShaderMaterial( {
        uniforms:       this.uniforms,
        transparent:    true,
        vertexShader:   document.getElementById( 'vertexShaderHeightMapping' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });

    this.earthObject = new THREE.Mesh(this.geometry, this.shaderMaterial);

 /*   var gui = new dat.GUI();
    gui.add(this.uniforms.uoffset, 'value', -0.025, 0.025).name('u offset').step(0.001);
    gui.add(this.uniforms.voffset, 'value', -0.007, 0.007).name('v offset').step(0.001);
    gui.add(this.uniforms.pickedindex, 'value', 0, 255).name('index').step(1);*/
};

EARTH.Earth.prototype.computeIndex = function(index){
 /*   var image = tex.image;

    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    var data = context.imageData( 0, 0, image.width, image.height ).data;

    var position = ( x + imageData.width * y ) * 4;*/

    this.uniforms.lookindex.value = index;
}
