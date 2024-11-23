import SnowCanvas from "./classes/SnowCanvas.js";

window.addEventListener('load', function() {
    const canvasRef = document.querySelector('#snowCanvas');
    
    new SnowCanvas(canvasRef);
})
