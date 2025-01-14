let x = 0.1, y = 0, z = 0; // Initial values
let sigma = 10, rho = 28, beta = 8 / 3; // Parameters
let defaultDT = 0.01; // Time step
let points = []; // Store points to draw the attractor

function updateLorenz(dt) {
    let dx = sigma * (y - x) * dt;
    let dy = (x * (rho - z) - y) * dt;
    let dz = (x * y - beta * z) * dt;

    x += dx;
    y += dy;
    z += dz;

    points.push([x, y, z]);
}

const canvas = document.getElementById('canvas2D');
const ctx = canvas.getContext('2d');

function draw2D() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    points.forEach(([px, py]) => {
        // Scale and center the points
        let screenX = canvas.width / 2 + px * 2;
        let screenY = canvas.height / 2 + py * 2;

        ctx.lineTo(screenX, screenY);
    });

    ctx.strokeStyle = 'blue';
    ctx.stroke();
}

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);


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




function animate(){
    updateLorenz(defaultDT);
    draw2D();
    update3D();
    requestAnimationFrame(animate);
}

animate();