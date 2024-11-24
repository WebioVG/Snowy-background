export default class GustOfWind {
    constructor(canvasWidth, canvasHeight, direction, duration, x, y, width, height) {        
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.direction = direction; // Wind direction in degrees
        this.duration = duration; // Duration in frames
        this.x = x; // Starting position
        this.y = y; // Perimeter top
        this.width = width; // Perimeter width
        this.height = height; // 40% of the canvas height
        this.zones = Array(10).fill(0); // Divide into 10 zones
        this.framesElapsed = 0;
        this.intensity = 0; // Current intensity
        this.maxIntensity = Math.random() * 2 + 1; // Max wind strength
    }

    static createRandomGust(canvasWidth, canvasHeight) {
        const startSide = Math.random() < 0.5 ? "left" : "right";
        const allowedDirections = startSide === "left" ? [0, 45, 315] : [180, 135, 225];
        const direction = allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
        const duration = Math.random() * 300 + 180;
        const width = canvasWidth * (Math.random() * 0.7 + 0.3);
        const height = canvasHeight * (Math.random() * 0.5 + 0.5);
        const x = startSide === "left" ? 0 : canvasWidth - width;
        return new GustOfWind(canvasWidth, canvasHeight, direction, duration, x, 0, width, height);
    }

    update(snowflakes) {
        this.framesElapsed++;
        const progress = this.framesElapsed / this.duration;
    
        // Calculate intensity (ease-in, ease-out)
        if (progress < 0.5) {
            this.intensity = this.maxIntensity * (progress * 2); // Build up
        } else {
            this.intensity = this.maxIntensity * (1 - (progress - 0.5) * 2); // Fade out
        }
    
        // Update zones (active zone moves across the perimeter)
        const activeZoneIndex = Math.floor(progress * this.zones.length);
        for (let i = 0; i < this.zones.length; i++) {
            if (i <= activeZoneIndex) {
                this.zones[i] = this.intensity * ((i + 1) / this.zones.length);
            } else {
                this.zones[i] = 0; // No effect yet
            }
        }
    
        // Sort snowflakes by proximity to the gust's starting side
        const sortedSnowflakes = [...snowflakes].sort((a, b) => {
            const distanceA = this.x === 0 ? a.x : this.canvasWidth - a.x;
            const distanceB = this.x === 0 ? b.x : this.canvasWidth - b.x;
            return distanceA - distanceB;
        });
    
        // Apply effect to sorted snowflakes
        sortedSnowflakes.forEach((snowflake) => {
            if (this.isSnowflakeInside(snowflake)) {
                const relativeX = this.x === 0
                    ? snowflake.x - this.x // Left-origin gust
                    : this.x + this.width - snowflake.x; // Right-origin gust
    
                const zoneIndex = Math.floor(
                    (relativeX / this.width) * this.zones.length
                );
    
                if (zoneIndex >= 0 && zoneIndex < this.zones.length) {
                    const zoneIntensity = this.zones[zoneIndex] || 0;
                    this.applyEffect(snowflake, zoneIntensity);
                }
            }
        });
    
        // Check if the gust is over
        return this.framesElapsed < this.duration;
    }    

    isSnowflakeInside(snowflake) {
        return (
            snowflake.x >= this.x &&
            snowflake.x <= this.x + this.width &&
            snowflake.y >= this.y &&
            snowflake.y <= this.y + this.height
        );
    }    

    applyEffect(snowflake, zoneIntensity) {
        const radians = (this.direction * Math.PI) / 180;
        const xEffect = Math.cos(radians) * zoneIntensity;
        const yEffect = Math.sin(radians) * zoneIntensity;

        snowflake.x += xEffect;
        snowflake.y += yEffect;
    }

    draw(ctx) {
        // Draw the perimeter rectangle
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, 0.7)`; // White with slight transparency
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]); // Dashed line for the perimeter
    
        // Draw the perimeter rectangle
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    
        // Draw horizontal zones (divide width into 10 segments)
        const zoneWidth = this.width / this.zones.length;
        ctx.setLineDash([5, 2]); // Smaller dashes for zones
        for (let i = 1; i < this.zones.length; i++) {
            const xPos = this.x + i * zoneWidth;
            ctx.beginPath();
            ctx.moveTo(xPos, this.y);
            ctx.lineTo(xPos, this.y + this.height);
            ctx.stroke();
        }
        ctx.restore();
    
        // Draw direction arrow
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, 0.9)`; // Bright white
        ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
        ctx.lineWidth = 2;
    
        // Calculate arrow position
        const arrowX = this.x === 0 ? this.x - 20 : this.x + this.width + 20;
        const arrowY = this.y + this.height / 2; // Middle of the perimeter
    
        // Calculate arrow direction based on gust direction
        const radians = (this.direction * Math.PI) / 180;
        const arrowLength = 40;
        const arrowEndX = arrowX + Math.cos(radians) * arrowLength;
        const arrowEndY = arrowY + Math.sin(radians) * arrowLength;
    
        // Draw arrow line
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowEndX, arrowEndY);
        ctx.stroke();
    
        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(arrowEndX, arrowEndY);
        ctx.lineTo(
            arrowEndX - 10 * Math.cos(radians - Math.PI / 6),
            arrowEndY - 10 * Math.sin(radians - Math.PI / 6)
        );
        ctx.lineTo(
            arrowEndX - 10 * Math.cos(radians + Math.PI / 6),
            arrowEndY - 10 * Math.sin(radians + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    
        ctx.restore();
    }
}
