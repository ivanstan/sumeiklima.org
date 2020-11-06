import * as NProgress from 'react-nprogress';

export class ApiClient {

    public static GET = 'GET';
    public static PUT = 'PUT';
    public static POST = 'POST';
    public static DELETE = 'DELETE';

    public get(url: string) {
        return this.call(url, {method: 'GET'});
    }

    public upload(url: string, file) {
        let formData = new FormData();
        formData.append('file', file);

        let options = {
            method: 'POST',
            body: formData,
        };

        return this.call(url, options);
    }

    public post(url, body: any) {

        let options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: new Headers({'Content-Type': 'application/json'}),
        };

        return this.call(url, options);
    }

    public call(url: string, options: any, silent = false) {
        const globals: any = window['globals'];

        if (!silent) {
            NProgress.start();
        }

        return new Promise((resolve, reject) => {
            return fetch(globals.baseUrl + url, options)
                .then(response => {

                    response.json().then(data => {

                        if (response.status === 200) {
                            resolve(data);
                        } else {
                            ApiClient.error(data, reject);
                        }

                    }).catch(error => {
                        NProgress.done();
                        ApiClient.error(error, reject);
                    });



                    NProgress.done();
                })
                .catch(error => {
                    NProgress.done();
                    ApiClient.error(error, reject);
                });
        });
    }

    protected static error(error, callback) {
        console.error(error);

        callback(error);
    };
}
