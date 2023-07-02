import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);


document.body.appendChild( renderer.domElement );
camera.position.set( 0, 0, 10 );
camera.lookAt( 0, 0, 0 );

// Default objects are easier to use but less efficient then using buffers
// Use the builtin objects for now, more playing around trying to create a checkerboard

var width = 5;
var height = 5;

const geometry = new THREE.BoxGeometry( 5, 5, 0 );
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const redMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );

const checkerBoardGroup = new THREE.Group();
createCheckerBoard();

function createCheckerBoard() {

	for (var i = -100; i < 10; i++) {
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set( i * width, i * height, 0 );


		// cubes generated in the negative direction Y axis offset by cube size
		const cube2 = new THREE.Mesh( geometry, redMaterial );
		cube2.position.set( Math.abs(i * width) * -1, i * height, 0 );

		checkerBoardGroup.add(cube2);
		checkerBoardGroup.add(cube);
		
	}
	scene.add( checkerBoardGroup );
}


function animate() {
	requestAnimationFrame( animate ); 

	// Rotate the group
	checkerBoardGroup.rotation.x += 0.0001;
	checkerBoardGroup.rotation.y += 0.0001;

	renderer.render( scene, camera );
}
animate();





