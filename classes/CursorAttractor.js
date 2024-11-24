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

    absorbFromSnowStack(snowStack) {
        const startX = Math.floor(this.x - this.radius); // Left edge of the snowball
        const endX = Math.ceil(this.x + this.radius); // Right edge of the snowball
    
        let absorbedThisFrame = 0; // Track how much snow is absorbed in this frame
        const contributionScalingFactor = 0.2; // Scale down the snowball growth
    
        // Iterate outward from the center
        for (let offset = 0; offset <= this.radius; offset++) {
            const leftX = Math.floor(this.x - offset); // Left side from the center
            const rightX = Math.ceil(this.x + offset); // Right side from the center
    
            // Absorb snow from the left and right sides symmetrically
            [leftX, rightX].forEach((x) => {
                if (x >= 0 && x < snowStack.stack.length) {
                    const distance = Math.abs(x - this.x); // Horizontal distance to the snowball center
    
                    // Check if this part of the stack is within the snowball's edge
                    if (distance <= this.radius) {
                        const snowStackHeightAtX = snowStack.canvasHeight - snowStack.stack[x];
    
                        // Check if the snowball's bottom overlaps the snow stack's top
                        if (this.y + this.radius >= snowStackHeightAtX) {
                            // Calculate how much snow to absorb based on proximity to the center
                            const absorptionAmount = Math.ceil((this.radius - distance) / this.radius * 2);
    
                            // Decrease the snow stack height, limiting how much snow can be absorbed per frame
                            const absorbed = Math.min(absorptionAmount, snowStack.stack[x]);
                            snowStack.stack[x] -= absorbed;
                            absorbedThisFrame += absorbed;
    
                            // Stop absorbing too much snow in a single frame
                            if (absorbedThisFrame >= 10) return; // Cap absorption per frame
                        }
                    }
                }
            });
    
            // Stop processing if max absorption for this frame is reached
            if (absorbedThisFrame >= 10) break;
        }
    
        // Increase snowball radius gradually based on scaled snow absorbed
        if (absorbedThisFrame > 0) {
            this.absorbedCount += absorbedThisFrame * contributionScalingFactor; // Scale down contribution
            if (this.absorbedCount >= 200) { // Increase radius after 200 snow units absorbed
                this.radius += 1;
                this.absorbedCount = 0;
            }
        }
    
        // Smooth the snow stack after absorption
        snowStack.smooth();
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
