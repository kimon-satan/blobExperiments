

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
	resolution: { value: new THREE.Vector2() },
	mouse:  	{value: mousePos },
	scale:      {value: 2.0, gui: true, min: 1.0, max: 10.0}
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
	uniforms.time.value = ellapsedTime;
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

        	this[property] = uniforms[property].value;
        }
    }
  }

  
};

window.onload = function() {
  var controlPanel = new ControlPanel();
  var gui = new dat.GUI();
  var events = {};
  
  for (var property in uniforms) {
  	if (uniforms.hasOwnProperty(property)) {
  		if(uniforms[property].gui){
  			events[property] = gui.add(controlPanel, property, uniforms[property].min, uniforms[property].max);
  			  events[property].onChange(function(value) {
			  console.log(value, property);
			  uniforms[property].value = value;
			});
  		}
  	}
  }



};


