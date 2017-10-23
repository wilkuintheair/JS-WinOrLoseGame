(function () {
    let data = {};
    let assetsLoader = new AssetsLoader();
    let canvas = undefined;
    let selectedIndex = 0;

    assetsLoader.load("data/data.json").then((response) => {
        data = JSON.parse(response);
        createSelect(data.symbols);
    });

    function createSelect(array) {
        let selectList = document.createElement("select");
        selectList.id = "mySelect";
        document.body.appendChild(selectList);
        selectList.onchange = () => {
            if (selectList.selectedIndex > 0) {
                document.body.removeChild(selectList);
                selectedIndex = selectList.selectedIndex - 1;
                createCanvas();
                loadAssets();
            }
        };

        let option = document.createElement("option");
        option.text = "Choose element";
        selectList.appendChild(option);

        for (let i = 0; i < array.length; i++) {
            let option = document.createElement("option");
            option.text = array[i].src;
            selectList.appendChild(option);
        }
    }

    function createCanvas() {
        canvas = document.createElement("canvas");
        canvas.width = 960;
        canvas.height = 536;
        document.body.appendChild(canvas);
    }

    function initializeGame(images, ui) {
        let chance = data.symbols[selectedIndex].chance;
        let game = new Game(canvas, ui, images, selectedIndex, chance);
        game.initialize();
    }

    function loadAssets() {
        let background = "img/BG.png";
        let betLine = "img/Bet_Line.png";
        let spinButton = "img/BTN_Spin.png";
        let spinButtonDisabled = "img/BTN_Spin_d.png";
        let paths = [background, betLine, spinButton, spinButtonDisabled];

        assetsLoader.loadImages(paths).then(images => {
            let ui = new GameUI(canvas.getContext("2d"),
                assetsLoader.images[background],
                assetsLoader.images[betLine],
                assetsLoader.images[spinButton],
                assetsLoader.images[spinButtonDisabled]);
            let paths = [];
            for (let i = 0; i < data.symbols.length; i++) {
                let symbol = data.symbols[i];
                paths.push(symbol.src);
            }
            assetsLoader.loadImages(paths).then(images => initializeGame(images, ui));
        });
    }
})();