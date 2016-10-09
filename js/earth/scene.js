/**
 * Global namespace
 * @namespace
 */
var EARTH = EARTH || {};

/**
 * The earth scene
 * @constructor
 *
 * @property {THREE.Scene} scene                        - The scene
 *
 * @property {THREE.PerspectiveCamera} camera           - The camera
 *
 */
EARTH.Scene = function(){
    this.scene                              = null;

    this.camera                             = null;

}

/**
 * Setup the scene
 */
EARTH.Scene.prototype.setupScene = function(){
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 75, 1.0, 0.00001, 200 );
    this.camera.position.set(1,1,1.5);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
};

