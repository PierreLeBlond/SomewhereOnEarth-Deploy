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

    this.skyGeometry                                = new THREE.BoxGeometry(10, 10, 10);
    this.skyShader                                  = new THREE.MeshBasicMaterial({
        envMap: this.textureLoader.load( [ "/images/earth/stars_bk.jpg",
"/images/earth/stars_dn.jpg","/images/earth/stars_fr.jpg","/images/earth/stars_lf.jpg",
"/images/earth/stars_rt.jpg","/images/earth/stars_up.jpg" ]
                                      ),
        side: THREE.BackSide
    });
    this.skyObject                                  = new THREE.Mesh(this.skyGeometry, this.skyShader);
};

EARTH.Skybox.prototype.setup = function(){

};
