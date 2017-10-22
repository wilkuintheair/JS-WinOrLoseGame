class Game {
    constructor(canvas, ui, images) {
        this.FPS = 1000 / 60;
        this.canvas = canvas;
        this.ui = ui;
        this.images = images;
        this.context = canvas.getContext("2d");
        this.container = new DisplayObjectContainer(this.context);
        this.setupUI(ui);
        this.setupImages(images);
    }

    setupUI(ui) {
        this.container.addChild(new ImageDisplayObject(this.context, ui.background));
        this.spinButton = new ImageDisplayObject(this.context, ui.spinButtonDisabled);
        this.spinButton.x = 824;
        this.spinButton.y = 218;
        this.container.addChild(this.spinButton);
    }

    setupImages(images) {
        this.column1 = new DisplayObjectContainer(this.context);
        this.column1.x = 80;
        this.column1.y = 20;
        this.createColumn(this.column1, images);
        this.container.addChild(this.column1);

        this.column2 = new DisplayObjectContainer(this.context);
        this.column2.x = 320;
        this.column2.y = 20;
        this.createColumn(this.column2, images);
        this.container.addChild(this.column2);

        this.column3 = new DisplayObjectContainer(this.context);
        this.column3.x = 560;
        this.column3.y = 20;
        this.createColumn(this.column3, images);
        this.container.addChild(this.column3);
    }

    createColumn(container, images) {
        for (let i = 0; i < 30; i++) {
            let random = Math.floor(Math.random() * images.length);
            let image = images[random];
            this.addImage(container, image);
        }
    }

    addImage(container, image) {
        let y = container.numChildren * 180;
        let scale = .9;
        let imageDisplayObject = new ImageDisplayObject(this.context, image);
        imageDisplayObject.width *= scale;
        imageDisplayObject.height *= scale;
        imageDisplayObject.y = y;
        container.addChild(imageDisplayObject);
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
        this.column1.y -= 20;
        this.column2.y -= 20;
        this.column3.y -= 20;
        this.container.update();
    }

    draw() {
        this.container.draw();
    }
}

class GameUI {
    constructor(background, betLine, spinButton, spinButtonDisabled) {
        this._background = background;
        this._betLine = betLine;
        this._spinButton = spinButton;
        this._spinButtonDisabled = spinButtonDisabled;
    }

    get background() {
        return this._background;
    }

    get betLine() {
        return this._betLine;
    }

    get spinButton() {
        return this._spinButton;
    }
    get spinButtonDisabled() {
        return this._spinButtonDisabled;
    }
}