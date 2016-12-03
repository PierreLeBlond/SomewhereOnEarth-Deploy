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
    var suffixe = "space_";
    var extend = ".jpg";

    //var directions = ["posx", "negx", "posy", "negy", "posz", "negz"];
    var directions = ["right", "left", "top", "bottom", "front", "back"];
    //var directions = ["bk", "dn", "fr", "lf", "rt", "up"];

    var textures = [];
    for (var i = 0; i < 6; i++){
        textures.push(prefix + suffixe + directions[i] + extend );
        //textures.push("/images/earth/stars.jpg");
    }

    this.uniforms.envMap.value = this.textureLoader.load(textures);
    //this.uniforms.envMap.value.magFilter = THREE.NearestFilter;
    //this.uniforms.envMap.value.minFilter = THREE.NearestFilter;
    this.skyShader =  new THREE.ShaderMaterial({
        side:                                       THREE.DoubleSide,
        uniforms:                                   this.uniforms,
        vertexShader:                               document.getElementById( 'skyboxVertexShader' ).textContent,
        fragmentShader:                             document.getElementById( 'skyboxFragmentShader' ).textContent
    });

    this.skyObject =  new THREE.Mesh(this.skyGeometry, this.skyShader);

    this.skyObject.rotation.y += Math.PI / 2;
};
