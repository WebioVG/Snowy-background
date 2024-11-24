import CursorAttractor from "./CursorAttractor.js";

export default class CanvasInteractivity {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.cursorAttractor = null;
        this.isCursorAttractorEnabled = options.enableCursorAttractor || false;

        // If CursorAttractor is enabled, initialize it
        if (this.isCursorAttractorEnabled) {
            const { canvasWidth, canvasHeight } = canvas;
            this.cursorAttractor = new CursorAttractor(canvasWidth, canvasHeight);
        }

        // Initialize interactivity
        this.initInteractivity();
    }

    initInteractivity() {
        // Change cursor to pointer on hover
        this.canvas.style.cursor = "pointer";

        // Handle mouse/touch interactions if CursorAttractor is enabled
        if (this.isCursorAttractorEnabled) {
            this.canvas.addEventListener("mousedown", (event) => this.activateCursor(event));
            this.canvas.addEventListener("mousemove", (event) => this.moveCursor(event));
            this.canvas.addEventListener("mouseup", () => this.deactivateCursor());
            this.canvas.addEventListener("mouseleave", () => this.deactivateCursor());

            // Touch support
            this.canvas.addEventListener("touchstart", (event) => this.activateCursor(event.touches[0]));
            this.canvas.addEventListener("touchmove", (event) => this.moveCursor(event.touches[0]));
            this.canvas.addEventListener("touchend", () => this.deactivateCursor());
        }
    }

    activateCursor(event) {
        if (!this.cursorAttractor) return;
        this.cursorAttractor.isActive = true;
        this.canvas.style.cursor = "none"; // Hide the cursor
        this.cursorAttractor.updatePosition(event.clientX, event.clientY);
    }

    moveCursor(event) {
        if (this.cursorAttractor?.isActive) {
            this.cursorAttractor.updatePosition(event.clientX, event.clientY);
        }
    }

    deactivateCursor() {
        if (!this.cursorAttractor) return;
        this.cursorAttractor.isActive = false;
        this.canvas.style.cursor = "pointer"; // Reset to pointer
    }

    updateSnowflakes(snowflakes, meltEffects) {
        return snowflakes.filter((snowflake) => {
            const isAttracted = this.cursorAttractor?.isActive
                ? this.cursorAttractor.attractSnowflake(snowflake)
                : false;
    
            if (isAttracted && this.cursorAttractor.absorbSnowflake(snowflake, meltEffects)) {
                return false; // Remove absorbed snowflakes
            }
    
            return true; // Keep remaining snowflakes
        });
    }    

    draw(ctx) {
        this.cursorAttractor?.draw(ctx);
    }
}
