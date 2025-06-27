import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ServiceException } from "./service.exception";
import { Request, Response } from "express";

@Catch(ServiceException)
export class ServiceExceptionToHttpExecptionFilter implements ExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = Number(exception.errorCode.status);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      path: request.url,
    });
  }
}
