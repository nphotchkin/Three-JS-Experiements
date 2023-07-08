import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

let renderer, scene;
let stats, meshKnot;

var camera: THREE.PerspectiveCamera;

import * as dat from 'dat.gui';

var knotProperties = {
  rotation: 10,
  x: 0,
  y: 5,
  z: 0
}

var cameraProperties = {
    x: 0,
    y: 5,
    z: -15
}



const gui = new dat.GUI({ name: 'ThreeJS Controller'});
var knotControlsFolder = gui.addFolder('Control Knot Geometry');

knotControlsFolder.add(knotProperties, 'rotation', 1, 100, 0.1);
knotControlsFolder.add(knotProperties, 'x', -10, 10, 0.01);
knotControlsFolder.add(knotProperties, 'y', -10, 10, 0.01);
knotControlsFolder.add(knotProperties, 'z', -10, 10, 0.01);

var cameraControlsFolder = gui.addFolder('Control Camera');
cameraControlsFolder.add(cameraProperties, 'x', -10, 10, 0.01);
cameraControlsFolder.add(cameraProperties, 'y', -10, 10, 0.01);
cameraControlsFolder.add(cameraProperties, 'z', -15, 10, 0.01);


init();

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    renderer.useLegacyLights = false;
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( cameraProperties.x, cameraProperties.y, cameraProperties.z );

    scene = new THREE.Scene();

    RectAreaLightUniformsLib.init();

    const rectLight1 = new THREE.RectAreaLight( 0xff0000, 5, 4, 9 );
    rectLight1.position.set( - 5, 5, 5 );
    scene.add( rectLight1 );

    const rectLight2 = new THREE.RectAreaLight( 0x00ff00, 5, 4, 10 );
    rectLight2.position.set( 0, 5, 5 );
    scene.add( rectLight2 );

    const rectLight3 = new THREE.RectAreaLight( 0x0000ff, 5, 4, 11 );
    rectLight3.position.set( 5, 5, 5 );
    scene.add( rectLight3 );

    scene.add( new RectAreaLightHelper( rectLight1 ) );
    scene.add( new RectAreaLightHelper( rectLight2 ) );
    scene.add( new RectAreaLightHelper( rectLight3 ) );

    const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
    const matStdFloor = new THREE.MeshStandardMaterial( { color: 0xbcbcbc, roughness: 0.6, metalness: 0 } );
    const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    scene.add( mshStdFloor );

    const geoKnot = new THREE.TorusKnotGeometry( 1.5, 0.5, 200, 16 );
    const matKnot = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );
    meshKnot = new THREE.Mesh( geoKnot, matKnot );
    meshKnot.position.set( knotProperties.x, knotProperties.y, knotProperties.z );
    scene.add( meshKnot );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.copy( meshKnot.position );
    controls.update();


    window.addEventListener( 'resize', onWindowResize );

    stats = new Stats();
    document.body.appendChild( stats.dom );
}

function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = ( window.innerWidth / window.innerHeight );
    camera.updateProjectionMatrix();

}

function animation( time ) {

    meshKnot.rotation.y = knotProperties.rotation;
    meshKnot.position.set( knotProperties.x, knotProperties.y, knotProperties.z );

    camera.position.set( cameraProperties.x, cameraProperties.y, cameraProperties.z );

    renderer.render( scene, camera );

    stats.update();

}