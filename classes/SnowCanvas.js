import SnowflakeManager from "./SnowflakeManager.js";
import CanvasInteractivity from "./CanvasInteractivity.js";
import SnowStack from "./SnowStack.js";
import GustOfWind from "./GustOfWind.js";
import UIManager from "./UIManager.js";

export default class SnowCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        // Initialize components
        this.snowflakes = new SnowflakeManager(canvas.width, canvas.height);
        this.snowStack = new SnowStack(canvas.width, canvas.height);
        this.uiManager = new UIManager(canvas);
        this.gusts = [];
        this.meltEffects = []; // Track active melt effects

        // Bind and set up resizing
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.resizeCanvas(); // Initialize size
        window.addEventListener("resize", this.resizeCanvas);

        // Set up interactivity with CursorAttractor enabled
        this.interactivity = new CanvasInteractivity(this.canvas, {
            enableCursorAttractor: true,
        });

        // Start the animation loop
        this.animate();
    }

    resizeCanvas() {
        // Update canvas dimensions
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Notify dependent components of the new size
        this.snowflakes.canvasWidth = this.canvas.width;
        this.snowflakes.canvasHeight = this.canvas.height;
        this.snowStack.canvasWidth = this.canvas.width;
        this.snowStack.canvasHeight = this.canvas.height;

        // Reset the snow stack to match the new canvas width
        this.snowStack.stack = new Array(this.canvas.width).fill(0);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Update and draw snowflakes
        this.snowflakes.updateSnowflakes(this.snowStack);
        this.snowflakes.snowflakes = this.interactivity.updateSnowflakes(
            this.snowflakes.snowflakes,
            this.meltEffects
        );
        this.snowflakes.drawSnowflakes(this.ctx);
    
        // Update and draw gusts
        this.gusts = this.gusts.filter((gust) => gust.update(this.snowflakes.snowflakes));
        this.gusts.forEach((gust) => gust.draw(this.ctx));
    
        // Update and draw melt effects
        this.meltEffects = this.meltEffects.filter((effect) => {
            const isComplete = effect.update();
            effect.draw(this.ctx);
            return !isComplete; // Keep active effects
        });
    
        // Draw the cursor attractor via interactivity
        this.interactivity.draw(this.ctx);
    
        // Check if the snowball is interacting with the snow stack
        if (this.interactivity.cursorAttractor?.isActive) {
            this.interactivity.cursorAttractor.absorbFromSnowStack(this.snowStack);
        }
    
        // Smooth and draw the snow stack
        this.snowStack.smooth();
        this.snowStack.draw(this.ctx);
    
        // Add a new gust if none are active
        if (this.gusts.length === 0 && Math.random() < 0.005) {
            this.gusts.push(GustOfWind.createRandomGust(this.canvas.width, this.canvas.height));
        }

        this.uiManager.draw(this.interactivity.cursorAttractor?.absorbedSnowflakes);
    
        requestAnimationFrame(() => this.animate());
    }    
}
