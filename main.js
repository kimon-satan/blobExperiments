

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var width = window.innerWidth;
var height = window.innerHeight;
var canvas;
var mousePos = new THREE.Vector2(0,0);

canvas = renderer.domElement;

canvas.addEventListener("mousemove", function (e) {

    mousePos.set(e.clientX/width, e.clientY/height);

 }, false);

canvas.addEventListener("touchstart", function (e) {

    mousePos.set(e.touches[0].clientX /width, e.touches[0].clientY / height);
    //console.log(mousePos);

}, false);


camera = new THREE.Camera();
camera.position.z = 1;

scene = new THREE.Scene();


var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

var uniforms = {
  time:       { value: 1.0 },
  c_time: 		{value: 1.0 },
  o_time: 		{value: 1.0 },
  r_time: 		{value: 1.0 },
	resolution: { value: new THREE.Vector2() },
	mouse:  	{value: mousePos },

  bg_color:        {value: new THREE.Vector3(1.,1.,1.), gui: true, type: "color"},
  fg_color:        {value: new THREE.Vector3(1.,1.,1.), gui: true, type: "color"},
  hl_color:        {value: new THREE.Vector3(0.,0.,0.), gui: true, type: "color"},
  fg_pow:      {value: 1., gui: true, min: 0.01, max: 8.0},
  hl_pow:      {value: 1., gui: true, min: 0.01, max: 8.0},
  hl_mul:      {value: 4., gui: true, min: 2., max: 15.},

	scale:      {value: 2.0, gui: true, min: 1.0, max: 10.0},
	seed:      {value: 0.01, gui: true, min: 0., max: 1., step: 0.01},
	slices:      {value: 8.0, gui: true, min: 1.0, max: 20.0},
	segments:      {value: 1.0, gui: true, min: 1.0, max: 10.0},
	c_size:      {value: 0.5, gui: true, min: 0.1, max: 0.8},
  c_scale:      {value: 1.0, gui: true, min: 0.1, max: 2.0},
  c_fade:      {value: 0.01, gui: true, min: 0., max: 1., step: 0.01},
  cell_detail:      {value: 0.01, gui: true, min: 0.0, max: 4.0, step: 0.01},
  theta_warp:      {value: 1.5, gui: true, min: 0.0, max: 4.0},
  warp_skew:      {value: 1.5, gui: true, min: 0.0, max: 6.0},
  edge_freq:      {value: 0.0, gui: true, min: 0.0, max: 8.0},
  edge_amp:       {value: 0.1, gui: true, min: 0.0, max: 0.5},

  c_amp:      {value: 0.1, gui: true, min: 0.0, max: 1.0},
	o_amp:      {value: 0.1, gui: true, min: 0.0, max: 0.8}, //needs changing
  r_amp:      {value: 0.1, gui: true, min: 0.0, max: 0.8}, //needs changing


  c_freq:      {value: 1.0, gui: true, min: 0.1, max: 10.0, },
  o_freq:      {value: 1.0, gui: true, min: 0.1, max: 10.0, },
  r_freq:      {value: 1.0, gui: true, min: 0.1, max: 10.0, },

  o_step:      {value: 20.0, gui: true, min: 0.0, max: 30.0},
  o_mul:      {value: .5, gui: true, min: 0.0, max: 4.0},
  o_distort: 	{value: new THREE.Vector2(.4,2.), gui: true, min: 0.0, max: 4.0},




	cell_detune:      {value: .25, gui: true, min: 0., max: 1., step: 0.01},

};

uniforms.resolution.value.x = renderer.domElement.width;
uniforms.resolution.value.y = renderer.domElement.height;

var material = new THREE.ShaderMaterial( {
	uniforms: uniforms,
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent
} );

var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );


var startTime = new Date().getTime();
var ellapsedTime = 0;


function render() {

	ellapsedTime = (new Date().getTime() - startTime) * 0.001;
  var delta = ellapsedTime - this.uniforms.time.value;
	uniforms.time.value = ellapsedTime;

  this.uniforms.c_time.value += delta * this.uniforms.c_freq.value;
  this.uniforms.o_time.value += delta * this.uniforms.o_freq.value;
  this.uniforms.r_time.value += delta * this.uniforms.r_freq.value;

  //for another type of shake...
  //this.uniforms.cell_detune.value = .25 +  (0.5 + Math.sin(ellapsedTime) * .5 ) * Math.random() * 0.2;

	uniforms.mouse.value = mousePos;

	//console.log(ellapsedTime);

	renderer.render( scene, camera );
	requestAnimationFrame( render );

}

render();

/*----------------------------------------GUI----------------------------------------------*/

var ControlPanel = function() {

  for (var property in uniforms) {
    if (uniforms.hasOwnProperty(property)) {
        if(uniforms[property].gui){
        	if( uniforms[property].value instanceof THREE.Vector2)
        	{
				this[property + "_x"] = uniforms[property].value.x;
				this[property + "_y"] = uniforms[property].value.y;
			}
			else if(uniforms[property].type == "color")
	  		{
	  			this[property] = "#ffffff";
        	}else{
        		this[property] = uniforms[property].value;
        	}

        }
    }
  }


};

window.onload = function()
{
  var controlPanel = new ControlPanel();
  var gui = new dat.GUI();
  gui.remember(controlPanel);
  var events = {};

  for (var property in uniforms) {
  	if (uniforms.hasOwnProperty(property)) {
  		if(uniforms[property].gui){

  			if( uniforms[property].value instanceof THREE.Vector2)
        	{
        		var coord = ["x", "y"];

        		for(var i = 0; i < 2; i++)
        		{

	        		events[property + "_" + coord[i]] = gui.add(controlPanel, property + "_" + coord[i], uniforms[property].min, uniforms[property].max);

		  			events[property + "_" + coord[i]].onChange(function(value) {
		  				var key = this.property.substring(0, this.property.length - 2);
					 	uniforms[key].value[this.property.substring(this.property.length - 1)] = value;
					});

	  			}

	  		}
	  		else if(uniforms[property].type == "color")
	  		{
	  			events[property] = gui.addColor(controlPanel, property);

	  			events[property].onChange(function(value) {

	  				var col = hexToFloat(value);

					uniforms[this.property].value.x = col[0];
					uniforms[this.property].value.y = col[1];
					uniforms[this.property].value.z = col[2];

	  			});
        	}
        	else
        	{
	  			events[property] = gui.add(controlPanel, property, uniforms[property].min, uniforms[property].max);

	  			events[property].onChange(function(value) {
				  uniforms[this.property].value = value;
				});

  			}
  		}
  	}
  }








};


/////////////////////////////////HELPERS/////////////////////////////////

function hexToFloat(hex) {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        [ parseInt(result[1], 16)/255.,
         parseInt(result[2], 16)/255.,
         parseInt(result[3], 16)/255.
        ]
    	: null;
}
