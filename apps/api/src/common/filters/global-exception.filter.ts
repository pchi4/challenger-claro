import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Response } from "express";
import { ZodError } from "zod";
import { ApiErrorResponse } from "@/common/types/api-response";
import { createErrorResponse } from "@/common/utils/response-envelope";
import {
  ZodValidationException,
  formatZodError
} from "@/common/pipes/zod-validation.pipe";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = this.getStatus(exception);

    response.status(status).json(createErrorResponse(this.getError(exception)));
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
