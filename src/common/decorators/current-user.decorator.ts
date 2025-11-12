import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../interfaces';

/**
 * Custom decorator to extract current user from request
 * Usage: @CurrentUser() user: RequestUser
 * 
 * This decorator extracts the user object that was attached to the request
 * by the JWT authentication guard
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
