export class GeoQuery {
    private readonly url: string;
    private readonly name: string;

    constructor(url: string, name: string) {
        this.url = url;
        this.name = name;
    }

    public async getForViewPort(maxX, maxY, minX, minY) {
        let query = {
            bool: {
                should: [
                    {
                        range: {
                            minX: {
                                gte: minX
                            }
                        }
                    },
                    {
                        range: {
                            maxX: {
                                lte: maxX
                            }
                        }
                    },
                    {
                        range: {
                            minY: {
                                gte: minY
                            }
                        }
                    },
                    {
                        range: {
                            maxY: {
                                lte: maxY
                            }
                        }
                    }
                ]
            }
        };

        return await this.search(query);
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

        return data.hits || null;
    }

}
