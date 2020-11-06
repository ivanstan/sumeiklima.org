import {Query} from "./Model/Query";
import {GeoJsonTile} from "./Model/GeoJsonTile";
import {Tile} from "./Model/Tile";

export class GeoQuery {
    private readonly url: string;

    // ToDo: add tile caching

    constructor(url: string) {
        this.url = url;
    }

    public async getTiles(query: Query): Promise<GeoJsonTile[]> {
        return await this.request({
            bool: {
                should: GeoQuery.getTileCollectionQuery(query.tiles),
                must: {
                    ...GeoQuery.getCondition("namespace", query.namespace),
                }
            }
        });
    }

    private async request(query: any): Promise<GeoJsonTile[]> {
        // @ts-ignore
        let response = await fetch(this.url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                query: query
            })
        });

        let data = await response.json();

        if (!data.hasOwnProperty('hits') || !data.hits.hasOwnProperty('hits')) {
            return [];
        }

        return data.hits.hits.map(hit => hit._source);
    }

    private static getTileCollectionQuery(tiles: Tile[]): Object[] {
        let tileQuery = [];

        tiles.forEach(tile => {
            tileQuery.push(GeoQuery.getTileQuery(tile))
        });

        return tileQuery;
    }

    private static getTileQuery(tile: Tile): Object {
        return {
            bool: {
                must: [
                    GeoQuery.getCondition('x', tile.x.toString()),
                    GeoQuery.getCondition('y', tile.y.toString()),
                    GeoQuery.getCondition('z', tile.z.toString()),
                ]
            }
        };
    }

    private static getCondition(property: string | number, value: string, type: string = 'term'): Object {
        let condition = {};

        condition[type] = {};
        condition[type][property] = value;

        return condition;
    }

}
