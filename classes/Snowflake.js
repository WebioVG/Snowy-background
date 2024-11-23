export default class Snowflake {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = 0;
        this.radius = Math.random() * 3 + 1; // Random size
        this.speed = 2; // Random speed
        this.drift = Math.random() * 0.5 - 0.25; // Random drift
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
        return this.y >= this.canvasHeight || this.x < 0 || this.x >= this.canvasWidth;
    }
}