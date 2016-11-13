/**
 * Global namespace
 * @namespace
 */
var EARTH = EARTH || {};

/**
 * The skybox script
 * @constructor
 *
 *
 */
EARTH.Skybox = function(){

    this.textureLoader                              = new THREE.TextureLoader();

    this.skyGeometry                                = new THREE.CubeGeometry(100, 100, 100);
/*    this.skyShader                                  = new THREE.ShaderMaterial({
        side:                                       THREE.DoubleSide,
        uniforms:                                   this.uniforms,
        vertexShader:                               document.getElementById( 'skyboxVertexShader' ).textContent,
        fragmentShader:                             document.getElementById( 'skyboxFragmentShader' ).textContent
    });*/

    this.skyShader                                  = null;
    this.skyObject                                  = null;
};

EARTH.Skybox.prototype.setup = function(){

    var prefix = "/images/earth/";
    var suffixe = "stars_";
    var extend = ".jpg";

    //var directions = ["Right", "Left", "Up", "Down", "Back", "Front"];
    var directions = ["bk", "dn", "fr", "lf", "rt", "up"];

    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: this.textureLoader.load( prefix + suffixe + directions[i] + extend ),
            side: THREE.BackSide
        }));

    this.skyShader = new THREE.MeshFaceMaterial( materialArray );
    this.skyObject =  new THREE.Mesh(this.skyGeometry, this.skyShader);

    this.skyObject.rotation.y += Math.PI / 2;
};
