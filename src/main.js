let x = 0.1, y = 0, z = 0; // Initial values
let sigma = 10, rho = 28, beta = 8 / 3; // Parameters
let defaultDT = 0.01; // Time step
let points = []; // Store points to draw the attractor
let alpha = 0.01;
let steps = 1;
let pulsation = 0;
let zoom = 10;
let opacity = 1;
let justPoints = false;
let fadeOverTime = true;
const gui = new dat.GUI();

// Set up the object to hold all the parameters for the GUI
const params = {
    sigma: 10.0,
    rho: 28.0,
    beta: 8.0 / 3.0,
    dt: 0.01,
    steps: 1,
    pulsation: 0,
    zoom: 10,
    opacity: 1,
    justPoints: false,
    fadeOverTime: true
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
gui.add(params, 'dt', 0.001, 0.02).step(0.001).onChange(function(value) {
    defaultDT = value;
});
gui.add(params, 'steps', 1, 50).step(1).onChange(function(value) {
    steps = value;
});
gui.add(params, 'pulsation', 0, 2).step(0.1).onChange(function(value) {
    pulsation = value;
});
gui.add(params, 'opacity', 0.01, 1).step(0.01).onChange(function(value) {
    opacity = value;
});
gui.add(params, 'zoom', 1, 100).step(1).onChange(function(value) {
    zoom = value;
});
gui.add(params, 'justPoints').name('Draw Points Only').onChange(function(value) {
    justPoints = value; 
});
gui.add(params, 'fadeOverTime').name('Fade Over Time').onChange(function(value) {
    fadeOverTime = value; 
});


const reset = () => {
    points = [];
    x = 0.1;
    y = 0;
    z = 0;
}

gui.add({reset: reset}, 'reset').name('Reset');

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
console.log(scaleFactor);
canvas.width = window.innerWidth  * scaleFactor;  // Adjust width for higher resolution
canvas.height = window.innerHeight   * scaleFactor; // Adjust height for higher resolution

canvas.style.width = `${canvas.width / scaleFactor}px`;
canvas.style.height = `${canvas.height / scaleFactor}px`;

ctx.linJoin = 'round';
ctx.lineCap = 'round';

// Scale the 2D context to match the device pixel ratio
ctx.scale(scaleFactor, scaleFactor);

function draw2D() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    lineWidth = 1 + Math.sin(Date.now() / 500) * pulsation;
    
    ctx.lineWidth = lineWidth;
    if (justPoints) {
        points.forEach(([px, py], index) => {
            let screenX = canvas.width / 2 / scaleFactor + px * zoom;
            let screenY = canvas.height / 2 / scaleFactor + py * zoom;

            ctx.beginPath();
            ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);

            let fade = fadeOverTime ? Math.min(opacity, alpha + (index / points.length) * 0.9) : opacity;

            ctx.fillStyle = `rgba(0, 0, 255, ${fade})`;
            ctx.fill();
        });
    } else{

        ctx.beginPath();
        points.forEach(([px, py], index) => {
            // Scale and center the points
            let screenX = canvas.width / 2 / scaleFactor + px * zoom;
            let screenY = canvas.height / 2 / scaleFactor + py * zoom;

            let fade = fadeOverTime ? Math.min(opacity, alpha + (index / points.length) * 0.9) : opacity;

            ctx.strokeStyle = `rgba(251, 99, 118, ${fade})`;
            ctx.lineTo(screenX, screenY);
        });
        ctx.stroke();
    }
    
    
}





function animate(){
    updateLorenz(defaultDT,steps);
    draw2D();
    
    requestAnimationFrame(animate);
}
console.log("running");
animate();