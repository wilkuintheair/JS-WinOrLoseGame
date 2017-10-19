class Game {
    constructor(canvas, images) {
        this.images = images;
        this.FPS = 1000 / 60;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    start() {
        console.log("START");
        setInterval(() => {
            this.gameLoop.apply(this);
        }, this.FPS);
    }

    gameLoop() {
        this.clear();
        this.update();
    }

    update() {
        this.draw();
    }

    draw() {
        this.context.drawImage(this.images[0], 0, 0, );
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}