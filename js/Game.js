class Game {
    constructor(canvas, images) {
        this.images = images;
        this.FPS = 1000 / 60;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.container = new DisplayObjectContainer(this.context);
    }

    start() {
        setInterval(() => {
            this.gameLoop.apply(this);
        }, this.FPS);
    }

    gameLoop() {
        this.clear();
        this.update();
        this.draw();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update() {
        this.container.update();
    }

    draw() {
        this.container.draw();
    }
}