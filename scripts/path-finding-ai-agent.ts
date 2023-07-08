import * as YUKA from 'yuka';
import * as THREE from 'three';

let renderer, scene, camera;

let entityManager, time: YUKA.Time, vehicle: YUKA.Vehicle;

let onPathBehavior;

const params = {
    onPathActive: true,
    radius: 0.2
};

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

init();
animate();



function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( 0, 20, 0 );
    camera.lookAt( scene.position );


    const vehicleGeometry = new THREE.ConeGeometry( 0.1, 0.5, 8 );
    vehicleGeometry.rotateX( Math.PI * 0.5 );
    const vehicleMaterial = new THREE.MeshNormalMaterial();

    const vehicleMesh = new THREE.Mesh( vehicleGeometry, vehicleMaterial );
    vehicleMesh.matrixAutoUpdate = false;
    scene.add( vehicleMesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    // game setup

    entityManager = new YUKA.EntityManager();
    time = new YUKA.Time();
    vehicle = new YUKA.Vehicle();
    vehicle.maxSpeed = 2;


    vehicle.setRenderComponent( vehicleMesh, sync );


    var positions: AbstractVector3[] = [];

    positions.push(new AbstractVector3( - 4, 0, 4 ));
    positions.push(new AbstractVector3( - 6, 0, 0 ));
    positions.push(new AbstractVector3( - 4, 0, - 4 ));
    positions.push(new AbstractVector3( 0, 0, 0 ));
    positions.push(new AbstractVector3( 4, 0, - 4 ));
    positions.push(new AbstractVector3( 6, 0, 0 ));
    positions.push(new AbstractVector3( 4, 0, 4 ));
    positions.push(new AbstractVector3( 0, 0, 6 ));


    const path: YUKA.Path = new YUKA.Path();
    path.loop = true;

    positions.forEach(v => {
        path.add(v.toYukaVector3());
    })

    vehicle.position.copy( path.current() );

    // use "FollowPathBehavior" for basic path following

    const followPathBehavior = new YUKA.FollowPathBehavior( path, 0.5 );
    vehicle.steering.add( followPathBehavior );

    // use "OnPathBehavior" to realize a more strict path following.
    // it's a separate steering behavior to provide more flexibility.

    onPathBehavior = new YUKA.OnPathBehavior( path );
    vehicle.steering.add( onPathBehavior );

    entityManager.add( vehicle );

    var points: THREE.Vector3[] = [];

    positions.forEach(v => {
        points.push(v.toThreeVector3());
    })
    
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
    const lines = new THREE.LineLoop( geometry, lineMaterial );
    scene.add( lines );
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );

    const delta = time.update().getDelta();
    entityManager.update( delta );

    renderer.render( scene, camera );
}

function sync( entity, renderComponent ) {

    renderComponent.matrix.copy( entity.worldMatrix );

}
