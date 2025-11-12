/**
 * Common interfaces and types used throughout the application
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

/**
 * JWT Payload structure
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * User from request (after JWT authentication)
 */
export interface RequestUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
