import * as THREE from 'three';
import * as YUKA from 'yuka';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;
let stats: Stats, meshKnot: THREE.Mesh;


class VectorMapper {

    static toYukaVector(threeVector3: THREE.Path[], z: number): YUKA.Vector3[] {
        var yukaPaths: YUKA.Vector3[] = [];

        threeVector3.forEach(element => {

            var points = element.getPoints();

            points.forEach(point => {
                yukaPaths.push(new YUKA.Vector3(point.x, point.y, z));
            });
        });

        return yukaPaths;
    }

    static toThreeVector(yukaVector3: YUKA.Vector3): THREE.Vector3 {
        return new THREE.Vector3(yukaVector3.x, yukaVector3.y, yukaVector3.z);
    }
}

class PathingAgentConfiguration {
    positionsToFollow: YUKA.Vector3[];
    maxSpeed: number;
    loopPath: boolean;
}

class PathFollowingAgent {

    entityManager = new YUKA.EntityManager();
    time = new YUKA.Time();
    vehicle = new YUKA.Vehicle();
    path: YUKA.Path = new YUKA.Path();

    pathingAgentConfiguration: PathingAgentConfiguration;
    
    constructor(pathingObject: PathingAgentConfiguration) {
        this.pathingAgentConfiguration = pathingObject;
        this.vehicle.maxSpeed = pathingObject.maxSpeed;
        this.path.loop = pathingObject.loopPath;
        
        pathingObject.positionsToFollow.forEach(element => {
            this.path.add(element);
        });
        this.setup();
    }

  
    // call this in your game loop
    followPath() {
        const delta = this.time.update().getDelta();
        this.entityManager.update(delta);
    }


    private setup() {
        const vehicleGeometry = new THREE.ConeGeometry( 0.1, 0.5, 8 );
        vehicleGeometry.rotateX( Math.PI * 0.5 );
        const vehicleMaterial = new THREE.MeshNormalMaterial();
    
        const vehicleMesh = new THREE.Mesh( vehicleGeometry, vehicleMaterial );
        vehicleMesh.matrixAutoUpdate = false;
        scene.add( vehicleMesh );

        this.vehicle.maxSpeed = this.pathingAgentConfiguration.maxSpeed;
        this.vehicle.position.copy( this.path.current() );

        // use "FollowPathBehavior" for basic path following
        const followPathBehavior = new YUKA.FollowPathBehavior( this.path, 0.5 );
        this.vehicle.steering.add( followPathBehavior );

        // use "OnPathBehavior" to realize a more strict path following.
        // it's a separate steering behavior to provide more flexibility.
        var onPathBehavior = new YUKA.OnPathBehavior( this.path );
        this.vehicle.steering.add( onPathBehavior );


        this.vehicle.setRenderComponent(vehicleMesh, this.sync);
        this.entityManager.add(this.vehicle);
    }

    private sync(entity, renderComponent) {
        renderComponent.matrix.copy( entity.worldMatrix );
    }

}


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



var quadraticPaths = [
    aQuadraticCurveConvergingToCenter(-20, 5, 0, 5),
    aQuadraticCurveConvergingToCenter(-15, 5, 0, 5),
    aQuadraticCurveConvergingToCenter(-10, 5, 0, 5),
    aQuadraticCurveConvergingToCenter(-5, 5, 0, 5),
    aQuadraticCurveConvergingToCenter(20, 5, 0, 5),
    aQuadraticCurveConvergingToCenter(15, 5, 0, 5),
    aQuadraticCurveConvergingToCenter(10, 5, 0, 5),
    aQuadraticCurveConvergingToCenter(5, 5, 0, 5)
];




var yukaPaths = VectorMapper.toYukaVector(quadraticPaths, 5);

console.log(yukaPaths)
var pathingAgent = new PathFollowingAgent({
    positionsToFollow: yukaPaths,
    maxSpeed: 2,
    loopPath: true
});


pathingAgent.followPath();

function aQuadraticCurveConvergingToCenter(startX, startY, endX, endY): THREE.Path {
    const path = new THREE.Path();
    path.quadraticCurveTo(startX, startY, endX, endY);

    const points = path.getPoints();
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    const line = new THREE.Line( geometry, material );
    scene.add( line );

    return path;
}

spawnSphereAtPosition(new THREE.Vector3(0, 5, 0));

function spawnSphereAtPosition(position: THREE.Vector3) {
    const geoKnot = new THREE.SphereGeometry( 0.2, 32, 16 );
    const matKnot = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );
    matKnot.transparent = true;
    matKnot.opacity = 1; // fully visible
    meshKnot = new THREE.Mesh(geoKnot, matKnot);


    meshKnot.position.set(position.x, position.y, position.z);
    scene.add(meshKnot);
}

function onWindowResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = ( window.innerWidth / window.innerHeight );
    camera.updateProjectionMatrix();
}

function animation() {
    renderer.render( scene, camera );
    pathingAgent.followPath();

    stats.update();
}
