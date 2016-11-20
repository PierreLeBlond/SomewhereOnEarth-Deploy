/**
 * Global namespace
 * @namespace
 */
var EARTH = EARTH || {};

EARTH.Sun = function(){

    this.textureLoader                              = new THREE.TextureLoader();

    this.geometry                                   = new THREE.SphereGeometry(20, 32, 32);

    this.shader                                     = new THREE.MeshBasicMaterial({
        map: this.textureLoader.load("/images/earth/sun.jpg")
    });

    this.sunObject                                  = new THREE.Mesh(this.geometry, this.shader);

    this.sunGhostObject                              = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 32),
                                                                     new THREE.MeshBasicMaterial({
                                                                         color: 0xffffff,
                                                                         map: this.textureLoader.load("/images/earth/sun.jpg")
                                                                     }));

    this.light                                      = new THREE.PointLight(0xffffffff, 1.0);

    this.lensFlare                                  = new THREE.LensFlare( 700, 0.0, THREE.AdditiveBlending, 0xffffff);
};

EARTH.Sun.prototype.setup = function(){
    this.sunObject.position.copy(new THREE.Vector3(50, 0, 50));
    this.sunGhostObject.position.copy(new THREE.Vector3(50, 0, 50));

    this.sunObject.add(this.light);

    this.lensFlare.add( this.textureLoader.load("/images/earth/lensflare.jpeg"), 128, 0.1, THREE.AdditiveBlending );
    this.lensFlare.add( this.textureLoader.load("/images/earth/lensflare.jpeg"), 128, 0.3, THREE.AdditiveBlending );
    this.lensFlare.add( this.textureLoader.load("/images/earth/lensflare.jpeg"), 64, 0.7, THREE.AdditiveBlending );
    this.lensFlare.add( this.textureLoader.load("/images/earth/lensflare.jpeg"), 64, 1.5, THREE.AdditiveBlending );

    //this.sunObject.add(this.lensFlare);
};
