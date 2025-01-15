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
let changeColourOverTime = false;
let colourPulsation = false;
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
    fadeOverTime: true,
    changeColourOverTime: false,
    colourPulsation: false
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
gui_colourtime = gui.add(params, 'changeColourOverTime').listen().name('Change Colour By Coordinate').onChange(function(value) {
    if(value){
        changeColourOverTime = true;
        colourPulsation = false;
    }else{
        changeColourOverTime = false;
    }
    gui_colourpulse.updateDisplay();
    
});
gui_colourpulse = gui.add(params, 'colourPulsation').listen().name('Change Colour Over Time').onChange(function(value) {
    if(value){
        changeColourOverTime = false;
        colourPulsation = true;
    }else{
        colourPulsation = false;
    }
    gui_colourtime.updateDisplay();
    
});


const reset = () => {
    points = [];
    x = 0.1;
    y = 0;
    z = 0;
    zoom = 10;
    offset = { x: 0, y: 0 };

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

// Function to resize and center canvas
function resizeCanvas() {
    canvas.width = window.innerWidth  * scaleFactor;
    canvas.height = window.innerHeight  * scaleFactor;

    // Match the visible size for CSS
    canvas.style.width = `${canvas.width / scaleFactor}px`;
    canvas.style.height = `${canvas.height / scaleFactor}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any transformations
    ctx.translate(canvas.width / 2, canvas.height / 2); // Move origin to center
    
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
ctx.linJoin = 'round';
ctx.lineCap = 'round';



// Scale the 2D context to match the device pixel ratio
ctx.scale(scaleFactor, scaleFactor);



// Variables to handle dragging
let isDragging = false;
let dragStart = { x: 0, y: 0 }; // Initial mouse position when dragging starts
let offset = { x: 0, y: 0 };    // Offset for rendering the center


canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    dragStart = { x: event.clientX, y: event.clientY }; // Store the initial mouse position
});

canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        // Calculate how much the mouse has moved
        const dx = event.clientX - dragStart.x;
        const dy = event.clientY - dragStart.y;

        // Update the offset
        offset.x += dx / zoom;
        offset.y += dy / zoom;

        // Update the drag start position to the current position
        dragStart = { x: event.clientX, y: event.clientY };
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false; // Stop dragging
});

function draw2D() {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    

    lineWidth = 1 + Math.sin(Date.now() / 500) * pulsation;
    
    ctx.lineWidth = lineWidth;
    if (justPoints) {
        points.forEach(([px, py], index) => {
            let screenX = (px + offset.x) * zoom;
            let screenY = (py + offset.y) * zoom;

            ctx.beginPath();
            ctx.arc(screenX, screenY, 1, 0, Math.PI * 2);

            let fade = fadeOverTime ? Math.min(opacity, alpha + (index / points.length) * 0.9) : opacity;
            if(!changeColourOverTime){
                ctx.fillStyle = `rgba(0, 0, 255, ${fade})`;
            }
            else{
                ctx.fillStyle = `rgba(${125 - (px * 10)}, ${125 + (py * 10)}, 125, ${fade})`;
            }
            ctx.fill();
        });
    } else{
        if (!changeColourOverTime && !colourPulsation){
            ctx.beginPath();
            points.forEach(([px, py], index) => {
                
                // Scale and center the points
                let screenX = (px + offset.x) * zoom;
                let screenY = (py + offset.y) * zoom;

                let fade = fadeOverTime ? Math.min(opacity, alpha + (index / points.length) * 0.9) : opacity;

                ctx.strokeStyle = `rgba(251, 99, 118, ${fade})`;
                
                ctx.lineTo(screenX, screenY);
        
            });
            ctx.stroke();
        }
        else if(changeColourOverTime){
            points.forEach(([px, py], index) => {
                if (index === 0) return; 
            
                
                let [prevX, prevY] = points[index - 1];
                let screenXPrev = (prevX + offset.x) * zoom;
                let screenYPrev = (prevY + offset.y) * zoom;
                let screenX = (px + offset.x) * zoom;
                let screenY = (py + offset.y) * zoom;
            
                
                let fade = fadeOverTime ? Math.min(opacity, alpha + (index / points.length) * 0.9) : opacity;
            
                
                ctx.strokeStyle = `rgba(${125 - (px * 10)}, ${125 + (py * 10)}, 125, ${fade})`;
            
                // Draw a line segment
                ctx.beginPath(); // Start a new path
                ctx.moveTo(screenXPrev, screenYPrev); // Move to the previous point
                ctx.lineTo(screenX, screenY); // Draw to the current point
                ctx.stroke(); // Stroke the segment
            });
            
        }else{
            points.forEach(([px, py], index) => {
                if (index === 0) return; 
            
                
                let [prevX, prevY] = points[index - 1];
                let screenXPrev = (prevX + offset.x) * zoom;
                let screenYPrev = (prevY + offset.y) * zoom;
                let screenX = (px + offset.x) * zoom;
                let screenY = (py + offset.y) * zoom;
            
                
                let fade = fadeOverTime ? Math.min(opacity, alpha + (index / points.length) * 0.9) : opacity;
            
                
                ctx.strokeStyle = `rgba(${125 + 125 * (Math.sin((index + 300) / 200))}, ${125 + 125 * (Math.sin((index + 600) / 300))},${125 + 125 * (Math.cos(index / 400))}, ${fade})`;
            
                // Draw a line segment
                ctx.beginPath(); // Start a new path
                ctx.moveTo(screenXPrev, screenYPrev); // Move to the previous point
                ctx.lineTo(screenX, screenY); // Draw to the current point
                ctx.stroke(); // Stroke the segment
            });
        }
        
    }
    
    
}





function animate(){
    updateLorenz(defaultDT,steps);
    draw2D();
    
    requestAnimationFrame(animate);
}
console.log("running");
animate();