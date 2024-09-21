class ResponseBuilder {
    constructor() {
        this.res = null; // The response object will be assigned when a request comes in
    }

    init = (req, res, next) => {
        this.res = res;
        next();
    }

    json(data, status = 200) {
        const response = {
            status: "success",
            data: data,
            message: "Request processed successfully"
        };
        this.res.status(status).json(response);
    }

    error(message, status = 500) {
        const response = {
            status: "error",
            message: message
        };
        this.res.status(status).json(response);
    }
}

export const Response = new ResponseBuilder();