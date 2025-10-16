import { z, ZodError, ZodSchema } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Validation error formatter
export function formatZodError(error: ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(err.message);
  });

  return formattedErrors;
}

// Create a validation error response
export function createValidationErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      details: formatZodError(error),
    },
    { status: 400 }
  );
}

// Validate request body against a schema
export async function validateRequestBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ data: T | null; error: NextResponse | null }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: createValidationErrorResponse(error) };
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        data: null,
        error: NextResponse.json(
          {
            success: false,
            error: 'Invalid JSON in request body',
          },
          { status: 400 }
        ),
      };
    }

    // Unknown error
    return {
      data: null,
      error: NextResponse.json(
        {
          success: false,
          error: 'An unexpected error occurred',
        },
        { status: 500 }
      ),
    };
  }
}

// Validate query parameters against a schema
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): { data: T | null; error: Record<string, string[]> | null } {
  try {
    // Convert URLSearchParams to object
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const data = schema.parse(params);
    return { data, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: formatZodError(error) };
    }

    return {
      data: null,
      error: { _error: ['An unexpected error occurred'] },
    };
  }
}

// Validation middleware for API routes
export function withValidation<T>(schema: ZodSchema<T>) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest, data: T) => Promise<NextResponse>
  ) => {
    const { data, error } = await validateRequestBody(request, schema);

    if (error) {
      return error;
    }

    return handler(request, data!);
  };
}

// Validation wrapper for server actions
export function validateAction<T>(schema: ZodSchema<T>) {
  return <R>(
    action: (data: T) => Promise<R>
  ) => async (rawData: unknown): Promise<R> => {
      const validationResult = schema.safeParse(rawData);

      if (!validationResult.success) {
        throw new Error(
          `Validation failed: ${JSON.stringify(formatZodError(validationResult.error))}`
        );
      }

      return action(validationResult.data);
    };
}

// Type guard for checking if value is defined
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

// Safe parse with default value
export function safeParse<T>(
  schema: ZodSchema<T>,
  data: unknown,
  defaultValue: T
): T {
  const result = schema.safeParse(data);
  return result.success ? result.data : defaultValue;
}

// Create a paginated response
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// Create a success response
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

// Create an error response
export function createErrorResponse(
  error: string,
  code?: string,
  status = 500,
  details?: Record<string, any>
) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(code && { code }),
      ...(details && { details }),
    },
    { status }
  );
}

// Validate environment variable
export function validateEnvVar(
  name: string,
  value: string | undefined,
  validator?: (value: string) => boolean
): string {
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  if (validator && !validator(value)) {
    throw new Error(`Environment variable ${name} has an invalid value`);
  }

  return value;
}

// Batch validation for multiple schemas
export async function validateMultiple<T extends Record<string, ZodSchema>>(
  schemas: T,
  data: Record<keyof T, unknown>
): Promise<{
  [K in keyof T]: z.infer<T[K]> | null;
}> {
  const results: any = {};
  const errors: Record<string, ZodError> = {};

  for (const [key, schema] of Object.entries(schemas)) {
    const result = schema.safeParse(data[key]);

    if (result.success) {
      results[key] = result.data;
    } else {
      results[key] = null;
      errors[key] = result.error;
    }
  }

  if (Object.keys(errors).length > 0) {
    const combinedErrors: Record<string, string[]> = {};

    for (const [key, error] of Object.entries(errors)) {
      const formatted = formatZodError(error);
      for (const [path, messages] of Object.entries(formatted)) {
        const fullPath = `${key}.${path}`;
        combinedErrors[fullPath] = messages;
      }
    }

    throw new Error(`Validation failed: ${JSON.stringify(combinedErrors)}`);
  }

  return results;
}

// Export all validation utilities
export default {
  formatZodError,
  createValidationErrorResponse,
  validateRequestBody,
  validateQueryParams,
  withValidation,
  validateAction,
  isDefined,
  safeParse,
  createPaginatedResponse,
  createSuccessResponse,
  createErrorResponse,
  validateEnvVar,
  validateMultiple,
};