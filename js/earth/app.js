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
    this.viewer                             = null;
    this.windowResizeEvent                  = null;
}

/**
 *  * Set the dom element
 *   * @param {Node} el             - The dom element from which the
 *   application will be displayed
 *    */
EARTH.App.prototype.setDomElement = function(el){
        this.domElement = el;
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

    var earth = new EARTH.Earth;
    earth.setupEarth();

    this.viewer.scene.scene.add( earth.earthObject );
    this.viewer.earth = earth;

    var that = this;

    document.getElementById("earth-logo").onclick = function(){
	if(that.light){
	    document.getElementById("main").style.display = "none";
	    document.getElementById("earth-section").style.display = "block";
	    document.getElementById("main-nav").style.display = "none";

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

	    document.getElementsByTagName("body")[0].style.backgroundColor = "#030303";
	}
	else{
	    document.getElementById("earth-section").style.display = "none";
	    document.getElementById("main").style.display = "block";
	    document.getElementById("earth-nav").style.display = "none";
	    document.getElementById("main-nav").style.display = "block";

	    var divs = document.getElementsByClassName("light-switch");
	    for(var i = 0; i < divs.length; i++)
	    {
		divs[i].style.color = "#030303";
	    }

            document.getElementById("earth-logo").src = "/images/earth.svg";

            var imgs = document.getElementsByClassName("underline");
	    for(var i = 0; i < imgs.length; i++)
	    {
		imgs[i].src = "/images/undertitle_neg.svg";
	    }

	    document.getElementsByTagName("body")[0].style.backgroundColor = "#EEEEEE";
	}
	that.light = !that.light;
        that.viewer.resize();
    };
};

var app = new EARTH.App();
var domElement = document.getElementById('earth-div');
var width = "\"" + window.innerWidth + "px\"";
domElement.style.width = width;
var height = "\"" + window.innerHeight + "px\"";
domElement.style.height = height;
app.setDomElement(domElement);
app.setupApp();
app.viewer.render();
document.getElementById('earth-section').style.display = "none";
