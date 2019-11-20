export class TileRenderManager {

    private tiles = {};

    clearRenderedTiles = () => {
        this.tiles = {};
    };

    setTileRendered = (x, y, z) => {
        if (!this.tiles.hasOwnProperty(z)) {
            this.tiles[z] = {};
        }

        this.tiles[z][`${x}_${y}`] = true;
    };

    isTileRendered = (x, y, z) => {
        if (!this.tiles.hasOwnProperty(z)) {
            return false;
        }

        return this.tiles[z][`${x}_${y}`] === true;
    };
}