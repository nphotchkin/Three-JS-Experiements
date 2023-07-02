import * as THREE from 'three';
import { Color, Vector3 } from 'three';
import * as THREE_ADDONS from 'three-addons';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);

document.body.appendChild( renderer.domElement );

// you can do proceedrual text creation in three.js

const loader = new FontLoader();

var meshText; 

loader.load( '../public/fonts/helvetiker_bold.typeface.json', function ( font ) {

    const material = new THREE.LineBasicMaterial( { color: new THREE.Color(0xff0000) } );
	const geometry = new TextGeometry( 'Hello three.js!', {
		font: font,
		size: 8,
		height: 0.5,
		curveSegments: 1.2,
		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 0.8,
		bevelOffset: 0,
		bevelSegments: 0.5
	} );
    
    scene.add(new THREE.Line( geometry, material ));


    const material2 = new THREE.MeshBasicMaterial( { color: new THREE.Color(0x00ff00) } );
    meshText = new THREE.Mesh( geometry, material2 );
    scene.add( meshText );
} );


function animate() {
	requestAnimationFrame( animate );
    if (meshText != undefined) {
        meshText.rotation.x += 0.01;
        meshText.rotation.y += 0.01;
    }

	renderer.render( scene, camera );
}
animate();