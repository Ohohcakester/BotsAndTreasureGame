// REGION - HTML5 CANVAS BOILERPLATE - START
var RES_X = 700;
var RES_Y = 540;
var PADDING = 10;

var MAX_SPAN_X = RES_X - 2*PADDING;
var MAX_SPAN_Y = RES_Y - 2*PADDING;

var fps = 30;
var nextFrameTime = 0;
var frameTime = 1000/fps;

// Initialisation
var mainCanvas = document.getElementById('mainCanvas');
var canvasRect = mainCanvas.getBoundingClientRect();
var ctx = mainCanvas.getContext('2d');

var win = document.getElementById('window');
window.addEventListener("keydown", keyboardPress, false);
window.addEventListener("keyup", keyboardRelease, false);
window.addEventListener("click", mouseClick, false);

mainCanvas.width = RES_X;
mainCanvas.height = RES_Y;

keyPressed = {
    38: false, // up
    40: false, // down
    37: false, // left
    39: false, // right
};
keyClicked = {
    38: false, // up
    40: false, // down
    37: false, // left
    39: false, // right
    16: false, // lshift
    32: false, // space
    27: false, // escape
    82: false, // r
}

var lastDownTarget = mainCanvas;
document.addEventListener('mousedown', function(event) {
    lastDownTarget = event.target;
}, false);

// REGION - HTML5 CANVAS BOILERPLATE - END

// REGION - GAME LOGIC - START

var game = new function() {
    this.stageString = null;
    this.stage = null;
    this.gameManager = null;
    this.stageCleared = false;
}



// REGION - GAME LOGIC - END
function initGameFromTextArea() {
    game.stageString = document.getElementById("stageTextArea").value;
    try {
        game.stage = generateStage(game.stageString);
    } catch(err) {
        errorMessage = "Error: " + err;
        console.log(errorMessage);
        document.getElementById("errorBox").innerHTML = errorMessage;
        return;
    }
    document.getElementById("errorBox").innerHTML = "";
    initGame();
}

function restartStage() {
    initGame();
}

function initGame() {
    game.stageCleared = false;
    game.gameManager = new GameManager(game.stage);
}

function stageClear() {
    console.log('YOU\'RE WINNER');
    game.stageCleared = true;
}

function withinScreen(relX, relY) {
    return relX >= 0 && relY >= 0 && relX <= RES_X && relY <= RES_Y;
}

function mouseClick(e) {
    var mouseX = e.clientX - canvasRect.left;
    var mouseY = e.clientY - canvasRect.top;
    if (!withinScreen(mouseX, mouseY)) return;
}

function keyboardPress(e) {
    if(lastDownTarget != mainCanvas) return;
    //console.log(e.keyCode);
    if (e.keyCode in keyPressed) {
        keyPressed[e.keyCode] = true;
        e.preventDefault();
    }
    if (e.keyCode in keyClicked) {
        keyClicked[e.keyCode] = true;
        e.preventDefault();
    }
}

function keyboardRelease(e) {
    if (e.keyCode in keyPressed) keyPressed[e.keyCode] = false;
}

function keyboardReset() {
    for (var key in keyClicked) {
        keyClicked[key] = false;
    }
}

function afterMove() {
    if (isType(tiles[playerY][playerX], item_goal)) {
        winGame();
    }
}

function updateFrame() {
    if (game.gameManager != null && !game.stageCleared) {
        game.gameManager.updateControls();
    }
    
    if (keyClicked[27] || keyClicked[82]) {
        // Restart Stage
        restartStage();
    }
    keyboardReset();
}

function drawFrame() {
    if (game.gameManager != null) {
        game.gameManager.draw();
        if (game.stageCleared) {
            drawTextCentered('YOU\'RE WINNER', 80, RES_X/2+4, RES_Y/2+4, '#000000');
            drawTextCentered('YOU\'RE WINNER', 80, RES_X/2, RES_Y/2, '#f0ff80');
        }
    }
}

function clearScreen(){
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.rect(0, 0, RES_X, RES_Y);
    ctx.closePath();
    ctx.fill();
};

function gameLoop(time){
    while (time > nextFrameTime) {
        while (time - nextFrameTime > frameTime*5) nextFrameTime += frameTime*5;
        // Update Frame
        updateFrame();
        nextFrameTime += frameTime;
    }

    clearScreen();
    drawFrame();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();