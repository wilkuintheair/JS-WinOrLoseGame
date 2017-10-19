(function () {
    let data = {};
    let assetsLoader = new AssetsLoader();

    function startGame(images) {
        let canvas = document.getElementById("gameArea");
        let game = new Game(canvas, images);
        game.start();
    }

    function loadAssets() {
        let paths = ["img/Bet_Line.png", "img/BG.png", "img/BTN_Spin_d.png", "img/BTN_Spin.png"];
        for (let i = 0; i < data.symbols.length; i++) {
            let symbol = data.symbols[i];
            paths.push(symbol.src);
        }
        assetsLoader.loadImages(paths).then((response) => {
            let promises = [];
            for (let i = 0; i < data.symbols.length; i++) {
                let path = data.symbols[i].src;
                promises[i] = getImage(response[path]);
            }
            Promise.all(promises).then((images)=> {
                startGame(images);
            });
        });
    }

    function getImage(request) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = window.URL.createObjectURL(request.response);
        });
    }

    assetsLoader.load("data/data.json").then((response) => {
        data = JSON.parse(response);
        loadAssets();
    });
})();