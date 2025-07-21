
const HOST = "localhost:8080"

export abstract class APIEndpoints {
    static api = `${HOST}/api`;
    static conversation = `${this.api}/conversation`
}