import { SnowflakeMeltEffect } from "./SnowflakeMeltEffect.js";

export default class CursorAttractor {
    constructor(canvasWidth, canvasHeight, debug = false) {
        this.x = canvasWidth / 2; // Initial position
        this.y = canvasHeight / 2;
        this.radius = 10; // Initial radius
        this.absorbedCount = 0; // Tracks the number of absorbed snowflakes
        this.isActive = false; // Tracks if it's currently interacting
        this.debug = debug;
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }

    attractSnowflake(snowflake) {
        // Dynamic attraction zone: scales with snowball radius
        const attractionRange = this.radius * 5; // Attraction zone is 5x the radius
        const distance = Math.sqrt(
            (snowflake.x - this.x) ** 2 + (snowflake.y - this.y) ** 2
        );
    
        if (distance > this.radius + attractionRange) return false; // Outside attraction zone
    
        // Calculate the pull toward the attractor
        const dx = this.x - snowflake.x;
        const dy = this.y - snowflake.y;
        const angle = Math.atan2(dy, dx);
    
        // Scale pull speed based on distance (closer = faster)
        const distanceFactor = Math.max(1 - distance / attractionRange, 0); // 1 at closest, 0 at farthest
        const pullSpeed = distanceFactor * this.radius / 3; // Pull speed proportional to distance and snowball size
    
        // Apply the pull
        snowflake.x += Math.cos(angle) * pullSpeed;
        snowflake.y += Math.sin(angle) * pullSpeed;
    
        return true; // Snowflake is attracted
    }
    

    absorbSnowflake(snowflake, meltEffects) {
        // Collision check: absorb if the snowflake touches the circle
        const distance = Math.sqrt(
            (snowflake.x - this.x) ** 2 + (snowflake.y - this.y) ** 2
        );
        if (distance <= this.radius) {
            this.absorbedCount++;
            if (this.absorbedCount % 10 === 0) {
                this.radius += 1; // Increase radius every 10 snowflakes
            }

            // Add a melt effect
            meltEffects.push(
                new SnowflakeMeltEffect(snowflake.x, snowflake.y, snowflake.radius)
            );

            return true; // Snowflake absorbed
        }
        return false; // No absorption
    }

    drawSnowTexture(ctx) {
        // Add snowflake-like texture
        const textureDensity = Math.floor(this.radius * 2); // Adjust density based on snowball size
        for (let i = 0; i < textureDensity; i++) {
            const offsetX = Math.random() * this.radius * 2 - this.radius;
            const offsetY = Math.random() * this.radius * 2 - this.radius;
            const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);
            if (distance <= this.radius) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.beginPath();
                ctx.arc(this.x + offsetX, this.y + offsetY, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawSnowAccumulation(ctx) {
        // Add snow accumulation texture
        ctx.save();
        const particleCount = Math.floor(this.radius * 1.5); // More particles for larger snowball
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.radius;
            const particleX = this.x + Math.cos(angle) * distance;
            const particleY = this.y + Math.sin(angle) * distance;
    
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.beginPath();
            ctx.arc(particleX, particleY, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    drawAttractionZone(ctx) {
        // Draw the attraction zone
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2); // Attraction zone
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; // Faint white for attraction zone
        ctx.stroke();
        ctx.restore();
    }

    drawSnowball(ctx) {
        // Draw the snowball
        ctx.save();
        const gradient = ctx.createRadialGradient(this.x, this.y, this.radius / 2, this.x, this.y, this.radius);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Bright center
        gradient.addColorStop(1, "rgba(200, 200, 200, 1)"); // Shadow edges

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }

    draw(ctx) {
        if (!this.isActive) return;

        if (this.debug) {
            this.drawAttractionZone(ctx);
        }

        this.drawSnowball(ctx);
        this.drawSnowTexture(ctx);
        this.drawSnowAccumulation(ctx)
    }

    reset() {
        this.isActive = false;
    }
}
