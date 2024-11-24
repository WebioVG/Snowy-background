import SnowflakeManager from "./SnowflakeManager.js";
import SnowStack from "./SnowStack.js";
import GustOfWind from "./GustOfWind.js";

export default class SnowCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        // Initialize components
        this.snowflakes = new SnowflakeManager(canvas.width, canvas.height);
        this.snowStack = new SnowStack(canvas.width, canvas.height);
        this.gusts = [];

        // Bind and set up resizing
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.resizeCanvas(); // Initialize size
        window.addEventListener("resize", this.resizeCanvas);

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
        this.snowflakes.drawSnowflakes(this.ctx);

        // Update and draw gusts
        this.gusts = this.gusts.filter((gust) => gust.update(this.snowflakes.snowflakes));
        // @DEBUGGING: draw wind gusts
        // this.gusts.forEach((gust) => gust.draw(this.ctx));

        // Smooth and draw the snow stack
        this.snowStack.smooth();
        this.snowStack.draw(this.ctx);

        // Add a new gust if none are active
        if (this.gusts.length === 0 && Math.random() < 0.005) {
            this.gusts.push(GustOfWind.createRandomGust(this.canvas.width, this.canvas.height));
        }

        requestAnimationFrame(() => this.animate());
    }
}
