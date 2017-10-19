(function () {
    var data = {};
    var assetsLoader = new AssetsLoader();

    function startGame(images) {
        var canvas = document.getElementById("gameArea");
        var game = new Game(canvas, images);
        game.start();
    }

    function loadAssets() {
        var paths = ["img/Bet_Line.png", "img/BG.png", "img/BTN_Spin_d.png", "img/BTN_Spin.png"];
        for (var i = 0; i < data.symbols.length; i++) {
            var symbol = data.symbols[i];
            paths.push(symbol.src);
        }
        assetsLoader.loadImages(paths).then((response) => {
            var images = [];
            for (var i = 0; i < data.symbols.length; i++) {
                var path = data.symbols[i].src;
                images[i] = getImage(response[path]);
            }
            startGame(images);
        });
    }

    function getImage(request) {
        var img = new Image();
        img.src = window.URL.createObjectURL(request.response);
        return img;
    }

    assetsLoader.load("data/data.json").then((response) => {
        data = JSON.parse(response);
        loadAssets();
    });
})();