import Snowflake from "./Snowflake.js";

export default class SnowflakeManager {
    static ADD_SNOWFLAKE_PROBABILITY = 0.5;

    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.snowflakes = [];
    }

    addSnowflake() {
        const snowflake = new Snowflake(this.canvasWidth, this.canvasHeight);
        this.snowflakes.push(snowflake);
    }

    updateSnowflakes(snowStack) {
        this.snowflakes = this.snowflakes.filter((snowflake, index) => {
            snowflake.update();
    
            const xPos = Math.floor(snowflake.x);
    
            // Check if snowflake hits the snow stack
            if (snowflake.y >= snowStack.canvasHeight - snowStack.stack[xPos]) {
                snowStack.distributeSnowfall(xPos, snowflake.radius);
                return false; // Remove this snowflake
            }
    
            // Check if snowflake is out of bounds
            if (snowflake.isOutOfBounds()) {
                return false; // Remove this snowflake
            }
    
            return true; // Keep this snowflake
        });
    
        // Add new snowflakes
        if (Math.random() < SnowflakeManager.ADD_SNOWFLAKE_PROBABILITY) {
            this.addSnowflake();
        }
    }

    drawSnowflakes(ctx) {
        this.snowflakes.forEach((snowflake) => snowflake.draw(ctx));
    }
}
