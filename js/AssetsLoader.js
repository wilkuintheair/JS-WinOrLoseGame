class AssetsLoader {
    get data() {
        if (!this._data) {
            this._data = {};
        }
        return this._data;
    }

    loadImages(paths) {
        return new Promise((resolve, reject) => {
            var imagePromises = [];
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                imagePromises.push(this.load(path, "blob"));
            }
            Promise.all(imagePromises).then(() => resolve(this.data), reject);
        });
    }

    load(path, responseType = "") {
        var req = new XMLHttpRequest();
        this.data[path] = req;
        return new Promise(function(resolve, reject) {
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