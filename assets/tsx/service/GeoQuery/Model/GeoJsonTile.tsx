import {Tile} from "./Tile";

export class GeoJsonTile extends Tile {
    private _data: Object;
    private _namespace: string;

    get namespace(): string {
        return this._namespace;
    }

    set namespace(value: string) {
        this._namespace = value;
    }

    get data(): Object {
        return this._data;
    }

    set data(value: Object) {
        this._data = value;
    }
}