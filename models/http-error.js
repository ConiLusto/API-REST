class HttpError extends Error {
    constructor(message, errorCode){
        super(message); //agrega un msg
        this.code = errorCode; //agrega un codigo al error
    }

}

module.exports = HttpError;