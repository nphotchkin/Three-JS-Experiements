import * as YUKA from 'yuka';
import * as THREE from 'three';

class AbstractVector3 {
    x: number;
    y: number;
    z: number;
    constructor (x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toThreeVector3(): THREE.Vector3 {
        return new THREE.Vector3(this.x, this.y, this.z);
    }

    toYukaVector3(): YUKA.Vector3 {
        return new YUKA.Vector3(this.x, this.y, this.z);
    }
}

class PathingAgentConfiguration {
    positionsToFollow: AbstractVector3[];
    maxSpeed: number;
    loopPath: boolean;
}

class PathFollowingAgent {

    entityManager = new YUKA.EntityManager();
    time = new YUKA.Time();
    vehicle = new YUKA.Vehicle();
    path: YUKA.Path = new YUKA.Path();
    positionsToFollow: YUKA.Vector3[] = [];

    pathingAgentConfiguration: PathingAgentConfiguration;
    
    constructor(pathingObject: PathingAgentConfiguration) {
        this.pathingAgentConfiguration = pathingObject;
        this.vehicle.maxSpeed = pathingObject.maxSpeed;
        this.path.loop = pathingObject.loopPath;
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
        
        this.initalizePathPositions();
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


    private initalizePathPositions() {
        this.abtractVectorToYukaPath();
    }

    private abtractVectorToYukaPath() {
        this.pathingAgentConfiguration.positionsToFollow.forEach(v => {
            this.path.add(v.toYukaVector3());
        })
    }

    private sync(entity, renderComponent) {
        renderComponent.matrix.copy( entity.worldMatrix );
    }

}


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 100 );
camera.position.set( 0, 20, 0 );
camera.lookAt( scene.position );

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );


var positions: AbstractVector3[] = [];

positions.push(new AbstractVector3( - 4, 0, 4 ));
positions.push(new AbstractVector3( - 6, 0, 0 ));
positions.push(new AbstractVector3( - 4, 0, - 4 ));
positions.push(new AbstractVector3( 0, 0, 0 ));
positions.push(new AbstractVector3( 4, 0, - 4 ));
positions.push(new AbstractVector3( 6, 0, 0 ));
positions.push(new AbstractVector3( 4, 0, 4 ));
positions.push(new AbstractVector3( 0, 0, 6 ));

var pathingAgent = new PathFollowingAgent({
    positionsToFollow: positions,
    maxSpeed: 2,
    loopPath: true
});

var points: THREE.Vector3[] = [];

positions.forEach(v => {
    points.push(v.toThreeVector3());
})

const geometry = new THREE.BufferGeometry().setFromPoints( points );
const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
const lines = new THREE.LineLoop( geometry, lineMaterial );
scene.add( lines );


animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    pathingAgent.followPath();

    renderer.render( scene, camera );
}
