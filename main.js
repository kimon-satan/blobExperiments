

var scene = new THREE.Scene();

var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);

var startTime = new Date().getTime();
var ellapsedTime = 0;

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

var geometry = undefined;
var numPoints = 20;


camera.position.z = 500;

//mesh.rotation.x += 0.5;

function render() {
	
	renderer.render( scene, camera );

	ellapsedTime = new Date().getTime() - startTime;

	if(geometry)
	{
		var shape = new THREE.Shape();
		updateShape(shape);
		mesh.children[0].geometry = new THREE.ShapeGeometry(shape);
	}



	requestAnimationFrame( render );
	
}

render();

function updateShape(shape) {

	var verts = [];
  	var cps_a = [];
  	var cps_b = [];

  	var a = getBlobPoint(0, numPoints, 200);
   	var b = getBlobPoint(1,numPoints,200);


   for(var i = 0; i < numPoints; i++)
   {

		var ab = new THREE.Vector2(); 
		ab.subVectors(b, a);
		ab.multiplyScalar(0.5);
		var mid = new THREE.Vector2();
		mid.addVectors(a, ab);
		var flip = new THREE.Vector2();
		flip.subVectors(a , ab);

		verts.push(a);
		cps_a.push(mid);
		cps_b.push(flip);

		a = b;
    	b = getBlobPoint((i + 2)%numPoints,numPoints,200);
  	}

	shape.moveTo(verts[0].x, verts[0].y); 

	for(var i = 0; i < numPoints; i++)
	{
		var ni = (i+1)%numPoints;
		shape.bezierCurveTo(cps_a[i].x, cps_a[i].y, cps_b[ni].x , cps_b[ni].y ,verts[ni].x, verts[ni].y);
	}
}

// load a resource
loader.load(
	// resource URL
	'skin1.jpg',
	// Function when resource is loaded
	function ( texture ) {
		// do something with the texture
		var pts = [];


		for ( var i = 0; i < numPoints; i ++ ) {
			pts.push(getBlobPoint(i, numPoints, 200));
		}

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 4/1300, 4/863 );
		texture.offset.set(0.5,0.5);
	
		shape = new THREE.Shape();
		updateShape(shape);

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

function getBlobPoint(index, numPoints, radius) {

  var detune = noise.simplex2(ellapsedTime * 0.0001, index )* 0.15;
  var x = Math.sin(index/numPoints * Math.PI * 2.0) * radius   + radius * detune;
  var y = Math.cos(index/numPoints * Math.PI * 2.0) * radius  + radius * detune;

  return new THREE.Vector2(x,y);

}
