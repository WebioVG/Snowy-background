export default class Snowflake {
    // Define constants for snowflake properties
    static MIN_RADIUS = 1;
    static MAX_RADIUS = 4; // MIN_RADIUS + 3
    
    static MIN_SPEED = 1;
    static MAX_SPEED = 3; // MIN_SPEED + 2

    static MIN_DRIFT = -0.25;
    static MAX_DRIFT = 0.25;

    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Allow snowflakes to spawn within a margin of 20% outside the viewport
        const margin = canvasWidth * 0.2; // 20% of the canvas width
        this.x = Math.random() * (canvasWidth + 2 * margin) - margin; // Range: [-margin, canvasWidth + margin]
        this.y = Math.random() * -50; // Start slightly above the viewport for a smooth appearance

        // Random properties using constants
        this.radius = Math.random() * (Snowflake.MAX_RADIUS - Snowflake.MIN_RADIUS) + Snowflake.MIN_RADIUS;
        this.speed = Math.random() * (Snowflake.MAX_SPEED - Snowflake.MIN_SPEED) + Snowflake.MIN_SPEED;

        // Adjust drift based on position (left or right spawn)
        const baseDrift = Math.random() * (Snowflake.MAX_DRIFT - Snowflake.MIN_DRIFT) + Snowflake.MIN_DRIFT;
        this.drift = baseDrift + (this.x < 0 ? 0.2 : this.x > canvasWidth ? -0.2 : 0);
    }

    update() {
        this.y += this.speed;
        this.x += this.drift;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

    isOutOfBounds() {
        const margin = this.canvasWidth * 0.2; // Match the spawn margin
        return this.y >= this.canvasHeight || this.x < -margin || this.x > this.canvasWidth + margin;
    }
}
