/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ (() => {

eval("let x = 0.1, y = 0, z = 0; // Initial values\nlet sigma = 10, rho = 28, beta = 8 / 3; // Parameters\nlet defaultDT = 0.01; // Time step\nlet points = []; // Store points to draw the attractor\nlet alpha = 0.01;\nlet steps = 1;\nlet pulsation = 0;\nlet justPoints = false;\nconst gui = new dat.GUI();\n\n// Set up the object to hold all the parameters for the GUI\nconst params = {\n    sigma: 10.0,\n    rho: 28.0,\n    beta: 8.0 / 3.0,\n    dt: 0.01,\n    steps: 1,\n    pulsation: 0,\n    justPoints: false\n};\ngui.add(params, 'sigma', 0, 100).onChange(function(value) {\n    sigma = value;\n});\ngui.add(params, 'rho', 0, 100).onChange(function(value) {\n    rho = value;\n});\ngui.add(params, 'beta', 0, 10).onChange(function(value) {\n    beta = value;\n});\ngui.add(params, 'dt', 0.001, 0.02).step(0.001).onChange(function(value) {\n    defaultDT = value;\n});\ngui.add(params, 'steps', 1, 50).step(1).onChange(function(value) {\n    steps = value;\n});\ngui.add(params, 'pulsation', 0, 2).step(0.1).onChange(function(value) {\n    pulsation = value;\n});\n\nconst reset = () => {\n    points = [];\n    x = 0.1;\n    y = 0;\n    z = 0;\n}\n\ngui.add({reset: reset}, 'reset').name('Reset');\n\nfunction updateLorenz(dt, steps) {\n    for(let i = 0; i < steps; i++){\n        let dx = sigma * (y - x) * dt;\n        let dy = (x * (rho - z) - y) * dt;\n        let dz = (x * y - beta * z) * dt;\n\n        x += dx;\n        y += dy;\n        z += dz;\n        \n        points.push([x, y, z]);\n    }\n    \n    \n    \n}\n\nconst canvas = document.getElementById('canvas2D');\nconst ctx = canvas.getContext('2d');\n\nconst scaleFactor = window.devicePixelRatio || 1;\ncanvas.width = window.innerWidth / 2 * scaleFactor;  // Adjust width for higher resolution\ncanvas.height = window.innerHeight / 2 * scaleFactor; // Adjust height for higher resolution\n\nctx.linJoin = 'round';\nctx.lineCap = 'round';\n\n// Scale the 2D context to match the device pixel ratio\nctx.scale(scaleFactor, scaleFactor);\n\nfunction draw2D() {\n    ctx.clearRect(0, 0, canvas.width, canvas.height);\n    ctx.beginPath();\n\n    lineWidth = 1 + Math.sin(Date.now() / 500) * pulsation;\n    if(justPoints){\n        lineWidth = 0;\n    }\n    ctx.lineWidth = lineWidth;\n\n    points.forEach(([px, py], index) => {\n        // Scale and center the points\n        let screenX = canvas.width / 2 + px * 10;\n        let screenY = canvas.height / 2 + py * 10;\n\n        let fade = Math.min(1, alpha + (index / points.length) * 0.9);\n        ctx.strokeStyle = `rgba(0, 0, 255, ${fade})`;\n        ctx.lineTo(screenX, screenY);\n    });\n\n    \n    ctx.stroke();\n}\n\n\n\n\n\nfunction animate(){\n    updateLorenz(defaultDT,steps);\n    draw2D();\n    \n    requestAnimationFrame(animate);\n}\nconsole.log(\"running\");\nanimate();\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/main.js"]();
/******/ 	
/******/ })()
;