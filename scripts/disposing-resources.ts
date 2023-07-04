// Three js requires that you dispose of resources when you are done with them.
import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 200);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(5, 5, 0);

var title = document.getElementById("status");
var boxes = [] as THREE.Mesh[];

function createBoxesWithRandomPositions() {
    for (var i = -800; i < 400; i++) {
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        const box = new THREE.Mesh(geometry, material);

        if (title != null) {
            title.innerText = "Creating Boxes";
        }

        box.position.set((Math.random() * 100) + i * 0.1, (Math.random() * 100) + i * 0.1, Math.random() * 100);
        boxes.push(box);
        scene.add(box);
    }
    if (title != null) {
        title.innerText = "Boxes Loaded";
    }
}

function disposeBoxes() {
    if (title != null) {
        title.innerText = "Disposing Boxes";
    }

    var indexesToSplice = [] as number[];
    for (var i = 0; i < boxes.length; i++) {
        scene.remove(boxes[i]);
        boxes[i].geometry.dispose();

        var mat = boxes[i].material as THREE.MeshBasicMaterial;
        mat.dispose();

        indexesToSplice.push(i);
    }

    for (var i = 0; i < indexesToSplice.length; i++) {
        boxes = boxes.splice(indexesToSplice[i], 1);
    }


    if (title != null) {
        title.innerText = "Boxes Disposed";
    }
}

createBoxesWithRandomPositions();

setInterval(() => {
    createBoxesWithRandomPositions();
}, 1000);

setInterval(() => {
    disposeBoxes();
}, 15000);

function animate() {
    requestAnimationFrame(animate);

    boxes.forEach(box => {
        box.rotation.x += 0.05;
        box.rotation.y += 0.05;
    });
    document.getElementById("box-count")!.innerText = "Box Count: " + boxes.length;

    renderer.render(scene, camera);
}
animate();

