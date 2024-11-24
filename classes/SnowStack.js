export default class SnowStack {
    static SPREAD = 5;
    static MIN_CONTRIBUTION_SCALE = 0.4;
    static MAX_CONTRIBUTION_SCALE = 0.6;

    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.stack = new Array(canvasWidth).fill(0);
    }

    distributeSnowfall(xPos, radius) {
        const volume = Math.PI * Math.pow(radius, 2);
        const contributionScale = Math.random() * 
            (SnowStack.MAX_CONTRIBUTION_SCALE - SnowStack.MIN_CONTRIBUTION_SCALE) 
            + SnowStack.MIN_CONTRIBUTION_SCALE; // Random scale between MIN and MAX

        for (let offset = -SnowStack.SPREAD; offset <= SnowStack.SPREAD; offset++) {
            const spreadPos = xPos + offset;
            if (spreadPos >= 0 && spreadPos < this.stack.length) {
                const weight = 1 - Math.abs(offset) / (SnowStack.SPREAD + 1);
                this.stack[spreadPos] += (volume * weight * contributionScale) / SnowStack.SPREAD;
            }
        }
    }

    smooth() {
        const smoothedStack = [...this.stack];
        for (let x = 1; x < this.stack.length - 1; x++) {
            smoothedStack[x] = (this.stack[x - 1] + this.stack[x] + this.stack[x + 1]) / 3;
        }
        this.stack = smoothedStack;
    }

    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(0, this.canvasHeight);

        for (let x = 0; x < this.stack.length - 1; x += 2) {
            const height = this.stack[x];
            const nextHeight = this.stack[x + 1];
            const controlX = x + 1;
            const controlY = this.canvasHeight - (height + nextHeight) / 2;

            ctx.quadraticCurveTo(controlX, controlY, x + 2, this.canvasHeight - nextHeight);
        }

        ctx.lineTo(this.canvasWidth, this.canvasHeight);
        ctx.closePath();
        ctx.fill();
    }
}
