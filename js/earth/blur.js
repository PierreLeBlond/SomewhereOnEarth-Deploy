/**
 *  Global namespace
 *  @namespace
 */
var EARTH = EARTH || {};

EARTH.Blur = function(){
    this.scene                          = null;

    this.renderer                       = null;
    this.renderTarget                   = null;
    this.ghostRenderTarget              = null;

    this.renderMode                     = 0;

    this.width                          = null;
    this.height                         = null;

    this.geometry                       = new THREE.PlaneGeometry(2, 2);

    this.uniforms                       = {
        map: {type: "t", value: null},
        ghostMap: {type: "t", value: null},
        sunPos: {type: "vec2", value: new THREE.Vector2(0.5, 0.5)},
        earthPos: {type: "vec2", value: new THREE.Vector2(0.5, 0.5)},
        radius: {type: "f", value: 0.0},
        blur: {type: "f", value: 0.2},
        bright: {type: "f", value: 1.9}
    };

    this.shader                         = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader:   document.getElementById( 'blurVertexShader' ).textContent,
        fragmentShader: document.getElementById( 'blurFragmentShader' ).textContent
    });

    this.object                         = new THREE.Mesh(this.geometry, this.shader);
}

EARTH.Blur.prototype.render = function(){
    this.renderTarget.width = this.width;
    this.renderTarget.height = this.height;
    this.ghostRenderTarget.width = this.width;
    this.ghostRenderTarget.height = this.height;

    this.renderer.render(this.scene.scene, this.scene.camera, this.renderTarget);
    this.object.material.uniforms.map.value = this.renderTarget.texture;

    this.renderer.render(this.scene.ghostScene, this.scene.camera, this.ghostRenderTarget);
    this.object.material.uniforms.ghostMap.value = this.ghostRenderTarget.texture;

    if(this.renderMode == 0)
        this.renderer.render(this.object, this.scene.camera);
    else if(this.renderMode > 1)
        this.renderer.render(this.scene.scene, this.scene.camera);
    else
        this.renderer.render(this.scene.ghostScene, this.scene.camera);

};

EARTH.Blur.prototype.setup = function(){
    this.scene = new EARTH.Scene();
    this.scene.setupScene();
}


