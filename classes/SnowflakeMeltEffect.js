export class SnowflakeMeltEffect {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.progress = 0; // Progress from 0 to 1
    }

    update() {
        this.progress += 0.05; // Adjust speed if needed
        return this.progress >= 1; // Return true if the effect is complete
    }

    draw(ctx) {
        const alpha = 1 - this.progress; // Fade out over time
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (1 + this.progress), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; // Fading white
        ctx.fill();
        ctx.restore();
    }
}
