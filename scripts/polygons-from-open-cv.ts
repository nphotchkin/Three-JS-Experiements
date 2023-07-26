import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


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


function animate() {
	requestAnimationFrame( animate ); 

	// Rotate the grou

	renderer.render( scene, camera );
}
animate();




interface Coordinate {
    x: number;
    y: number;
}
    






var poly = [
    [
        [
            287,
            169
        ]
    ],
    [
        [
            274,
            164
        ]
    ],
    [
        [
            276,
            155
        ]
    ],
    [
        [
            267,
            155
        ]
    ],
    [
        [
            259,
            163
        ]
    ],
    [
        [
            222,
            163
        ]
    ],
    [
        [
            205,
            167
        ]
    ],
    [
        [
            205,
            172
        ]
    ],
    [
        [
            231,
            176
        ]
    ],
    [
        [
            209,
            180
        ]
    ],
    [
        [
            209,
            187
        ]
    ],
    [
        [
            217,
            192
        ]
    ],
    [
        [
            253,
            194
        ]
    ],
    [
        [
            262,
            189
        ]
    ],
    [
        [
            263,
            183
        ]
    ],
    [
        [
            275,
            177
        ]
    ],
    [
        [
            286,
            177
        ]
    ]
]


// TODO GET ALL THE POLY GONES FOR A GIVEN FRAME
// AND DO THE FRAME FRAMES, MAP CV2 DATA FIRST THO
class DrawPolygyonFromOpenCvPoly {

    scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }
    
    draw(open_cv_poly) {
        var line_color =  new THREE.Color(0xff0000);

        var points = this.map(open_cv_poly);
        var line = this.toLine(points, line_color);

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.copy(points[0]);
        controls.update();
        this.scene.add(line);
    } 

    private toLine(points: Vector3[], color: THREE.Color) {
        const material = new THREE.LineBasicMaterial( { color: color } );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        return new THREE.Line( geometry, material );
    }

    private map(open_cv_poly): Vector3[] {
        var coordinates = this.openCvPolyToArray(open_cv_poly);
        return coordinates.map(c => new THREE.Vector3(c.x, c.y, 0));
    }
    
    private openCvPolyToArray(poly): Array<Coordinate> {

        var coordinates = [] as Array<Coordinate>;
        poly.forEach(array => {
            var x = array[0][0];
            var y = array[0][1];
        
            coordinates.push(
                { x: x, y: y}
            );
        })
        return coordinates;
    }
    

}

var polyDrawer = new DrawPolygyonFromOpenCvPoly(scene);
polyDrawer.draw(poly);

