(function () {
    let data = {};
    let assetsLoader = new AssetsLoader();

    assetsLoader.load("data/data.json").then((response) => {
        data = JSON.parse(response);
        loadAssets();
    });

    function startGame(images, ui) {
        let canvas = document.getElementById("gameArea");
        let game = new Game(canvas, ui, images);
        game.start();
    }

    function loadAssets() {
        let background = "img/BG.png";
        let betLine = "img/Bet_Line.png";
        let spinButton = "img/BTN_Spin.png";
        let spinButtonDisabled = "img/BTN_Spin_d.png";
        let paths = [background, betLine, spinButton, spinButtonDisabled];

        assetsLoader.loadImages(paths).then(images => {
            let ui = new GameUI(assetsLoader.images[background],
                assetsLoader.images[betLine],
                assetsLoader.images[spinButton],
                assetsLoader.images[spinButtonDisabled]);
            let paths = [];
            for (let i = 0; i < data.symbols.length; i++) {
                let symbol = data.symbols[i];
                paths.push(symbol.src);
            }
            assetsLoader.loadImages(paths).then(images => startGame(images, ui));
        });
    }
})();