const canvas = document.getElementById("canvas2D");

// WebGL context to calculate points on GPU
const gl = canvas.getContext('webgl2');
if (!gl) {
    console.error('WebGL2 not supported');
}

// Initialize shaders
const vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
        gl_PointSize = 2.0; // Size of the points
        gl_Position = a_position;
    }
`;

const fragmentShaderSource = `
    precision highp float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color for points
    }
`;

// Compile shaders
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

// Create and link program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Set up Lorenz system parameters
const sigma = 10.0;
const rho = 28.0;
const beta = 8.0 / 3.0;
const dt = 0.01;
let points = []; // Array to store Lorenz attractor points

// Initial position
let x = 0.1, y = 0.0, z = 0.0;

// Function to calculate the next Lorenz attractor point
function calculateLorenz(dt) {
    let dx = sigma * (y - x) * dt;
    let dy = (x * (rho - z) - y) * dt;
    let dz = (x * y - beta * z) * dt;

    x += dx;
    y += dy;
    z += dz;

    return [x, y, z];
}

// Calculate points in JavaScript and store them
function generatePoints() {
    points = [];
    for (let i = 0; i < 10000; i++) { // Generate 10,000 points
        const point = calculateLorenz(dt);
        // Convert to normalized 2D space for visualization
        const screenX = (point[0] * 10 + canvas.width / 2) / canvas.width * 2 - 1;
        const screenY = (point[1] * 10 + canvas.height / 2) / canvas.height * 2 - 1;
        points.push(screenX, screenY, 0.0); // Store as 3D points (x, y, z) for GPU
    }
}

// Create a buffer to store points in the vertex buffer
const pointBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

// Get attribute location
const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'a_position');
gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttribLocation);

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to render the points
function renderPoints() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the points
    gl.drawArrays(gl.POINTS, 0, points.length / 3); // Divide by 3 because we store x, y, z for each point
}

// Start the loop
function animate() {
    generatePoints();
    renderPoints();
    requestAnimationFrame(animate);
}

animate();
