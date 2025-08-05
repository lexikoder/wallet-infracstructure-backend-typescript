export class AppError extends Error {
     statusCode:any;
    constructor(message:any,statusCode:any){
        super(message);
        // this.errorCode =errorCode;
        this.statusCode = statusCode;
    }
}
