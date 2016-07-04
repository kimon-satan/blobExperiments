

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var width = window.innerWidth;
var height = window.innerHeight;



camera = new THREE.Camera();
camera.position.z = 1;

scene = new THREE.Scene();


var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

uniforms = {
	time:       { value: 1.0 },
	resolution: { value: new THREE.Vector2() }
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

	ellapsedTime = new Date().getTime() - startTime;
	uniforms.time.value = ellapsedTime;
	
	renderer.render( scene, camera );
	requestAnimationFrame( render );
	
}

render();


