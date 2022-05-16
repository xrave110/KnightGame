let config = {
    width: 800,
    height: 400,
    type: Phaser.AUTO,
    scene: {
        preload: gamePreload,
        create: gameCreate,
        update: gameUpdate
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 700 },
            debug: false
        }
    }


};
let knight;
let crates;
let cursors;
let game = new Phaser.Game(config);
let score = 0;
let scoreText;
let timeleftText;
let timeleftTimer;
let secondsLeft = 10;
let coinsSet = false;

let gameOver = false;

const KNIGHT_SCALING = 0.1;

function updateTimeLeft() {
    if (gameOver == true) {
        if (!coinsSet) {
            let address = prompt("Please enter your ETH address");
            if (address == null || address == "") {
                alert("User cancellede the prompt");
            }
            else {
                mintAfterGame(address, score);
                coinsSet = true;
            }
        }
        return;
    }
    secondsLeft -= 1;
    timeleftText.setText("Seconds left:" + secondsLeft);
    if (secondsLeft <= 0) {
        this.physics.pause();
        gameOver = true;
    }
}

function generateCoins() {
    let coins = this.physics.add.group({
        key: "bitcoin",
        repeat: 1,
        setXY: {
            x: Phaser.Math.Between(0, 1000),
            y: -100, //generate coin 100 pixels above the screen
            stepX: Phaser.Math.Between(30, 100)
        }
    });

    coins.children.iterate(function (child) {
        //code 
        child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.9))
    });
    this.physics.add.collider(crates, coins);
    this.physics.add.overlap(knight, coins, collectCoin, null, this);

}

function collectCoin(knight, coin) {
    coin.disableBody(true, true);
    score++;
    scoreText.setText("Bitcoin bag:" + score);
}

function gamePreload() {
    //loading assets
    console.log("The game is loading assets");
    this.load.image("knight", "assets/knight.png")
    this.load.image("crate", "assets/crate.png")
    this.load.image("background", "assets/background.png")
    this.load.image("bitcoin", "assets/bitcoin.png")

    for (let i = 1; i <= 10; i++) {
        this.load.image("run_frame_" + i.toString(), "assets/knight/run/Run (" + i.toString() + ").png")
    }
    for (let i = 1; i <= 10; i++) {
        this.load.image("idle_frame_" + i.toString(), "assets/knight/idle/Idle (" + i.toString() + ").png")
    }
}

function gameCreate() {
    // initial setup logic 

    // create background
    this.add.image(300, 150, "background");

    // create the knight
    knight = this.physics.add.sprite(100, 200, "knight");
    knight.body.setSize(270, 570, 10, 0);
    knight.scaleX = KNIGHT_SCALING;
    knight.scaleY = KNIGHT_SCALING;

    // create the crates
    crates = this.physics.add.staticGroup();

    // floor
    crates.create(40, 365, "crate");
    crates.create(120, 365, "crate");
    crates.create(200, 365, "crate");
    crates.create(280, 365, "crate");
    crates.create(360, 365, "crate");
    crates.create(440, 365, "crate");
    crates.create(520, 365, "crate");

    // platform 1
    crates.create(450, 265, "crate");
    crates.create(490, 165, "crate");
    crates.create(320, 280, "crate");

    this.anims.create({
        key: "knight_run",
        frames: [
            { key: "run_frame_1" },
            { key: "run_frame_2" },
            { key: "run_frame_3" },
            { key: "run_frame_4" },
            { key: "run_frame_5" },
            { key: "run_frame_6" },
            { key: "run_frame_7" },
            { key: "run_frame_8" },
            { key: "run_frame_9" },
            { key: "run_frame_10" }
        ],
        frameRate: 10,
        repeat: 1
    })
    this.anims.create({
        key: "knight_idle",
        frames: [
            { key: "idle_frame_1" },
            { key: "idle_frame_2" },
            { key: "idle_frame_3" },
            { key: "idle_frame_4" },
            { key: "idle_frame_5" },
            { key: "idle_frame_6" },
            { key: "idle_frame_7" },
            { key: "idle_frame_8" },
            { key: "idle_frame_9" },
            { key: "idle_frame_10" }
        ],
        frameRate: 10,
        repeat: 1
    })

    this.physics.add.collider(crates, knight);

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, "Bitcoin Bag: 0", {
        fontSize: "32px",
        fill: '#000',

    });

    timeleftText = this.add.text(16, 66, "Seconds left:" + secondsLeft, {
        fontSize: "32px",
        fill: '#f00',

    });

    let coinTimer = this.time.addEvent({
        delay: Phaser.Math.Between(700, 1300),
        callback: generateCoins,
        callbackScope: this,
        repeat: -1
    });

    timeleftTimer = this.time.addEvent({
        delay: 1000,
        callback: updateTimeLeft,
        callbackScope: this,
        repeat: -1
    });

}

function gameUpdate() {
    //monitoring inputs and telling game how to update
    //console.log("Game is updating");
    if (cursors.left.isDown) {
        knight.setVelocityX(-160);
        knight.play("knight_run", true); // tru argument is to finish the animation
        knight.flipX = true;
    }
    else if (cursors.right.isDown) {
        knight.setVelocityX(160);
        knight.play("knight_run", true);
        knight.flipX = false;
    }
    else {
        knight.setVelocityX(0);
        knight.play("knight_idle", true);
    }
    if (cursors.up.isDown && knight.body.touching.down) {
        knight.setVelocityY(-400);
    }

}


