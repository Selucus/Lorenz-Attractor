let x = 0.1, y = 0, z = 0; // Initial values
let sigma = 10, rho = 28, beta = 8 / 3; // Parameters
let defaultDT = 0.01; // Time step
let points = []; // Store points to draw the attractor
let alpha = 0.01;
let steps = 1;

import * as gui from 'dat.gui';

// Set up the object to hold all the parameters for the GUI
const params = {
    sigma: 10.0,
    rho: 28.0,
    beta: 8.0 / 3.0,
    dt: 0.01,
    steps: 1
};
gui.add(params, 'sigma', 0, 100).onChange(function(value) {
    sigma = value;
});
gui.add(params, 'rho', 0, 100).onChange(function(value) {
    rho = value;
});
gui.add(params, 'beta', 0, 10).onChange(function(value) {
    beta = value;
});
gui.add(params, 'dt', 0, 1).onChange(function(value) {
    defaultDT = value;
});
gui.add(params, 'steps', 1, 50).onChange(function(value) {
    steps = value;
});


function updateLorenz(dt, steps) {
    for(let i = 0; i < steps; i++){
        let dx = sigma * (y - x) * dt;
        let dy = (x * (rho - z) - y) * dt;
        let dz = (x * y - beta * z) * dt;

        x += dx;
        y += dy;
        z += dz;
        
        points.push([x, y, z]);
    }
    
    
    
}

const canvas = document.getElementById('canvas2D');
const ctx = canvas.getContext('2d');

const scaleFactor = window.devicePixelRatio || 1;
canvas.width = window.innerWidth / 2 * scaleFactor;  // Adjust width for higher resolution
canvas.height = window.innerHeight / 2 * scaleFactor; // Adjust height for higher resolution

ctx.linJoin = 'round';
ctx.lineCap = 'round';

// Scale the 2D context to match the device pixel ratio
ctx.scale(scaleFactor, scaleFactor);

function draw2D() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    lineWidth = 1 + Math.sin(Date.now() / 500) * 0.5;
    ctx.lineWidth = lineWidth;

    points.forEach(([px, py], index) => {
        // Scale and center the points
        let screenX = canvas.width / 2 + px * 10;
        let screenY = canvas.height / 2 + py * 10;

        let fade = Math.min(1, alpha + (index / points.length) * 0.9);
        ctx.strokeStyle = `rgba(0, 0, 255, ${fade})`;
        ctx.lineTo(screenX, screenY);
    });

    
    ctx.stroke();
}





function animate(){
    updateLorenz(defaultDT,steps);
    draw2D();
    
    requestAnimationFrame(animate);
}
console.log("running");
animate();