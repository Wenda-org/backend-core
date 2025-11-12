import { applyDecorators } from '@nestjs/common';
import { ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';

/**
 * Custom decorator for consistent API responses in Swagger docs
 * Combines common response documentation
 */
export function ApiSuccessResponse(status: number = 200, description?: string) {
  return applyDecorators(
    SwaggerApiResponse({
      status,
      description: description || 'Successful operation',
    }),
  );
}

export function ApiErrorResponses() {
  return applyDecorators(
    SwaggerApiResponse({ status: 400, description: 'Bad Request - Validation failed' }),
    SwaggerApiResponse({ status: 401, description: 'Unauthorized - Authentication required' }),
    SwaggerApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' }),
    SwaggerApiResponse({ status: 404, description: 'Not Found' }),
    SwaggerApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}
