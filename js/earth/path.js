/**
 * Global namespace
 * @namespace
 */
var EARTH = EARTH || {};

/**
* The path script
* @constructor
*
*
*/
EARTH.Path = function(){

   this.textureLoader                              = new THREE.TextureLoader();

   this.uniforms                                   = {
       map:                                        { type: 't', value: this.textureLoader.load("/images/earth/star.png") }
   };

   this.shaderMaterial                             = new THREE.PointsMaterial({
       map: this.uniforms.map.value,
       transparent: true,
       blending: THREE.NormalBlending,
       size: 0.05,
       color: 0xffa265,
       alphaTest: 0.5
   });

   this.position                                   = null;
   this.geometry                                   = new THREE.Geometry();

   this.pointCloud                                 = null;
};

EARTH.Path.prototype.setup = function(){


    for(country in EARTH.countryPos.countries)
    {
        console.log(country);
        if(EARTH.countryAvailable[EARTH.countryColorMap[country]])
        {
            var lat = EARTH.countryPos.countries[country].lat;
            var lon = EARTH.countryPos.countries[country].lon;

            var phi = Math.PI/2 - lat * Math.PI / 180 - Math.PI * 0.01;
            var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;

            var r = 1.01;

            this.geometry.vertices.push(
                new THREE.Vector3(r*Math.cos(theta)*Math.sin(phi), r*Math.cos(phi), r*Math.sin(theta)*Math.sin(phi))
            );
        }
    }

    this.geometry.computeBoundingSphere();
    this.pointCloud = new THREE.Points(this.geometry, this.shaderMaterial);
};
