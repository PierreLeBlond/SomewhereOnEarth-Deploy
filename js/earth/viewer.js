/**
 *  Global namespace
 *  @namespace
 */
var EARTH = EARTH || {};

/**
 * @description constructor EARTH.Viewer
 * @constructor
 *
 * @property {EARTH.Scene} scene                - The scene to display on this view
 * @property {THREE.WebGLRenderer} renderer     - The renderer
 * @property {Node} domElement                  - The element where we set the view
 * @property {Stats} stats                                                      - An element to display performance info, like fps
 * @property {number} width                     - the view's width
 * @property {number} height                    - the view's height
 * @property {number} left                      - the view's left
 * @property {number} top                       - the view's top
 */
EARTH.Viewer = function(){

    this.savedTime                                  = new Date().getTime();

    this.blur                                       = null;
    this.renderTarget                               = null;
    this.detector                                   = null;

    this.renderId                                   = null;

    this.domElement                                 = null;
    this.countryPopup                               = null;

    this.stats                                      = null;

    this.controls                                   = null;

    this.width                                      = 0;
    this.height                                     = 0;
    this.left                                       = 0;
    this.top                                        = 0;

    this.resizeEvent                                = null;
    this.mouseMoveEvent                             = null;
    this.mouseClickEvent                            = null;
}

/**
 * Set the DomElement attribute
 * @param {Node} el - The dom element
 */
EARTH.Viewer.prototype.setDomElement = function(el){
    this.domElement = el;
};

/**
 * @description Setup the scene, the renderer and the camera
 */
EARTH.Viewer.prototype.setupViewer = function(){

    if(!this.domElement) {
        console.log("Error : View does not have a dom element");
    }else{

        //RENDERER PROPERTIES
        this.renderer = new THREE.WebGLRenderer({ alpha: true});
        this.renderer.setClearColor(0x00000000);

        this.width = this.domElement.offsetWidth;
        this.height = this.domElement.offsetHeight;

        this.renderTarget = new THREE.WebGLRenderTarget(this.width, this.height,
                                                        { minFilter: THREE.NearestFilter,
                                                            magFilter: THREE.NearestFilter,
                                                            format: THREE.RGBAFormat });
        this.detector = new EARTH.Detector();
        this.detector.setupDetector();

        this.renderer.setSize(this.width, this.height);
        this.domElement.appendChild( this.renderer.domElement );

        this.blur = new EARTH.Blur();
        this.blur.renderer = this.renderer;
        this.blur.setup();

        this.resize(this.width, this.height, this.left, this.top);

        //this.stats = new Stats();
        //this.stats.setMode(0);
        //document.body.appendChild( this.stats.dom );


        this.controls = new THREE.OrbitControls( this.blur.scene.camera, this.domElement, this.domElement);
        this.controls.enablePan = false;
        this.controls.rotateSpeed = 0.2;
        this.controls.zoomSpeed = 0.5;
        this.controls.minDistance = 1.01;
        //this.controls.maxDistance = 2.5;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;


        this.resizeEvent = this.resize.bind(this);
        window.addEventListener( 'resize',this.resizeEvent, false );
        this.mouseMoveEvent = this.mousemove.bind(this);
        this.domElement.addEventListener( 'mousemove', this.mouseMoveEvent, false);
        this.mouseClickEvent = this.mouseclick.bind(this);
        this.domElement.addEventListener( 'click', this.mouseClickEvent, false);

        this.countryPopup = document.getElementById("country-popup");
    }
};

/**
 * Process all stuff related to animation
 */
EARTH.Viewer.prototype.animate = function(){
};

/**
 * Render the view
 */
EARTH.Viewer.prototype.render = function(){

    var that = this;
    this.renderId = requestAnimationFrame(function () {
        that.render();
    });

    this.animate();

    var sunPos3D = new THREE.Vector4();
    sunPos3D.copy(this.blur.scene.sun.sunObject.position);
    var sunVp = new THREE.Matrix4();
    sunVp.multiply(this.blur.scene.camera.projectionMatrix);
    sunVp.multiply(this.blur.scene.camera.matrixWorldInverse);
    sunPos3D.applyMatrix4(sunVp);
    var xSun = (sunPos3D.x/sunPos3D.w + 1.0)/2.0;
    xSun = Math.min(Math.max(xSun, 0.0), 1.0);
    var ySun = (sunPos3D.y/sunPos3D.w + 1.0)/2.0;
    ySun = Math.min(Math.max(ySun, 0.0), 1.0);

    this.blur.object.material.uniforms.sunPos.value = new THREE.Vector2(xSun, ySun);

    var earthPos3D = new THREE.Vector4();
    earthPos3D.copy(this.blur.scene.earth.earthObject.position);
    var earthVp = new THREE.Matrix4();
    earthVp.multiply(this.blur.scene.camera.projectionMatrix);
    earthVp.multiply(this.blur.scene.camera.matrixWorldInverse);
    earthPos3D.applyMatrix4(earthVp);
    var xEarth = (earthPos3D.x/earthPos3D.w + 1.0)/2.0;
    xEarth = Math.min(Math.max(xEarth, 0.0), 1.0);
    var yEarth = (earthPos3D.y/earthPos3D.w + 1.0)/2.0;
    yEarth = Math.min(Math.max(yEarth, 0.0), 1.0);

    this.blur.object.material.uniforms.earthPos.value = new THREE.Vector2(0.5, 0.5);

    if(this.stats)
        this.stats.update();
    this.controls.update();
    this.blur.scene.skybox.skyObject.position.copy(this.blur.scene.camera.position);

    this.blur.render();
};

EARTH.Viewer.prototype.stop = function(){
    cancelAnimationFrame(this.renderId);
}

EARTH.Viewer.prototype.mouseclick = function(event){
    var index = this.getIndex(event.clientX, event.clientY);
    this.pickCountry(index);
}

EARTH.Viewer.prototype.pickCountry = function(index){
    this.blur.scene.earth.uniforms.pickedindex.value = index;
    var menu = EARTH.countryAvailable[index];
    if(index > 0)
    {
        var countryName = this.getCountryName(index).toLowerCase();
        document.getElementById("country-name").innerHTML = countryName.charAt(0).toUpperCase() + countryName.slice(1);
        if(menu%2 == 0){
            document.getElementById("post-link").href = "/" + countryName + "/";
            document.getElementById("post-link").style.color = "white";
            document.getElementById("post-link").style.pointerEvents = "auto";
        }
        else
        {
            document.getElementById("post-link").href = "#";
            document.getElementById("post-link").style.color = "#666666";
            document.getElementById("post-link").style.pointerEvents = "none";
        }

        if(menu%3 == 0){
            document.getElementById("gallery-link").href = "/gallery/" + countryName + "/";
            document.getElementById("gallery-link").style.color = "white";
            document.getElementById("gallery-link").style.pointerEvents = "auto";
        }
        else
        {
            document.getElementById("gallery-link").href = "#";
            document.getElementById("gallery-link").style.color = "#666666";
            document.getElementById("gallery-link").style.pointerEvents = "none";
        }
    }
    else
    {
        document.getElementById("country-name").innerHTML = "Select a country";
    }
}

EARTH.Viewer.prototype.mousemove = function(event){
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - this.savedTime;
    if(elapsedTime > 20)
    {
        var index = this.getIndex(event.clientX, event.clientY);
        this.blur.scene.earth.uniforms.lookindex.value = index;
        this.savedTime = currentTime;
        if(index > 0)
        {
            /*document.getElementById("country-popup-name").innerHTML = this.getCountryName(index);
            //this.countryPopup.innerHTML = index + " : " + this.getCountryName(index);
            this.countryPopup.style.display = "block";
            var left = event.clientX + "px";
            this.countryPopup.style.left = left;
            var bottom = this.height - event.clientY + "px";
            this.countryPopup.style.bottom = bottom;*/

        }else{
            this.countryPopup.style.display = "none";
        }
    }
}

EARTH.Viewer.prototype.getIndex = function(x, y){

    this.renderTarget.width = this.width;
    this.renderTarget.height = this.height;

    this.renderer.render(this.detector.scene, this.blur.scene.camera, this.renderTarget);

    var buffer = new Uint8Array( this.renderTarget.width * this.renderTarget.height * 4);

    this.renderer.readRenderTargetPixels(this.renderTarget, 0, 0, this.renderTarget.width, this.renderTarget.height, buffer);

    var index = buffer[(x + this.renderTarget.width * ( this.renderTarget.height - y )) * 4];

    return index > 0 ? index : -1;
}

EARTH.Viewer.prototype.getCountryName = function(index){
    for(var i in EARTH.countryColorMap) {
        if (EARTH.countryColorMap.hasOwnProperty(i)) {
            if(index == EARTH.countryColorMap[i])
                return EARTH.countryName[i];
        }
    }
}

/**
 *  @description resize and adjust the view in order to render the scene
 *  properly
 */
EARTH.Viewer.prototype.resize = function(){
    this.width = this.domElement.offsetWidth;
    this.height = this.domElement.offsetHeight;

    this.blur.width = this.domElement.offsetWidth;
    this.blur.height = this.domElement.offsetHeight;

    this.blur.scene.camera.aspect = this.width / this.height;
    this.blur.scene.camera.updateProjectionMatrix();

    this.renderer.setSize( this.width, this.height );

    this.renderTarget = new THREE.WebGLRenderTarget(this.width, this.height,
                                                    { minFilter: THREE.NearestFilter,
                                                        magFilter: THREE.NearestFilter,
                                                        format: THREE.RGBAFormat });

    this.blur.renderTarget = new THREE.WebGLRenderTarget(this.width, this.height,
                                                    {format: THREE.RGBAFormat });

    this.blur.ghostRenderTarget = new THREE.WebGLRenderTarget(this.width, this.height,
                                                    {format: THREE.RGBAFormat });
};

