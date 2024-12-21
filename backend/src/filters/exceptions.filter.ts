import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from 'express';

interface ErrorResponse {
    errorCode: string;
    devMessage: string;
    path: string;
    data: { routeParam: unknown, query: unknown, body: unknown }
}

@Catch()
export class EveryExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if (exception instanceof HttpException) {
            const errorResponse: ErrorResponse = {
                errorCode: exception.getResponse()["error"],
                devMessage: exception.message,
                path: request.route?.path ?? "unknown",
                data: {
                    routeParam: request.params,
                    query: request.query,
                    body: request.body
                }
            }
            response.status(exception.getStatus()).json(errorResponse);
        } else {
            const errorResponse: ErrorResponse = {
                errorCode: "Internal Server Error",
                devMessage: exception.message?? "Unexpected Error",
                path: request.route.path,
                data: {
                    routeParam: request.params,
                    query: request.query,
                    body: request.body
                }
            }
            response.status(500).json(errorResponse);
        }
    }
}