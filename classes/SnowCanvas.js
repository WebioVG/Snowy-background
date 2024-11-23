import Snowflake from "./Snowflake.js";

export default class SnowCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.snowflakes = [];
        this.snowStack = new Array(this.canvas.width).fill(0);

        // Constants
        this.ADD_SNOWFLAKE_PROBABILITY = 0.5;
        this.CONTRIBUTION_SCALE = 0.5;
        this.SPREAD = 5;

        // Initialize canvas
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());

        // Start animation
        this.animate();
    }

    // Resize canvas and reset snow stack
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.snowStack = new Array(this.canvas.width).fill(0);
    }

    // Add a new snowflake
    addSnowflake() {
        const snowflake = new Snowflake(this.canvas.width, this.canvas.height);
        this.snowflakes.push(snowflake);
    }

    // Update all snowflakes
    updateSnowflakes() {
        this.snowflakes.forEach((snowflake, index) => {
            snowflake.update();
            if (this.handleCollision(snowflake, index)) return;
            if (snowflake.isOutOfBounds()) this.snowflakes.splice(index, 1);
        });

        // Add new snowflakes with some probability
        if (Math.random() < this.ADD_SNOWFLAKE_PROBABILITY) {
            this.addSnowflake();
        }
    }

    // Handle snowflake collision with the stack
    handleCollision(snowflake, index) {
        const xPos = Math.floor(snowflake.x);
        const stackHeight = this.snowStack[xPos] || 0;

        if (snowflake.y >= this.canvas.height - stackHeight) {
            this.distributeSnowfall(xPos, snowflake.radius);
            this.snowflakes.splice(index, 1); // Remove the snowflake
            return true;
        }
        return false;
    }

    // Distribute the snowflake's "volume" across the snow stack
    distributeSnowfall(xPos, radius) {
        const volume = Math.PI * Math.pow(radius, 2); // Calculate snowflake "volume"
        for (let offset = -this.SPREAD; offset <= this.SPREAD; offset++) {
            const spreadPos = xPos + offset;
            if (spreadPos >= 0 && spreadPos < this.snowStack.length) {
                const weight = 1 - Math.abs(offset) / (this.SPREAD + 1); // Weight based on distance
                this.snowStack[spreadPos] += (volume * weight * this.CONTRIBUTION_SCALE) / this.SPREAD;
            }
        }
    }

    // Smooth the snow stack
    smoothSnowStack() {
        const smoothedStack = [...this.snowStack];
        for (let x = 1; x < this.snowStack.length - 1; x++) {
            smoothedStack[x] = (this.snowStack[x - 1] + this.snowStack[x] + this.snowStack[x + 1]) / 3;
        }
        this.snowStack = smoothedStack;
    }

    // Draw the snow stack using quadratic curves
    drawSnowStack() {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);

        for (let x = 0; x < this.snowStack.length - 1; x += 2) {
            const height = this.snowStack[x];
            const nextHeight = this.snowStack[x + 1];
            const controlX = x + 1;
            const controlY = this.canvas.height - (height + nextHeight) / 2;

            this.ctx.quadraticCurveTo(controlX, controlY, x + 2, this.canvas.height - nextHeight);
        }

        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // Animation loop
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateSnowflakes();
        this.snowflakes.forEach((snowflake) => snowflake.draw(this.ctx));

        this.smoothSnowStack();
        this.drawSnowStack();

        requestAnimationFrame(() => this.animate());
    }
}
