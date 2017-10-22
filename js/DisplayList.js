class DisplayObject {
    constructor(context) {
        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
        this.context = context;
        this.parent = undefined;
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
        let x = this.x;
        let y = this.y;
        if (this.parent !== undefined) {
            x += this.parent.x;
            y += this.parent.y;
        }
        this.context.drawImage(this.image, x, y, this.width, this.height);
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