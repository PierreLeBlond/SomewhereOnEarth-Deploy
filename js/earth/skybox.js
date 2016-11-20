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

    this.textureLoader                              = new THREE.CubeTextureLoader();

    this.uniforms                                   = {
        envMap: {type : "t", value: null}
    };

    this.skyGeometry                                = new THREE.CubeGeometry(1, 1, 1);
    this.skyShader                                  = null;
    this.skyObject                                  = null;
};

EARTH.Skybox.prototype.setup = function(){

    var prefix = "/images/earth/";
    var suffixe = "stars_";
    var extend = ".jpg";

    //var directions = ["Right", "Left", "Up", "Down", "Back", "Front"];
    var directions = ["bk", "dn", "fr", "lf", "rt", "up"];

    var textures = [];
    for (var i = 0; i < 6; i++){
        textures.push(prefix + suffixe + directions[i] + extend );
    }

    this.uniforms.envMap.value = this.textureLoader.load(textures);
    this.skyShader =  new THREE.ShaderMaterial({
        side:                                       THREE.DoubleSide,
        uniforms:                                   this.uniforms,
        vertexShader:                               document.getElementById( 'skyboxVertexShader' ).textContent,
        fragmentShader:                             document.getElementById( 'skyboxFragmentShader' ).textContent
    });

    this.skyObject =  new THREE.Mesh(this.skyGeometry, this.skyShader);

    this.skyObject.rotation.y += Math.PI / 2;
};
