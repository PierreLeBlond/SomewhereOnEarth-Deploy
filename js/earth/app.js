/**
 * Global namespace
 * @namespace
 */
var EARTH = EARTH || {};

/**
 * The earth script
 * @constructor
 *
 * @property {boolean} light                        - If the light is on, i.e.
 * if the earth isn't rendered.
 *
 */
EARTH.App = function(){
    this.light                              = true;
    this.isReady                            = false;
    this.viewer                             = null;
    this.earth                              = null;
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
    lat -= 90;
    lat -= 5;
    lat *= Math.PI/180.0;
    lon += 180;
    lon += 5;
    lon *= Math.PI/180.0;

    this.viewer.scene.camera.position.set(2*Math.cos(lon)*Math.sin(lat), 2*Math.cos(lat), 2*Math.sin(lon)*Math.sin(lat));
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
    this.viewer.earth = this.earth;

    var country = document.getElementsByTagName("section")[0].getAttribute("country");
    if(!country || country == "none")
        country = EARTH.currentCountry;
    if(country.charAt(0) == "/")
        country = country.substring(1, country.length-1);

    var id = EARTH.country[country];

    this.lat = parseInt(EARTH.countryPos.countries[id].lat);
    this.lon = parseInt(EARTH.countryPos.countries[id].lon);
    console.log(this.lat + "/" + this.lon);
    this.focus(this.lat, this.lon);
    this.viewer.pickCountry(EARTH.countryColorMap[id]);

    /*var gui = new dat.GUI();
    console.log(gui.domElement);
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

    if(this.light){
        document.getElementById("main").style.display = "none";
        document.getElementById("title").style.display = "none";
        document.getElementById("earth-section").style.display = "block";
        document.getElementById("main-nav").style.display = "none";
        document.getElementById("earth-nav").style.display = "block";

        var divs = document.getElementsByClassName("light-switch");
        for(var i = 0; i < divs.length; i++)
        {
            divs[i].style.color = "#EEEEEE";
        }

        var imgs = document.getElementsByClassName("underline");
        for(var i = 0; i < imgs.length; i++)
        {
            imgs[i].src = "/images/undertitle.svg";
        }

        document.getElementById("earth-logo").src = "/images/earth_neg.svg";
        document.getElementById("header").className = "night";

        document.getElementsByTagName("body")[0].style.backgroundColor = "#030303";
        this.viewer.resize();
        this.viewer.render();
    }
    else{
        document.getElementById("earth-section").style.display = "none";
        document.getElementById("main").style.display = "block";
        document.getElementById("title").style.display = "block";
        document.getElementById("earth-nav").style.display = "none";
        document.getElementById("main-nav").style.display = "block";

        var divs = document.getElementsByClassName("light-switch");
        for(var i = 0; i < divs.length; i++)
        {
            divs[i].style.color = "#030303";
        }

        document.getElementById("earth-logo").src = "/images/earth.svg";
        document.getElementById("header").className = "day";

        var imgs = document.getElementsByClassName("underline");
        for(var i = 0; i < imgs.length; i++)
        {
            imgs[i].src = "/images/undertitle_neg.svg";
        }

        document.getElementsByTagName("body")[0].style.backgroundColor = "#EEEEEE";
        this.viewer.stop();
    }
    this.light = !this.light;
}

var app = new EARTH.App();
var domElement = document.getElementById('earth-div');
var width = "\"" + window.innerWidth + "px\"";
domElement.style.width = width;
var height = "\"" + window.innerHeight + "px\"";
domElement.style.height = height;
app.setDomElement(domElement);
document.getElementById('earth-section').style.display = "none";
document.getElementById("earth-logo").onclick = function(){app.toogleEarth();};
console.log(document.getElementsByTagName("section")[0].getAttribute("country"));
