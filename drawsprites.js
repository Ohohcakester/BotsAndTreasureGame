spriteSheet = new Image();
spriteSheet.src = "sprites_a.png";

var SPRITE_LAND = 0;
var SPRITE_WATER = 1;
var SPRITE_BLOCK = 2;
var SPRITE_CUBE = 3;
var SPRITE_TREASURE = 4;
var SPRITE_HOME = 5;
var SPRITE_BUTTON = 6;
var SPRITE_TINYBOT = 7;
var SPRITE_TINYBOT_CUBE = 8;
var SPRITE_TINYBOT_TREASURE = 9;
var SPRITE_BIGBOT = 10;
var SPRITE_BIGBOT_CUBE = 11;
var SPRITE_BIGBOT_TREASURE = 12;

var ORIENTATION_UP = 0;
var ORIENTATION_DOWN = 1;
var ORIENTATION_LEFT = 2;
var ORIENTATION_RIGHT = 3;

var SpriteDrawer = function(sizeX, sizeY) {
    var scaleFactor = Math.min(MAX_SPAN_X*sizeY, MAX_SPAN_Y*sizeX);
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.spanX = scaleFactor/sizeY;
    this.spanY = scaleFactor/sizeX;
    this.tileSize = this.spanX/sizeX; // = spanY/sizeY

    this.minX = (RES_X - this.spanX)/2;
    this.minY = (RES_Y - this.spanY)/2;
}

SpriteDrawer.prototype = {
    drawGrid: function() {
        for (var y=0; y<=this.sizeY; ++y) {
            var py = this.minY + this.spanY*y / this.sizeY;
            drawLine(this.minX, py, this.minX + this.spanX, py, 1, "black");
        }
        for (var x=0; x<=this.sizeX; ++x) {
            var px = this.minX + this.spanX*x / this.sizeX;
            drawLine(px, this.minY, px, this.minY + this.spanY, 1, "black");
        }
    },

    drawActiveCircle: function(x, y) {
        var px = this.minX + this.spanX*(x+0.5) / this.sizeX;
        var py = this.minY + this.spanY*(y+0.5) / this.sizeY;
        drawCircleOutline(px, py, this.tileSize/2, 5, '#ffff80');
    },

    drawTile: function(spriteType, x, y) {
        var px = this.minX + this.spanX*x / this.sizeX;
        var py = this.minY + this.spanY*y / this.sizeY;

        switch(spriteType) {
        case SPRITE_LAND:
            drawRect(px, py, this.tileSize, this.tileSize, '#f0c040')
            break;
        case SPRITE_WATER:
            drawRect(px, py, this.tileSize, this.tileSize, '#2090ff')
            break;
        case SPRITE_BLOCK:
            ctx.drawImage(spriteSheet, 0,0, 168,168, px,py, this.tileSize,this.tileSize);
            break;
        case SPRITE_CUBE:
            ctx.drawImage(spriteSheet, 0,168, 168,168, px,py, this.tileSize,this.tileSize);
            break;
        case SPRITE_TREASURE:
            ctx.drawImage(spriteSheet, 168,168, 168,168, px,py, this.tileSize,this.tileSize);
            break;
        case SPRITE_HOME:
            ctx.drawImage(spriteSheet, 168,0, 168,168, px,py, this.tileSize,this.tileSize);
            break;
        case SPRITE_BUTTON:
            ctx.drawImage(spriteSheet, 0,336, 168,168, px,py, this.tileSize,this.tileSize);
            break;
        }
    },

    drawTileRotated: function(spriteType, x, y, orientation) {
        var px = this.minX + this.spanX*x / this.sizeX;
        var py = this.minY + this.spanY*y / this.sizeY;

        switch(orientation) {
        case ORIENTATION_UP:
            angle = 0;
            break;
        case ORIENTATION_DOWN:
            angle = 3.1415926535;
            break;
        case ORIENTATION_LEFT:
            angle = 3.1415926535*3/2;
            break;
        case ORIENTATION_RIGHT:
            angle = 3.1415926535/2;
            break;
        }

        switch(spriteType) {
        case SPRITE_TINYBOT:
            drawRotatedSprite(spriteSheet, 168,336, 168,168, px,py, this.tileSize,this.tileSize, angle);
            break;
        case SPRITE_TINYBOT_CUBE:
            drawRotatedSprite(spriteSheet, 168,336, 168,168, px,py, this.tileSize,this.tileSize, angle);
            drawRotatedSprite(spriteSheet, 0,504, 168,168, px,py, this.tileSize,this.tileSize, angle);
            break;
        case SPRITE_TINYBOT_TREASURE:
            drawRotatedSprite(spriteSheet, 168,336, 168,168, px,py, this.tileSize,this.tileSize, angle);
            drawRotatedSprite(spriteSheet, 168,504, 168,168, px,py, this.tileSize,this.tileSize, angle);
            break;
        case SPRITE_BIGBOT:
            var offset = this.tileSize*0.1;
            var newTileSize = this.tileSize*1.2;
            drawRotatedSprite(spriteSheet, 655,67, 202,202, px-offset,py-offset, newTileSize,newTileSize, angle);
            break;
        case SPRITE_BIGBOT_CUBE:
            var offset = this.tileSize*0.1;
            var newTileSize = this.tileSize*1.2;
            drawRotatedSprite(spriteSheet, 655,67, 202,202, px-offset,py-offset, newTileSize,newTileSize, angle);
            drawRotatedSprite(spriteSheet, 672,336, 168,168, px,py, this.tileSize,this.tileSize, angle);
            break;
        case SPRITE_BIGBOT_TREASURE:
            var offset = this.tileSize*0.1;
            var newTileSize = this.tileSize*1.2;
            drawRotatedSprite(spriteSheet, 655,67, 202,202, px-offset,py-offset, newTileSize,newTileSize, angle);
            drawRotatedSprite(spriteSheet, 672,504, 168,168, px,py, this.tileSize,this.tileSize, angle);
            break;
        }
    },


    drawGate: function(on, x1, y1, x2, y2) {
        if (x2 < x1 || y2 < y1) {
            this.drawGate(on, x2, y2, x1, y1);
            return;
        }
        if (y1 == y2) {
            // vertical gate
            var px = this.minX + this.spanX*(x1+0.5)/this.sizeX;
            var py = this.minY + this.spanY*(y1-0.5)/this.sizeY;
            if (on) {
                ctx.drawImage(spriteSheet, 420,0, 168,336, px,py, this.tileSize,this.tileSize*2);
            } else {
                ctx.drawImage(spriteSheet, 420,336, 168,336, px,py, this.tileSize,this.tileSize*2);
            }
        } else {
            // horizontal gate
            var px = this.minX + this.spanX*(x1)/this.sizeX;
            var py = this.minY + this.spanY*(y1)/this.sizeY;
            if (on) {
                drawRotatedSprite(spriteSheet, 420,0, 168,336, px,py, this.tileSize,this.tileSize*2, 3.1415926535/2);
            } else {
                drawRotatedSprite(spriteSheet, 420,336, 168,336, px,py, this.tileSize,this.tileSize*2, 3.1415926535/2);
            }

        }
    },

    drawWire: function(sx, sy, ex, ey, horizontal) {
        var spx = this.minX +  this.spanX*(sx+0.5) / this.sizeX;
        var spy = this.minY +  this.spanY*(sy+0.7) / this.sizeY;
        var epx = this.minX +  this.spanX*(ex+0.5) / this.sizeX;
        var epy = this.minY +  this.spanY*(ey+0.5) / this.sizeY;
        drawCurve(spx, spy, epx, epy, horizontal, 2, '#00ff00');
    }
}
