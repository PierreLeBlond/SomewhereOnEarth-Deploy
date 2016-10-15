var GALLERY = GALLERY || {};

GALLERY.Image = function(){
    this.figure = document.createElement("figure");
    this.link = document.createElement("a");
    this.img = document.createElement("img");
    this.figcaption = document.createElement("figcaption");
}

GALLERY.Image.prototype.build = function(){
    this.figure.appendChild(this.link);
    this.figure.appendChild(this.figcaption);
    this.figure.itemtype = "http://scheme.org/ImageObjects";

    this.link.appendChild(this.img);
    this.link.itemprop = "contentURL";

    this.img.itemprop = "thumbnail";

    this.figcaption.itemprop = "caption description";
};

GALLERY.Image.prototype.setData = function(data){

    var link = "http://res.cloudinary.com/somewhereonearth/image/upload/a_exif/" +
	"v" + data.version + "/" + data.public_id + "." + data.format;

    this.link.href = link;
    this.link.setAttribute("data-size", data.width + "x" + data.height);

    this.img.src = link;

    if(data.context)
    {
	this.img.alt = data.context.custom.alt;

	this.figcaption.innerHTML += data.context.custom.caption;
    }
};

// Using the config function
GALLERY.cl = cloudinary.Cloudinary.new();
GALLERY.cl.config( "cloud_name", "somewhereonearth");


GALLERY.fetchPhotos = function(callback){
    var album = document.getElementById("gallery-holder").getAttribute("country");
    var url = GALLERY.cl.url(album, {format: 'json', type: 'list'});
    console.log(url);

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	    callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

GALLERY.buildGallery = function(data){
    console.log(data);
    data.resources.forEach(function(photo)
    {
	var image = new GALLERY.Image();
	image.build();
	image.setData(photo);
	document.getElementById("gallery-holder").appendChild(image.figure);
    });
}

GALLERY.fetchPhotos(GALLERY.buildGallery);
