class AssetsLoader {
    get data() {
        if (!this._data) {
            this._data = {};
        }
        return this._data;
    }

    get images() {
        if (!this._images) {
            this._images = {};
        }
        return this._images;
    }

    loadImages(paths) {
        let assetsLoader = this;
        let images = this.images;
        function getImage(path) {
            return new Promise((resolve, reject) => {
                assetsLoader.load(path, "blob").then(request => {
                    let img = new Image();
                    images[path] = img;
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = window.URL.createObjectURL(request);
                });
            });
        }

        return new Promise((resolve, reject) => {
            let imagePromises = [];
            for (let i = 0; i < paths.length; i++) {
                let path = paths[i];
                imagePromises.push(getImage(path));
            }

            Promise.all(imagePromises).then((images) => {
                resolve(images);
            }, reject);
        });
    }

    load(path, responseType = "") {
        let req = new XMLHttpRequest();
        this.data[path] = req;
        return new Promise(function (resolve, reject) {
            req.open('GET', path);
            req.responseType = responseType;
            req.onload = () => {
                if (req.status === 200) {
                    resolve(req.response);
                } else {
                    reject();
                }
            };
            req.onerror = () => reject();
            req.send();
        });
    }
}