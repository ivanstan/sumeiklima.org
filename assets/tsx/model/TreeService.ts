import {ApiClient} from "../service/ApiClient";

class TreeServiceClass extends ApiClient {
    public autocomplete(value) {
        return this.get('/en/tree/autocomplete?search=' + value);
    }

    public saveTree(data) {
        return this.post('/en/tree/save', data);
    }

    public list() {
        return this.get('/en/tree/list');
    }
}

export const TreeService = new TreeServiceClass();
