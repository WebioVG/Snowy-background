export default class GustOfWind {
    static MIN_DURATION = 2; // in seconds
    static MAX_DURATION = 5; // in seconds

    constructor(canvasWidth, canvasHeight, direction, duration, x, y, width, height, debug = false) {        
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.direction = direction; // Wind direction in degrees
        this.duration = duration; // Duration in frames
        this.x = x; // Starting position
        this.y = y; // Perimeter top
        this.width = width; // Perimeter width
        this.height = height; // Perimeter height
        this.zones = Array(20).fill(0); // Divide into 10 zones
        this.framesElapsed = 0;
        this.intensity = 0; // Current intensity
        this.maxIntensity = Math.random() * 2 + 1; // Max wind strength
        this.debug = debug;
        this.windLines = []; // Store wind lines
        this.maxLines = 5; // Maximum number of lines
    }

    static createRandomGust(canvasWidth, canvasHeight) {
        const startSide = Math.random() < 0.5 ? "left" : "right";
        const allowedDirections = startSide === "left" ? [0, 45, 315] : [180, 135, 225];
        const direction = allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
        const duration = Math.random() * (GustOfWind.MAX_DURATION - GustOfWind.MIN_DURATION) * 60 + GustOfWind.MIN_DURATION * 60;
        const width = canvasWidth * (Math.random() * 0.3 + 0.4);
        const height = canvasHeight;
        const x = startSide === "left" ? 0 : canvasWidth - width;
        return new GustOfWind(canvasWidth, canvasHeight, direction, duration, x, 0, width, height);
    }

    updateWindLines() {
        const progressFactor = 0.02; // Speed at which the line is drawn
    
        // Generate lines at intervals
        if (Math.random() < 0.02 && this.framesElapsed / this.duration < 0.8) {
            this.generateWindLines();
        }
    
        // Update existing lines
        this.windLines.forEach((line) => {
            // Increment progress
            line.progress = Math.min(line.progress + progressFactor, 1); // Clamp to 1 (100%)
    
            // Fade in/out effect
            if (line.fadeIn) {
                line.opacity += 0.02;
                if (line.opacity >= 0.8) line.fadeIn = false; // Switch to stable opacity
            } else {
                line.opacity -= 0.01; // Gradually fade out
            }
        });
    
        // Remove fully faded-out lines
        this.windLines = this.windLines.filter((line) => line.opacity > 0);
    }    

    update(snowflakes) {
        this.framesElapsed++;
        this.updateWindLines(); // Update lines with gust progress
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

    generateWindLines() {
        if (this.windLines.length >= this.maxLines) return;
    
        const lineLength = Math.random() * this.width * 0.2 + this.width * 0.3; // 30-50% of width
    
        // Determine the active zone range
        const progress = this.framesElapsed / this.duration;
        const activeZoneIndex = Math.floor(progress * this.zones.length);
    
        let activeStart, activeEnd;
    
        // Adjust active zone range based on wind direction
        if (this.direction === 0 || this.direction === 45 || this.direction === 315) {
            // Wind progresses left to right
            activeStart = (activeZoneIndex / this.zones.length) * this.width + this.x;
            activeEnd = ((activeZoneIndex + 1) / this.zones.length) * this.width + this.x;
        } else if (this.direction === 180 || this.direction === 135 || this.direction === 225) {
            // Wind progresses right to left
            activeStart = this.x + this.width - ((activeZoneIndex + 1) / this.zones.length) * this.width;
            activeEnd = this.x + this.width - (activeZoneIndex / this.zones.length) * this.width;
        }
    
        // Ensure `activeStart` and `activeEnd` are ordered correctly
        if (activeStart > activeEnd) [activeStart, activeEnd] = [activeEnd, activeStart];
    
        // Constrain the starting X to fall strictly within the active zone
        let constrainedStart = Math.random() * (activeEnd - activeStart) + activeStart;
    
        const offsetY = Math.random() * this.height * 0.8 + this.y; // Random y within gust height
    
        // Add a new wind line with progress
        this.windLines.push({
            startX: constrainedStart,
            length: lineLength,
            y: offsetY,
            progress: 0, // Start with no part of the line drawn
            opacity: 0, // Start fully transparent
            fadeIn: true, // Fade in initially
        });
    }
    

    draw(ctx) {
        if (this.debug) {
            this.drawDebug(ctx);
        }

        this.drawWindLines(ctx); // Draw smooth wind lines
    }

    drawDebug(ctx) {
        // Draw the perimeter rectangle
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, 0.7)`; // White with slight transparency
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]); // Dashed line for the perimeter
    
        // Draw the perimeter rectangle
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    
        // Draw horizontal zones (divide width into segments)
        const zoneWidth = this.width / this.zones.length;
        ctx.setLineDash([5, 2]); // Smaller dashes for zones
        for (let i = 1; i < this.zones.length; i++) {
            const xPos = this.x + i * zoneWidth;
            ctx.beginPath();
            ctx.moveTo(xPos, this.y);
            ctx.lineTo(xPos, this.y + this.height);
            ctx.stroke();
        }
    
        // Highlight the active zone
        const progress = this.framesElapsed / this.duration;
        let activeZoneIndex = Math.floor(progress * this.zones.length);
    
        if (this.direction === 180 || this.direction === 135 || this.direction === 225) {
            // If starting from the right, reverse the active zone progression
            activeZoneIndex = this.zones.length - 1 - activeZoneIndex;
        }
    
        const activeStartX = this.x + activeZoneIndex * zoneWidth;
        const activeEndX = activeStartX + zoneWidth;
    
        ctx.fillStyle = `rgba(255, 255, 255, 0.2)`; // Semi-transparent white
        ctx.fillRect(activeStartX, this.y, activeEndX - activeStartX, this.height);
    
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

    drawWindLines(ctx) {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, 0.7)`; // Base color
        ctx.lineWidth = 1.5;
    
        this.windLines.forEach((line) => {
            ctx.globalAlpha = line.opacity; // Set opacity
    
            const radians = (this.direction * Math.PI) / 180;
            const currentLength = line.length * line.progress; // Current length of the line
            const startX = line.startX;
            const startY = line.y;
            const endX = startX + Math.cos(radians) * currentLength;
            const endY = startY + Math.sin(radians) * currentLength;
    
            // Add a control point for the curve
            const midX = (startX + endX) / 2; // Middle of the line
            const midY = (startY + endY) / 2;
            const controlX = midX + Math.sin(radians) * 20; // Offset for curve
            const controlY = midY - Math.cos(radians) * 20; // Offset for curve
    
            // Draw the curved line
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            ctx.stroke();
        });
    
        ctx.restore();
    }
}
