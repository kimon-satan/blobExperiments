var scene = new THREE.Scene();
//var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
var startTime = new Date().getTime();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var loader = new THREE.TextureLoader();
var material;




var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 0, 100, 500 );
scene.add( directionalLight );

//var geometry = new THREE.BoxGeometry( width/3, width/3,  width/3 );
var mesh = new THREE.Object3D();

var geometry;

//var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );

//var cube = new THREE.Mesh( geometry, material );




//var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

//geometry.computeFaceNormals();

//var geometry = new THREE.PlaneBufferGeometry( 200, 200, 5, 5);
//var morph = new Array(geometry.attributes.position.length);
//var orig = new Array(geometry.attributes.position.length);

// var p = geometry.attributes.position.array;

// for(var i = 0; i < morph.length; i+=3)
// {
// 	orig[i] = p[i];
// 	orig[i+1] = p[i+1];
// 	orig[i+2] = p[i+2];

// 	morph[i] = 0;
// 	morph[i+1] = 0;
// 	morph[i+2] = Math.sin((i/morph.length) * Math.PI * 2) * 50;
// }


//mesh.add(new THREE.LineSegments(geometry, lineMaterial));




camera.position.z = 500;

//mesh.rotation.x += 0.5;

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );

	var ellapsedTime = new Date().getTime() - startTime;

	// var p = geometry.attributes.position.array;

	// for(var i = 0; i < p.length; i++)
	// {
	// 	p[i] = orig[i] + morph[i] * Math.sin(ellapsedTime * 0.005);
	// }

	// geometry.attributes.position.needsUpdate = true;
	// geometry.computeFaceNormals();

	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.01;
	
}
render();

// load a resource
loader.load(
	// resource URL
	'skin1.jpg',
	// Function when resource is loaded
	function ( texture ) {
		// do something with the texture
		var pts = [], count = 200;


		for ( var i = 0; i < count; i ++ ) {
			var r = 0.5 + Math.random() * 0.5;
			var l = 200;
			var a = 2 * i / count * Math.PI;
			pts.push( new THREE.Vector2 ( Math.cos( a ) * l * r, Math.sin( a ) * l * r) );
		}

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 4/1300, 4/863 );
		texture.offset.set(0.5,0.5);
	
		shape = new THREE.Shape( pts );
		geometry = new THREE.ShapeGeometry(shape);


		material = new THREE.MeshPhongMaterial( {  side: THREE.DoubleSide, map: texture} );
		mesh.add(new THREE.Mesh(geometry , material));
		scene.add(mesh);
	},
	// Function called when download progresses
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
	// Function called when download errors
	function ( xhr ) {
		console.log( 'An error happened' );
	}
);
