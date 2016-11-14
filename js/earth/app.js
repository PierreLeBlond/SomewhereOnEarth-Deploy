/**
 * Global namespace
 * @namespace
 */
var EARTH = EARTH || {};

/**
 * The earth script
 * @constructor
 *
 * @property {boolean} day                        - If the day is on, i.e.
 * if the earth isn't rendered.
 *
 */
EARTH.App = function(){
    this.day                              = true;
    this.menuCollapsed                    = true;
    this.isReady                            = false;
    this.viewer                             = null;
    this.earth                              = null;
    this.path                               = null;
    this.skybox                             = null;
    this.windowResizeEvent                  = null;

    this.lat                                = 0;
    this.lon                                = 0;
}

/**
 *  * Set the dom element
 *   * @param {Node} el             - The dom element from which the
 *   application will be displayed
 *    */
EARTH.App.prototype.setDomElement = function(el){
        this.domElement = el;
};

EARTH.App.prototype.focus = function(lat, lon){
    var phi = Math.PI/2 - lat * Math.PI / 180 - Math.PI * 0.01;
    var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;

    var r = 2;

    this.viewer.scene.camera.position.set(r*Math.cos(theta)*Math.sin(phi), r*Math.cos(phi), r*Math.sin(theta)*Math.sin(phi));
    this.viewer.scene.camera.lookAt(new THREE.Vector3(0, 0, 0));
};


/**
 *  * Setup the earth script
 *   */
EARTH.App.prototype.setupApp = function(){

    var scene = new EARTH.Scene();
    scene.setupScene();

    this.viewer = new EARTH.Viewer();
    //this.domElement.style.width = "100px";
    //this.domElement.style.height = "200px";
    this.viewer.setDomElement(this.domElement);
    this.viewer.setScene(scene);
    this.viewer.setupViewer();

    this.earth = new EARTH.Earth;
    this.earth.setupEarth();

    this.viewer.scene.scene.add( this.earth.earthObject );
    this.viewer.scene.scene.add( this.earth.hollowObject );
    this.viewer.earth = this.earth;

    this.path = new EARTH.Path;
    this.path.setup();

    this.viewer.scene.scene.add( this.path.pointCloud );

    this.skybox = new EARTH.Skybox;
    this.skybox.setup();
    this.viewer.scene.scene.add( this.skybox.skyObject );

    this.viewer.scene.scene.add( this.viewer.scene.camera );

    var country = document.getElementsByTagName("section")[0].getAttribute("country");
    if(!country || country == "none")
        country = EARTH.currentCountry;
    if(country.charAt(0) == "/")
        country = country.substring(1, country.length-1);

    var id = EARTH.country[country];

    this.lat = parseInt(EARTH.countryPos.countries[id].lat);
    this.lon = parseInt(EARTH.countryPos.countries[id].lon);
    this.focus(this.lat, this.lon);
    this.viewer.pickCountry(EARTH.countryColorMap[id]);

    /*var gui = new dat.GUI();
    document.getElementsByClassName("ac")[0].style.zIndex = "1000";
    var that = this;
    gui.add(this, 'lat', -90, 90).name('lat').onChange(function(val){
        that.focus(val, that.lon);
    });
    gui.add(this, 'lon', -180, 180).name('lon').onChange(function(val){
        that.focus(that.lat, val);
    });*/
};

EARTH.App.prototype.toogleEarth = function(){
    if(!this.isReady)
    {
        this.setupApp();
        this.isReady = true;
    }

    if(this.day){
        var elements = document.getElementsByClassName("switch");
        for(var i = 0; i < elements.length; i++)
        {
            elements[i].className = elements[i].className.replace("day","night");
        }

        this.viewer.resize();
        this.viewer.render();
    }
    else{
        var elements = document.getElementsByClassName("switch");
        for(var i = 0; i < elements.length; i++)
        {
            elements[i].className = elements[i].className.replace("night","day");
        }

        this.viewer.stop();
    }
    this.day = !this.day;
}

EARTH.App.prototype.toogleMenu = function(navSwitch){
    navs = document.getElementsByTagName("nav");
    if(this.menuCollapsed)
    {
        for(var i = 0; i < navs.length; i++)
        {
            navs[i].style.right = "0px";
        }
        navSwitch.className = "expanded";
    }
    else
    {
        for(var i = 0; i < navs.length; i++)
        {
            navs[i].style.right = "100%";
        }
        navSwitch.className = "";
    }
    this.menuCollapsed = !this.menuCollapsed;
}

var app = new EARTH.App();
var domElement = document.getElementById('earth-div');
var width = "\"" + window.innerWidth + "px\"";
domElement.style.width = width;
var height = "\"" + window.innerHeight + "px\"";
domElement.style.height = height;
app.setDomElement(domElement);
document.getElementById("earth-logo").onclick = function(){app.toogleEarth();};
var navSwitch = document.getElementById("nav-switch");
navSwitch.onclick = function(){app.toogleMenu(navSwitch);};
