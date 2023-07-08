import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { Mesh } from 'three';

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;
let stats: Stats, meshKnot: THREE.Mesh;

init();

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    renderer.useLegacyLights = false;
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 5, -30 );

    scene = new THREE.Scene();

    RectAreaLightUniformsLib.init();

    const rectLight1 = new THREE.RectAreaLight( 0xff0000, 5, 4, 10 );
    rectLight1.position.set( - 5, 5, 5 );
    scene.add( rectLight1 );

    const rectLight2 = new THREE.RectAreaLight( 0x00ff00, 5, 4, 10 );
    rectLight2.position.set( 0, 5, 5 );
    scene.add( rectLight2 );

    const rectLight3 = new THREE.RectAreaLight( 0x0000ff, 5, 4, 10);
    rectLight3.position.set( 5, 5, 5 );
    scene.add( rectLight3 );

    scene.add( new RectAreaLightHelper( rectLight1 ) );
    scene.add( new RectAreaLightHelper( rectLight2 ) );
    scene.add( new RectAreaLightHelper( rectLight3 ) );

    const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
    const matStdFloor = new THREE.MeshStandardMaterial( { color: 0xbcbcbc, roughness: 0.6, metalness: 0 } );
    const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    scene.add( mshStdFloor );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.copy( rectLight2.position );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );

    stats = new Stats();
    document.body.appendChild( stats.dom );

}

class TorusKnotSpawner {
    meshes: Mesh[] = [];

    constructor() {}

    spawnMeshesEvery(miliseconds) {
        setInterval(()=> {
            var x = getRandomDoubleInclusive(-10, 10)
            var y = getRandomDoubleInclusive(2.5, 7.5)
            var z = getRandomDoubleInclusive(-10, 7)
            this.spawnMeshAtPosition(new THREE.Vector3(x, y, z));
        }, miliseconds)
    }

    destroyMeshesOutsideView() {
        this.meshes.forEach(mesh => {
            if (mesh.position.z < -15) {

                scene.remove(mesh);
                mesh.geometry.dispose();
        
                var mat = mesh.material as THREE.MeshBasicMaterial;
                mat.dispose();
            }
        });
    }

    moveAllMeshesTowardsCamera() {
        this.meshes.forEach(mesh => {
            mesh.position.z -= 0.1;
        });
    }

    private spawnMeshAtPosition(position: THREE.Vector3) {
        const geoKnot = new THREE.TorusKnotGeometry( 1.4, 0.5, 360, 12);
        const matKnot = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );
        meshKnot = new THREE.Mesh(geoKnot, matKnot);
        meshKnot.position.set(position.x, position.y, position.z);
        scene.add(meshKnot);
        this.meshes.push(meshKnot);
    }
}



var spawner = new TorusKnotSpawner();
spawner.spawnMeshesEvery(500);



function onWindowResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = ( window.innerWidth / window.innerHeight );
    camera.updateProjectionMatrix();
}

function animation() {
    renderer.render( scene, camera );

    spawner.moveAllMeshesTowardsCamera();
    spawner.destroyMeshesOutsideView();

    stats.update();
}

function getRandomDoubleInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min + 1) + min; // The maximum is inclusive and the minimum is inclusive
}