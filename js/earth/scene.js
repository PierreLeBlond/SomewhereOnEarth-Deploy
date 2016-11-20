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
    this.ghostScene                         = null;
    this.earth                              = null;
    this.sun                                = null;
    this.path                               = null;
    this.skybox                             = null;
    this.camera                             = null;
}

/**
 * Setup the scene
 */
EARTH.Scene.prototype.setupScene = function(){
    this.scene = new THREE.Scene();
    this.ghostScene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 75, 1.0, 0.00001, 200 );
    this.camera.position.set(2,0,0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.skybox = new EARTH.Skybox;
    this.skybox.setup();
    this.scene.add( this.skybox.skyObject );
    //this.scene.add( this.camera );

    this.earth = new EARTH.Earth;
    this.earth.setupEarth();
    this.scene.add( this.earth.earthObject );
    this.ghostScene.add( this.earth.earthGhostObject );

    this.sun = new EARTH.Sun;
    this.sun.setup();
    this.scene.add( this.sun.sunObject );
    this.ghostScene.add( this.sun.sunGhostObject );

    this.earth.earthObject.material.uniforms.sunPosition.value = this.sun.sunObject.position;

    this.path = new EARTH.Path;
    this.path.setup();
    this.scene.add( this.path.pointCloud );
};

