// Tiletypes
// L: Land
// W: Water
// B: Blocked
// C: Land+Cube
// T: Land+Treasure
// H: Land+Home

// Objects:
// TinyBot
// BigBot

// Other:
// Gate+Button

function generateStage(stageString) {
    return new Stage(stageString);
}

var Stage = function(stageString) {
    jsonStart = stageString.search('{');
    mapData = stageString.substring(0, jsonStart).split('\n');

    // Determine sizeX and sizeY
    var tileData = [];
    var sizeY = 0;
    var sizeX = 0;
    for (var i=0; i<mapData.length; ++i) {
        if (mapData[i].length != 0) {
            var line = mapData[i].trim();
            tileData.push(line);
            if (sizeX == 0) {
                sizeX = line.length;
            } else if (line.length != sizeX) {
                throw "Inconsistent map width";
            }
            sizeY += 1;
        }
    }
    data = JSON.parse(stageString.substring(jsonStart));

    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.tiles = new Array(this.sizeY);
    for (var y=0; y<this.sizeY; ++y) {
        this.tiles[y] = new Array(this.sizeX);
    }
    this.objects = new Array(this.sizeY);
    for (var y=0; y<this.sizeY; ++y) {
        this.objects[y] = new Array(this.sizeX);
    }

    this.homeX = -1;
    this.homeY = -1;
    var treasurePlaced = false;

    for (var y=0; y<this.sizeY; ++y) {
        for (var x=0; x<this.sizeX; ++x) {
            switch(mapData[y][x]) {
            case 'L':
                this.tiles[y][x] = TILE_LAND;
                this.objects[y][x] = OBJECT_NONE;
                break;
            case 'W':
                this.tiles[y][x] = TILE_WATER;
                this.objects[y][x] = OBJECT_NONE;
                break;
            case 'B':
                this.tiles[y][x] = TILE_BLOCK;
                this.objects[y][x] = OBJECT_NONE;
                break;
            case 'H':
                this.tiles[y][x] = TILE_LAND;
                this.objects[y][x] = OBJECT_NONE;
                if (this.homeX != -1) {
                    throw 'More than one home tile';
                }
                this.homeX = x;
                this.homeY = y;
                break;
            case 'C':
                this.tiles[y][x] = TILE_LAND;
                this.objects[y][x] = OBJECT_CUBE;
                break;
            case 'T':
                this.tiles[y][x] = TILE_LAND;
                this.objects[y][x] = OBJECT_TREASURE;
                if (treasurePlaced) {
                    throw 'More than one treasure';
                }
                treasurePlaced = true;
                break;
            default:
                throw 'Unrecognized character \'' + mapData[y][x] + '\'';
                break;
            }
        }
    }

    if (this.homeX == -1) {
        throw 'No home tile found';
    }
    if (!treasurePlaced) {
        throw 'No treasure found';
    }

    this.gates = [];
    for (var i=0; i<data['gates'].length; ++i) {
        var g = data['gates'][i];
        if (g[0][0] < 0 || g[0][0] >= this.sizeX ||
            g[0][1] < 0 || g[0][1] >= this.sizeY ||
            g[0][2] < 0 || g[0][2] >= this.sizeX ||
            g[0][3] < 0 || g[0][3] >= this.sizeY ||
            g[1][0] < 0 || g[1][0] >= this.sizeX ||
            g[1][1] < 0 || g[1][1] >= this.sizeY) {
            throw 'Gate is out of bounds';
        }

        this.gates.push(new Gate(g[0][0],g[0][1],g[0][2],g[0][3],g[1][0],g[1][1]));
    }
    this.tinyX = data['tinybot'][0];
    this.tinyY = data['tinybot'][1];
    this.bigX = data['bigbot'][0];
    this.bigY = data['bigbot'][1];

    if (this.tinyX < 0 || this.tinyX >= this.sizeX || this.tinyY < 0 || this.tinyY >= this.sizeY) {
        throw 'TinyBot is outside of bounds';
    }
    if (this.bigX < 0 || this.bigX >= this.sizeX || this.bigY < 0 || this.bigY >= this.sizeY) {
        throw 'BigBot is outside of bounds';
    }
}

Stage.prototype = {

}