# Bots and Treasure Game

Another NP-COMPLETE puzzle game!

The game can be played here: https://ohohcakester.github.io/BotsAndTreasureGame/

# Instructions 

Bring the treasure back to the home tile to clear the stage!

### Bots
- You control two bots, BigBot and TinyBot.
- BigBot can carry objects over land and water.
- TinyBot can only carry objects over land.

### Objects
- Place Cubes on Buttons to deactivate Security Gates.
- You cannot pass through an active Security Gate when carrying the Treasure.
- You can pass through Security Gates otherwise. (even while carrying Cubes)

## Movement Controls:
- **Arrow Keys**: Movement
- **Space**: Pick Up or Drop Object
- **Shift**: Switch Bot

## Game Controls:
- **R or ESC**: Restart Game

# How to Create Your Own Stage:

#### The first few lines is the map tile data.
- **L**: Land
- **W**: Water
- **B**: Blocked Tile
- **C**: Cube
- **T**: Treasure
- **H**: Home Tile

The rest of the string is a json.
- `"tinyBot"`: x, y coordinates of TinyBot's starting position
- `"bigBot"`: x, y coordinates of BigBot's starting position
- `"gates"`: A list of gate/button pairs.

#### Format of a gate:
`[[t1x, t1y, t2x, t2y], [bx, by]]`
- The gate will be placed between the tiles `(t1x, t1y)` and `(t2x, t2y)`.
- The button corresponding to the gate will be placed at `(bx, by)`
