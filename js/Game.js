class Game {
    constructor(canvas, ui, images) {
        this.FPS = 1000 / 60;
        this.canvas = canvas;
        this.ui = ui;
        this.images = images;
        this.context = canvas.getContext("2d");
        this.container = new DisplayObjectContainer(this.context);
        this.frame = 0;
        this.animateColumns = false;
        this.patternGenerator = new PatternHelper(0, images.length, 3, 3);
        this.startPattern = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
        this.finishPattern = this.patternGenerator.getRandomPattern();
        this.setupUI(ui);
        this.createColumns(images);
        this.canvas.addEventListener("click", (event) => {
            this.container.click(event.clientX, event.clientY);
        });
    }

    setupUI(ui) {
        this.container.addChild(ui);
        ui.spinButton.onclick = () => {
            if (ui.spinButtonEnabled) {
                this.start();
            }
        }
    }

    createColumns() {
        this.column1 = new DisplayObjectContainer(this.context);
        this.column1.x = 80;
        this.column1.y = 20;
        this.createColumn(this.column1, this.startPattern[0], this.finishPattern[0]);
        this.container.addChild(this.column1);

        this.column2 = new DisplayObjectContainer(this.context);
        this.column2.x = 320;
        this.column2.y = 20;
        this.createColumn(this.column2, this.startPattern[1], this.finishPattern[1]);
        this.container.addChild(this.column2);

        this.column3 = new DisplayObjectContainer(this.context);
        this.column3.x = 560;
        this.column3.y = 20;
        this.createColumn(this.column3, this.startPattern[2], this.finishPattern[2]);
        this.container.addChild(this.column3);
    }

    createColumn(container, startPattern, finishPattern) {
        this.addImage(container, this.images[startPattern[0]]);
        this.addImage(container, this.images[startPattern[1]]);
        this.addImage(container, this.images[startPattern[2]]);
        for (let i = 0; i < 30; i++) {
            let random = Math.floor(Math.random() * this.images.length);
            let image = this.images[random];
            this.addImage(container, image);
        }
        this.addImage(container, this.images[finishPattern[0]]);
        this.addImage(container, this.images[finishPattern[1]]);
        this.addImage(container, this.images[finishPattern[2]]);
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

    initialize() {
        setInterval(() => {
            this.gameLoop.apply(this);
        }, this.FPS);
    }

    reset() {
        this.ui.spinButtonEnabled = true;
        this.startPattern = this.finishPattern;
        this.finishPattern = this.patternGenerator.getWinPattern();
        this.container.removeChild(this.column1);
        this.container.removeChild(this.column2);
        this.container.removeChild(this.column3);
        this.createColumns();
    }

    start() {
        this.animateColumns = true;
        this.ui.spinButtonEnabled = false;
    }

    gameLoop() {
        this.frame++;
        this.clear();
        this.update();
        this.draw();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update() {
        let minY = this.canvas.height - this.column1.height - 20;
        if (this.animateColumns) {
            this.column1.y -= 50;
            this.column2.y -= 50;
            this.column3.y -= 50;
        }
        if (this.animateColumns && this.column1.y < minY) {
            this.animateColumns = false;
            this.column1.y = minY;
            this.column2.y = minY;
            this.column3.y = minY;
            this.reset();
        }
        this.container.update();
    }

    draw() {
        this.container.draw();
    }
}

class GameUI extends DisplayObjectContainer {
    constructor(context, background, betLine, spinButtonDefault, spinButtonDisabled) {
        super(context);
        this._background = new ImageDisplayObject(context, background);
        this._betLine = new ImageDisplayObject(context, betLine);
        this._spinButtonDefault = new ImageDisplayObject(context, spinButtonDefault);
        this._spinButtonDisabled = new ImageDisplayObject(context, spinButtonDisabled);
        this._spinButton = new DisplayObjectContainer(context);
        this._spinButtonEnabled = true;
        this.spinButton.x = 824;
        this.spinButton.y = 218;
        this.spinButton.addChild(this._spinButtonDefault);
        this.addChild(this.background);
        this.addChild(this.spinButton);
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

    get spinButtonEnabled() {
        return this._spinButtonEnabled;
    }

    set spinButtonEnabled(value) {
        if (value && !this.spinButtonEnabled) {
            this.spinButton.removeChild(this._spinButtonDisabled);
            this.spinButton.addChild(this._spinButtonDefault);
        } else if (!value && this.spinButtonEnabled) {
            this.spinButton.removeChild(this._spinButtonDefault);
            this.spinButton.addChild(this._spinButtonDisabled);
        }
        this._spinButtonEnabled = value;
    }
}

class PatternHelper {
    constructor(winIndex, maxIndex, rows, columns) {
        this.winIndex = winIndex;
        this.maxIndex = maxIndex;
        this.rows = rows;
        this.columns = columns;
    }

    getRandomImageIndex() {
        return Math.floor(Math.random() * this.maxIndex);
    }

    getRandomPattern() {
        let pattern = [];
        for (let i = 0; i < this.columns; i++) {
            pattern.push([]);
            for (let j = 0; j < this.rows; j++) {
                pattern[i].push(this.getRandomImageIndex());
            }
        }
        return pattern;
    }

    getLosePattern() {
        let pattern = this.getRandomPattern();
        while (this.isWinPattern(pattern)) {
            pattern = this.getRandomPattern();
        }
        return pattern;
    }

    getWinPattern() {
        let pattern = this.getLosePattern();
        pattern[0][1] = this.winIndex;
        pattern[1][1] = this.winIndex;
        pattern[2][1] = this.winIndex;
        return pattern;
    }

    isWinPattern(pattern) {
        let isWin = false;
        for (let i = 0; i < this.rows; i++) {
            if (this.compareRow(pattern, i)) {
                isWin = true;
                break;
            }
        }
        return isWin;
    }

    compareRow(pattern, row) {
        let isWin = true;
        let compareValue = pattern[0][row];
        for (let i = 1; i < this.columns; i++) {
            if (pattern[i][row] !== compareValue) {
                isWin = false;
                break;
            }
        }
        return isWin;
    }
}