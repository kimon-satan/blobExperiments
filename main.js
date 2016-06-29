var scene = new THREE.Scene();
//var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//var geometry = new THREE.BoxGeometry( width/3, width/3,  width/3 );
var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

//var cube = new THREE.Mesh( geometry, material );

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );


var geometry = new THREE.Geometry();

geometry.vertices.push(
	new THREE.Vector3( -100, -100, -100 ),
	new THREE.Vector3( -100, 100, -100 ),
	new THREE.Vector3(  100, 100, -100 ),
	new THREE.Vector3( -100, -100, 100 )
);

geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

geometry.faces.push( new THREE.Face3( 0, 3, 1 ) );

geometry.computeFaceNormals();

//geometry.computeBoundingSphere();

var blob  = new THREE.Mesh(geometry, material);
blob.material.side = THREE.DoubleSide;
scene.add( blob);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 0, 100, 500 );
scene.add( directionalLight );

camera.position.z = 500;

blob.rotation.x += 0.5;

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );


	blob.rotation.y += 0.1;
}
render();