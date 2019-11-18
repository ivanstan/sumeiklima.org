import {Client} from '@elastic/elasticsearch';

export class GeoQuery {
  private url: string;
  private name: string;
  private client: Client;

  constructor(url: string, name: string) {
    this.client = new Client({
      node: 'https://search-ivanstan-fwyclk37rb3t524iwflinclw6i.eu-central-1.es.amazonaws.com',
      requestTimeout: 3000
    });
    this.url = url;
    this.name = name;
  }

  public async getViewPort(maxX, maxY, minX, minY) {
    return await this.client.search({
      index: this.name,
      body: {
        query: {
          bool: {
            must: [
              {
                and: [
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
            ]
          }
        }
      }
    });
  }

}
