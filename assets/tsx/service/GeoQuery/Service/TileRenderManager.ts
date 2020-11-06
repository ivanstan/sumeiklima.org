import {Tile} from "../Model/Tile";

export class TileRenderManager {

    private tiles = {};

    clearRenderedTiles = () => {
        this.tiles = {};
    };

    setTileRendered = (tile: Tile) => {
        if (!this.tiles.hasOwnProperty(tile.z)) {
            this.tiles[tile.z] = {};
        }

        this.tiles[tile.z][`${tile.x}_${tile.y}`] = true;
    };

    isTileRendered = (tile: Tile) => {
        if (!this.tiles.hasOwnProperty(tile.z)) {
            return false;
        }

        return this.tiles[tile.z][`${tile.x}_${tile.y}`] === true;
    };
}