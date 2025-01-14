import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
const rendererContainer = document.getElementById("container3D");
renderer.setSize(rendererContainer.innerWidth, rendererContainer.innerHeight);
rendererContainer.appendChild(renderer.domElement);


const geometry = new THREE.BufferGeometry();
const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
const points3D = [];

function update3D() {
    points3D.push(new THREE.Vector3(x, y, z));

    if (points3D.length > 5000) points3D.shift(); // Keep the array manageable
    geometry.setFromPoints(points3D);

    const line = new THREE.Line(geometry, material);
    scene.add(line);
}
