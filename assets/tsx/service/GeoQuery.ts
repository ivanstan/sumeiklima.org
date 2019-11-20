export class GeoQuery {
    private readonly url: string;
    private readonly name: string;

    // ToDo: add tile caching

    constructor(url: string, name: string) {
        this.url = url;
        this.name = name;
    }

    public async getTiles(tiles) {
        let must = [];

        tiles.forEach(tile => {
            let [x, y, z] = tile;

            must.push(GeoQuery.getTileQuery(x, y, z))
        });

        return await this.search({
            bool: {
                should: must
            }
        });
    }

    public async getTile(x, y, z) {
        return await this.search(GeoQuery.getTileQuery(x, y, z));
    }

    private async search(query: any) {
        // @ts-ignore
        let response = await fetch(this.url + '/' + this.name + '/_search', {
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

        return data.hits.hits.map(hit => hit._source);
    }

    private static getTileQuery(x, y, z) {
        return {
            bool: {
                must: [
                    GeoQuery.getCondition('x', x),
                    GeoQuery.getCondition('y', y),
                    GeoQuery.getCondition('z', z),
                ]
            }
        };
    }

    private static getCondition(property: string, value: string, type: string = 'term') {
        let condition = {};

        condition[type] = {};
        condition[type][property] = value;

        return condition;
    }

}
