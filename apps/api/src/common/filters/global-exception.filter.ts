import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ApiErrorResponse } from "@/common/types/api-response";
import { createErrorResponse } from "@/common/utils/response-envelope";
import { logError } from "@/common/utils/observability";
import {
  ZodValidationException,
  formatZodError
} from "@/common/pipes/zod-validation.pipe";

interface RequestWithContext extends Request {
  requestId?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest<RequestWithContext>();
    const response = host.switchToHttp().getResponse<Response>();
    const status = this.getStatus(exception);
    const errorBody = createErrorResponse(this.getError(exception));

    logError("HTTP request failed", {
      requestId: request.requestId ?? null,
      method: request.method,
      path: request.originalUrl ?? request.url,
      statusCode: status,
      errorCode: errorBody.error.code,
      errorMessage: errorBody.error.message,
      details: errorBody.error.details,
      exceptionName:
        exception instanceof Error ? exception.name : "UnknownException"
    });

    response.status(status).json(errorBody);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (exception instanceof ZodError) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getError(exception: unknown): ApiErrorResponse["error"] {
    if (exception instanceof ZodValidationException) {
      return exception.errorBody.error;
    }

    if (exception instanceof ZodError) {
      return {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: formatZodError(exception)
      };
    }

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (this.isApiErrorResponse(exceptionResponse)) {
        return exceptionResponse.error;
      }

      const message =
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null &&
        "message" in exceptionResponse
          ? exceptionResponse.message
          : exception.message;

      return {
        message: Array.isArray(message) ? message.join(", ") : String(message),
        code: exception.name
      };
    }

    return {
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR"
    };
  }

  private isApiErrorResponse(value: unknown): value is ApiErrorResponse {
    return (
      typeof value === "object" &&
      value !== null &&
      "error" in value &&
      typeof value.error === "object" &&
      value.error !== null &&
      "code" in value.error &&
      "message" in value.error
    );
  }
}
