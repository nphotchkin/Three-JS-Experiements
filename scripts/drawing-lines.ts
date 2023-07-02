
import * as THREE from 'three';
import { Color, Vector3 } from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);

document.body.appendChild( renderer.domElement );

function animate() {
	requestAnimationFrame( animate ); 
	renderer.render( scene, camera );
}
animate();

var triangleLine = createTriangleFromLines();
scene.add(triangleLine);

var yLine = toLine(
    [ new THREE.Vector3(0, -1000, 0 ), new THREE.Vector3(0, 1000, 0 )],
    new THREE.Color(0xff0000)
);

var xLine = toLine(
    [ new THREE.Vector3(-1000, 0, 0 ), new THREE.Vector3(1000, 0, 0 )],
    new THREE.Color(0xff0000)
);

scene.add(yLine);
scene.add(xLine);

function toLine(points: Vector3[], color: Color) {
    const material = new THREE.LineBasicMaterial( { color: color } );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    return new THREE.Line( geometry, material );
}

function createTriangleFromLines() {
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    var points: Vector3[] = [];
    // note that lines are drawn threw a consecutive pairs of points
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    
    points.push( new THREE.Vector3( 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 0, 0 ) );
    
    points.push( new THREE.Vector3( -10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 0, 0 ) );
    
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    return new THREE.Line( geometry, material );
}