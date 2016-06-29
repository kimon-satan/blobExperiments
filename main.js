var scene = new THREE.Scene();
//var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 0, 100, 500 );
scene.add( directionalLight );

//var geometry = new THREE.BoxGeometry( width/3, width/3,  width/3 );
var mesh = new THREE.Object3D();

var material = new THREE.MeshPhongMaterial( { color: 0x00aa00, side: THREE.DoubleSide, transparent: true, opacity: 0.5 } );
var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );

//var cube = new THREE.Mesh( geometry, material );

var geometry = new THREE.PlaneBufferGeometry( 200, 200, 5, 5);
var morph = new Array(geometry.attributes.position.length);
var orig = new Array(geometry.attributes.position.length);

var p = geometry.attributes.position.array;

for(var i = 0; i < morph.length; i+=3)
{
	orig[i] = p[i];
	orig[i+1] = p[i+1];
	orig[i+2] = p[i+2];

	morph[i] = 0;
	morph[i+1] = 0;
	morph[i+2] = Math.sin((i/morph.length) * Math.PI * 2) * 50;
}

geometry.computeFaceNormals();

mesh.add(new THREE.Mesh(geometry, material));
mesh.add(new THREE.LineSegments(geometry, lineMaterial));


scene.add(mesh);

camera.position.z = 500;

var startTime = new Date().getTime();

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );

	var ellapsedTime = new Date().getTime() - startTime;

	var p = geometry.attributes.position.array;

	for(var i = 0; i < p.length; i++)
	{
		p[i] = orig[i] + morph[i] * Math.sin(ellapsedTime * 0.0005);
	}

	geometry.attributes.position.needsUpdate = true;

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.01;
	
}
render();