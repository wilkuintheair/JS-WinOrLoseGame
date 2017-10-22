class Rectangle {
    constructor(x, y, width, height) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    isPointInside(x, y) {
        return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height;
    }

    setAs(rect) {
        this.x = rect.x;
        this.y = rect.y;
        this.width = rect.width;
        this.height = rect.height;
    }

    toString() {
        return `[object Rectangle(x:${this.x}, y:${this.y}, width:${this.width}, height:${this.height})]`;
    }
}

class DisplayObject {
    constructor(context) {
        this.context = context;
        this.parent = undefined;
        this.bounds = new Rectangle(0, 0, 1, 1);
        this._globalBounds = new Rectangle(0, 0, 1, 1);
        this.onclick = undefined;
    }

    get y() {
        return this.bounds.y;
    }

    set y(value) {
        this.bounds.y = value;
    }

    get height() {
        return this.bounds.height;
    }

    set height(value) {
        this.bounds.height = value;
    }

    get x() {
        return this.bounds.x;
    }

    set x(value) {
        this.bounds.x = value;
    }

    get width() {
        return this.bounds.width;
    }

    set width(value) {
        this.bounds.width = value;
    }

    get globalBounds() {
        this._globalBounds.setAs(this.bounds);
        if (this.parent) {
            this._globalBounds.x = this.bounds.x + this.parent.globalBounds.x;
            this._globalBounds.y = this.bounds.y + this.parent.globalBounds.y;
        }
        return this._globalBounds;
    }

    isPointInside(x, y) {
        return this.bounds.isPointInside(x, y);
    }

    click(x, y) {
        if (this.onclick !== undefined && this.isPointInside(x, y)) {
            this.onclick();
        }
    }

    draw() {}

    update() {}
}

class ImageDisplayObject extends DisplayObject {
    constructor(context, image) {
        super(context);
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        super.draw();
        this.context.drawImage(this.image, this.globalBounds.x, this.globalBounds.y, this.globalBounds.width, this.globalBounds.height);
    }
}

class DisplayObjectContainer extends DisplayObject {
    constructor(context) {
        super(context);
        this.displayList = [];
    }

    get numChildren() {
        return this.displayList.length;
    }

    update() {
        super.update();
        for (let i = 0; i < this.displayList.length; i++) {
            let obj = this.displayList[i];
            obj.update();
            if (this.width < obj.bounds.x + obj.bounds.width) {
                this.width = obj.bounds.x + obj.bounds.width;
            }
            if (this.height < obj.bounds.y + obj.bounds.height) {
                this.height = obj.bounds.y + obj.bounds.height;
            }
        }
    }

    click(x, y) {
        for (let i = 0; i < this.numChildren; i++) {
            let obj = this.displayList[i];
            obj.click(x, y);
        }
        super.click(x, y);
    }

    draw() {
        super.draw();
        for (let i = 0; i < this.displayList.length; i++) {
            let obj = this.displayList[i];
            obj.draw();
        }
    }

    addChild(child) {
        if (child.parent) {
            child.parent.removeChild(child);
        }
        child.parent = this;
        this.displayList.push(child);
    }

    removeChild(child) {
        child.parent = undefined;
        this.displayList.splice(this.displayList.indexOf(child), 1);
    }
}