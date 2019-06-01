import {ApiClient} from "../service/ApiClient";

class TreeServiceClass extends ApiClient {
    public autocomplete(value) {
        return this.get('/tree/autocomplete?search=' + value);
    }

    public saveTree(data) {
        return this.post('/tree/save', data);
    }

    public list() {
        return this.get('/tree/list');
    }
}

export const TreeService = new TreeServiceClass();
