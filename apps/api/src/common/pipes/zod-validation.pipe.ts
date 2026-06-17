import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from "@nestjs/common";
import { ZodError, ZodIssue, ZodTypeAny } from "zod";
import { ApiErrorResponse } from "../types/api-response";
import { createErrorResponse } from "../utils/response-envelope";

@Injectable()
export class ZodValidationPipe<TInput = unknown, TOutput = unknown>
  implements PipeTransform<TInput, TOutput>
{
  constructor(private readonly schema: ZodTypeAny) {}

  transform(value: TInput, metadata: ArgumentMetadata): TOutput {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new ZodValidationException(result.error, metadata.type);
    }

    return result.data as TOutput;
  }
}

export class ZodValidationException extends BadRequestException {
  readonly errorBody: ApiErrorResponse;

  constructor(error: ZodError, target: ArgumentMetadata["type"]) {
    const errorBody = createErrorResponse({
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: {
        target,
        ...formatZodError(error)
      }
    });

    super(errorBody);
    this.errorBody = errorBody;
  }
}

export function formatZodError(error: ZodError): {
  issues: Array<{
    path: string;
    code: string;
    message: string;
  }>;
} {
  return {
    issues: error.issues.map(formatZodIssue)
  };
}

function formatZodIssue(issue: ZodIssue): {
  path: string;
  code: string;
  message: string;
} {
  return {
    path: issue.path.join("."),
    code: issue.code,
    message: issue.message
  };
}
