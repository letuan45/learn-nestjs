import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { Request, Response } from 'express';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type CustomResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new CustomLoggerService(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const customResponseObj: CustomResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    // Detect exceptions
    if (exception instanceof HttpException) {
      customResponseObj.statusCode = exception.getStatus();
      customResponseObj.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      customResponseObj.statusCode = 422;
      customResponseObj.response = exception.message.replaceAll(/\n/g, '');
    } else {
      customResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      customResponseObj.response = 'Intervel server Error';
    }

    response.status(customResponseObj.statusCode).json(customResponseObj);

    this.logger.error(customResponseObj.response, AllExceptionFilter.name);

    super.catch(exception, host);
  }
}
