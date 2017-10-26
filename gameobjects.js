TILE_LAND = 0;
TILE_WATER = 1;
TILE_BLOCK = 2;

BOT_TINY = 0;
BOT_BIG = 1;

OBJECT_NONE = 0;
OBJECT_CUBE = 1;
OBJECT_TREASURE = 2;

var GameManager = function(stage) {
    this.stage = stage;
    this.tinyBot = new Bot(BOT_TINY, stage.tinyX, stage.tinyY);
    this.bigBot = new Bot(BOT_BIG, stage.bigX, stage.bigY);
    this.currentBot = this.bigBot;
    this.objects = new Array(stage.sizeY);
    for (var y=0; y<stage.sizeY; ++y) {
        this.objects[y] = new Array(stage.sizeX);
        for (var x=0; x<stage.sizeX; ++x) {
            this.objects[y][x] = stage.objects[y][x];
        }
    }
    this.gates = [];
    for (var i=0; i<stage.gates.length; ++i) {
        var g = stage.gates[i];
        this.gates.push(new Gate(g.tile1X, g.tile1Y, g.tile2X, g.tile2Y, g.buttonX, g.buttonY));
    }

    this.spriteDrawer = new SpriteDrawer(stage.sizeX, stage.sizeY);
}

GameManager.prototype = {
    switchBot: function() {
        if (this.currentBot.botType == BOT_BIG) {
            this.currentBot = this.tinyBot;
        } else {
            this.currentBot = this.bigBot;
        }
    },

    updateControls: function() {
        if (keyClicked[16]) {
            this.switchBot();
        }
        this.currentBot.update(this);
    },

    updateObjectLocations: function() {
        var gates = this.gates;
        for (var i=0; i<gates.length; ++i) {
            var gate = gates[i];
            var isButtonPressed = this.objects[gate.buttonY][gate.buttonX] == OBJECT_CUBE;
            gate.setActive(!isButtonPressed);
        }

        if (this.objects[this.stage.homeY][this.stage.homeX] == OBJECT_TREASURE) {
            stageClear();
        }
    },

    draw: function() {
        var spriteDrawer = this.spriteDrawer;
        var stage = this.stage;
        // Draw tiles
        for (var y=0; y<stage.sizeY; ++y) {
            for (var x=0; x<stage.sizeX; ++x) {
                switch (stage.tiles[y][x]) {
                case TILE_LAND:
                    spriteDrawer.drawTile(SPRITE_LAND, x, y);
                    break;
                case TILE_WATER:
                    spriteDrawer.drawTile(SPRITE_WATER, x, y);
                    break;
                case TILE_BLOCK:
                    spriteDrawer.drawTile(SPRITE_BLOCK, x, y);
                    break;
                }
            }
        }
        spriteDrawer.drawTile(SPRITE_HOME, stage.homeX, stage.homeY);

        this.currentBot.drawActiveCircle(spriteDrawer);

        spriteDrawer.drawGrid();

        // Draw Wires
        for (var i=0; i<this.gates.length; ++i) {
            this.gates[i].drawWire(spriteDrawer);
        }

        // Draw Buttons
        for (var i=0; i<this.gates.length; ++i) {
            this.gates[i].drawButton(spriteDrawer);
        }

        // Draw objects
        for (var y=0; y<stage.sizeY; ++y) {
            for (var x=0; x<stage.sizeX; ++x) {
                switch (this.objects[y][x]) {
                case OBJECT_CUBE:
                    spriteDrawer.drawTile(SPRITE_CUBE, x, y);
                    break;
                case OBJECT_TREASURE:
                    spriteDrawer.drawTile(SPRITE_TREASURE, x, y);
                    break;
                }
            }
        }

        // Draw Bots
        this.bigBot.draw(spriteDrawer);
        this.tinyBot.draw(spriteDrawer);

        // Draw Gates
        for (var i=0; i<this.gates.length; ++i) {
            this.gates[i].drawGate(spriteDrawer);
        }
    },
}

var Gate = function(tile1X, tile1Y, tile2X, tile2Y, buttonX, buttonY) {
    this.tile1X = tile1X;
    this.tile1Y = tile1Y;
    this.tile2X = tile2X;
    this.tile2Y = tile2Y;
    this.buttonX = buttonX;
    this.buttonY = buttonY;
    this.isActive = true;
}

Gate.prototype = {
    drawWire: function(spriteDrawer) {
        var midX = (this.tile1X + this.tile2X) / 2;
        var midY = (this.tile1Y + this.tile2Y) / 2;
        var horizontal = (this.tile1X == this.tile2X);
        spriteDrawer.drawWire(this.buttonX, this.buttonY, midX, midY, horizontal);
    },

    drawButton: function(spriteDrawer) {
        spriteDrawer.drawTile(SPRITE_BUTTON, this.buttonX, this.buttonY);
    },

    drawGate: function(spriteDrawer) {
        spriteDrawer.drawGate(this.isActive, this.tile1X, this.tile1Y, this.tile2X, this.tile2Y);
    },

    setActive: function(active) {
        this.isActive = active;
    }
}


var Bot = function(botType, startX, startY) {
    this.heldObject = OBJECT_NONE;
    this.botType = botType;
    this.x = startX;
    this.y = startY;
    this.orientation = ORIENTATION_UP;
}

Bot.prototype = {
    drawActiveCircle: function(spriteDrawer) {
        spriteDrawer.drawActiveCircle(this.x, this.y);
    },

    draw: function(spriteDrawer) {
        var x = this.x;
        var y = this.y;

        if (this.botType == BOT_TINY) {
            spriteDrawer.drawTileRotated(SPRITE_TINYBOT, x, y, this.orientation);
            switch (this.heldObject) {
            case OBJECT_NONE:
                break;
            case OBJECT_CUBE:
                spriteDrawer.drawTileRotated(SPRITE_TINYBOT_CUBE, x, y, this.orientation);
                break;
            case OBJECT_TREASURE:
                spriteDrawer.drawTileRotated(SPRITE_TINYBOT_TREASURE, x, y, this.orientation);
                break;
            }
        } else {
            spriteDrawer.drawTileRotated(SPRITE_BIGBOT, x, y, this.orientation);
            switch (this.heldObject) {
            case OBJECT_NONE:
                break;
            case OBJECT_CUBE:
                spriteDrawer.drawTileRotated(SPRITE_BIGBOT_CUBE, x, y, this.orientation);
                break;
            case OBJECT_TREASURE:
                spriteDrawer.drawTileRotated(SPRITE_BIGBOT_TREASURE, x, y, this.orientation);
                break;
            }
        }
    },

    updateControls: function(gameManager) {
        // Up: 38
        // Down: 40
        // Left: 37
        // Right: 39
        // lshift: 16
        // space: 32
        // escape: 27
        // r: 82
        if (keyClicked[38]) {
            this.move(0, -1, gameManager);
            this.orientation = ORIENTATION_UP;
        }
        else if (keyClicked[40]) {
            this.move(0, 1, gameManager);
            this.orientation = ORIENTATION_DOWN;
        }
        else if (keyClicked[37]) {
            this.move(-1, 0, gameManager);
            this.orientation = ORIENTATION_LEFT;
        }
        else if (keyClicked[39]) {
            this.move(1, 0, gameManager);
            this.orientation = ORIENTATION_RIGHT;
        }
        else if (keyClicked[32]) {
            this.pickUpOrDrop(gameManager);
        }
    },

    move: function(dx, dy, gameManager) {
        var newX = this.x + dx;
        var newY = this.y + dy;
        var stage = gameManager.stage;
        if (newX < 0 || newY < 0 || newX >= stage.sizeX || newY >= stage.sizeY) {
            return;
        }
        if (gameManager.stage.tiles[newY][newX] == TILE_BLOCK) {
            return;
        }
        if (this.botType == BOT_TINY && this.heldObject != OBJECT_NONE &&
            gameManager.stage.tiles[newY][newX] == TILE_WATER) {
            return;
        }
        if (this.heldObject == OBJECT_TREASURE) {
            // Check gates
            var gates = gameManager.gates;
            for (var i=0; i<gates.length; ++i) {
                var gate = gates[i];
                if (!gate.isActive) continue;
                if ((this.x == gate.tile1X && this.y == gate.tile1Y &&
                        newX == gate.tile2X && newY == gate.tile2Y) ||
                    (this.x == gate.tile2X && this.y == gate.tile2Y &&
                        newX == gate.tile1X && newY == gate.tile1Y)) {
                    return;
                }
            }
        }
        this.x = newX;
        this.y = newY;
    },

    pickUpOrDrop: function(gameManager) {
        if (gameManager.stage.tiles[this.y][this.x] != TILE_LAND) {
            return;
        }
        // swap current item with item on ground.
        var temp = this.heldObject;
        this.heldObject = gameManager.objects[this.y][this.x];
        gameManager.objects[this.y][this.x] = temp;

        gameManager.updateObjectLocations();
    },

    update: function(gameManager) {
        this.updateControls(gameManager);
    },
}