export default class UIManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.previousAbsorbedCount = 0;

        this.init();
    }

    init() {
        // Set up the UI container
        this.container = document.createElement("div");
        this.applyContainerStyle();
        document.body.appendChild(this.container);

        // Initialize with 0 absorbed snowflakes
        this.draw(0);
    }

    draw(absorbedCount) {
        if (absorbedCount > this.previousAbsorbedCount) {
            this.animateScore(absorbedCount);
            this.createSparkles();
        }
        this.container.textContent = `${absorbedCount}`;

        // Keep the previous absorbed count in memory
        this.previousAbsorbedCount = absorbedCount;
    }

    animateScore() {
        // Growing effect
        this.container.style.transform = "translateX(-50%) scale(1.5)";
        setTimeout(() => {
            this.container.style.transform = "translateX(-50%) scale(1)";
        }, 200);
    }

    createSparkles() {
        // Create and add the sparkle container
        const sparkleContainer = document.createElement("div");
        this.applySparkleContainerStyle(sparkleContainer);
        document.body.appendChild(sparkleContainer);

        // Add a random number of sparkles 
        const sparkleNumber = Math.random() * 3 + 3; // between 3 and 6 sparkles
        for (let i = 0; i < sparkleNumber; i++) {
            this.createSparkle(sparkleContainer)
        }
    }

    createSparkle(sparkleContainer) {
        const sparkle = document.createElement("div");

        // Randomize initial position and movement
        const angle = Math.random() * Math.PI * 2;
        const distanceX = Math.random() > 0.5
            ? Math.floor(Math.random() * (30)) - 60 // Generate a random number between -60 and -30
            : Math.floor(Math.random() * (30)) + 30 // Generate a random number between 30 and 60
        ;
        const distanceY = Math.random() > 0.5
            ? Math.floor(Math.random() * (20)) - 40 // Generate a random number between -40 and -20
            : Math.floor(Math.random() * (20)) + 20 // Generate a random number between 20 and 40
        ;
        const startX = Math.cos(angle) * distanceX;
        const startY = Math.sin(angle) * distanceY;
        const endX = startX * (Math.random() * 0.5 + 1);
        const endY = startY * (Math.random() + 1);

        this.applySparkleStyle(sparkle, startX, startY);

        // Animate sparkle fading out and moving outward
        setTimeout(() => {
            sparkle.style.opacity = "0";
            sparkle.style.transform = `translate(${endX}px, ${endY}px)`;
        }, 10);

        // Remove sparkle after animation
        setTimeout(() => {
            sparkleContainer.removeChild(sparkle);
            if (sparkleContainer.childElementCount === 0) {
                document.body.removeChild(sparkleContainer);
            }
        }, 500);

        sparkleContainer.appendChild(sparkle);
    }

    applyContainerStyle() {
        this.container.style.position = "absolute";
        this.container.style.bottom = "5px";
        this.container.style.left = "50%";
        this.container.style.transform = "translateX(-50%)";
        this.container.style.color = "#fff";
        this.container.style.fontFamily = "Arial, sans-serif";
        this.container.style.fontSize = "40px";
        this.container.style.fontWeight = "bold";
        this.container.style.textShadow = "0px 0px 10px rgba(255, 255, 255, 0.8)";
        this.container.style.pointerEvents = "none"; // Prevent interaction
        this.container.style.transition = "transform 0.2s ease, opacity 0.2s ease";
    }

    applySparkleContainerStyle(sparkleContainer) {
        sparkleContainer.style.position = "absolute";
        sparkleContainer.style.left = "50%";
        sparkleContainer.style.bottom = "20px";
        sparkleContainer.style.transform = "translateX(-50%)";
        sparkleContainer.style.pointerEvents = "none";
    }

    applySparkleStyle(sparkle, x, y) {
        sparkle.style.position = "absolute";
        sparkle.style.width = "5px";
        sparkle.style.height = "5px";
        sparkle.style.borderRadius = "50%";
        sparkle.style.backgroundColor = "rgba(246, 251, 0, 0.9)";
        sparkle.style.boxShadow = "0px 0px 5px rgba(255, 255, 255, 0.8)";
        sparkle.style.opacity = "1";
        sparkle.style.transition = "all 0.5s ease";
        sparkle.style.left = `${x}px`;
        sparkle.style.bottom = `${20 + y}px`;
    }

    destroy() {
        document.body.removeChild(this.container);
    }
}
