import {Tile} from "./Tile";

export class Query {
    private _tiles: Tile[];
    private _namespace: string;

    get namespace(): string {
        return this._namespace;
    }

    set namespace(value: string) {
        this._namespace = value;
    }

    get tiles(): Tile[] {
        return this._tiles;
    }

    set tiles(value: Tile[]) {
        this._tiles = value;
    }
}