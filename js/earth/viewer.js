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

    this.scene                                      = null;
    this.renderer                                   = null;
    this.renderTarget                               = null;
    this.detector                                   = null;
    this.earth                                      = null;

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
 * Set the scene
 * @param {Earth.scene} scene - The scene
 */
EARTH.Viewer.prototype.setScene = function(scene){
    this.scene = scene;
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
    }else if(!this.scene) {
        console.log("Error : View does not have a scene");
    }else{

        //RENDERER PROPERTIES
        this.renderer = new THREE.WebGLRenderer({ alpha: true});
        this.renderer.setClearColor(0x000000);

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

        this.resize(this.width, this.height, this.left, this.top);

        //this.stats = new Stats();
        //this.stats.setMode(0);
        //document.body.appendChild( this.stats.dom );

        this.controls = new THREE.OrbitControls( this.scene.camera, this.domElement, this.domElement);
        this.controls.enablePan = false;
        this.controls.rotateSpeed = 0.2;
        this.controls.zoomSpeed = 0.5;
        this.controls.minDistance = 1.01;
        this.controls.maxDistance = 2.5;
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

    if(this.stats)
        this.stats.update();
    this.controls.update();

    this.renderer.render(this.scene.scene, this.scene.camera);

};

EARTH.Viewer.prototype.stop = function(){
    cancelAnimationFrame(this.renderId);
}

EARTH.Viewer.prototype.mouseclick = function(event){
    var index = this.getIndex(event.clientX, event.clientY);
    this.pickCountry(index);
}

EARTH.Viewer.prototype.pickCountry = function(index){
    this.earth.uniforms.pickedindex.value = index;
    var menu = EARTH.countryAvailable[index];
    console.log(index);
    if(index > 0)
    {
        var countryName = this.getCountryName(index).toLowerCase();
        document.getElementById("country-name").innerHTML = countryName.charAt(0).toUpperCase() + countryName.slice(1);
        if(menu)
        {
            document.getElementById("earth-ul").style.display = "block";

            if(menu%2 == 0){
                document.getElementById("post-link").href = "/" + countryName + "/";
                document.getElementById("post-link").style.display = "inline-block";
            }
            else
                document.getElementById("post-link").style.display = "none";

            if(menu%3 == 0){
                document.getElementById("gallery-link").href = "/gallery/" + countryName + "/";
                document.getElementById("gallery-link").style.display = "inline-block";
            }
            else
                document.getElementById("gallery-link").style.display = "none";
        }else{
            document.getElementById("earth-ul").style.display = "none";
        }
    }
    else
    {
        document.getElementById("earth-ul").style.display = "none";
        document.getElementById("country-name").innerHTML = "";
    }
}

EARTH.Viewer.prototype.mousemove = function(event){
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - this.savedTime;
    if(elapsedTime > 20)
    {
        var index = this.getIndex(event.clientX, event.clientY);
        this.earth.uniforms.lookindex.value = index;
        this.savedTime = currentTime;
        if(index > 0)
        {
            document.getElementById("country-popup-name").innerHTML = this.getCountryName(index);
            //this.countryPopup.innerHTML = index + " : " + this.getCountryName(index);
            this.countryPopup.style.display = "block";
            var left = event.clientX + "px";
            this.countryPopup.style.left = left;
            var bottom = this.height - event.clientY + "px";
            this.countryPopup.style.bottom = bottom;

        }else{
            this.countryPopup.style.display = "none";
        }
    }
}

EARTH.Viewer.prototype.getIndex = function(x, y){

    this.renderTarget.width = this.width;
    this.renderTarget.height = this.height;

    this.renderer.render(this.detector.scene, this.scene.camera, this.renderTarget);

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

    this.scene.camera.aspect = this.width / this.height;
    this.scene.camera.updateProjectionMatrix();

    this.renderer.setSize( this.width, this.height );

    this.renderTarget = new THREE.WebGLRenderTarget(this.width, this.height,
                                                    { minFilter: THREE.NearestFilter,
                                                        magFilter: THREE.NearestFilter,
                                                        format: THREE.RGBAFormat });
};

