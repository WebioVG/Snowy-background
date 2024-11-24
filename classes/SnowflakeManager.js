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
        this.snowflakes.forEach((snowflake, index) => {
            snowflake.update();
    
            // Check if the snowflake hits the snow stack
            const xPos = Math.floor(snowflake.x);
            if (snowflake.y >= snowStack.canvasHeight - snowStack.stack[xPos]) {
                // Add snowflake's contribution to the snow stack
                snowStack.distributeSnowfall(xPos, snowflake.radius);
    
                // Remove the snowflake
                this.snowflakes.splice(index, 1);
            }
    
            // Remove snowflake if it is out of bounds
            if (snowflake.isOutOfBounds()) {
                this.snowflakes.splice(index, 1);
            }
        });
    
        if (Math.random() < SnowflakeManager.ADD_SNOWFLAKE_PROBABILITY) {
            this.addSnowflake();
        }
    }    

    drawSnowflakes(ctx) {
        this.snowflakes.forEach((snowflake) => snowflake.draw(ctx));
    }
}
