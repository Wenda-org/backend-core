/**
 * Wenda Tourism API - TypeScript Types
 * 
 * Use este arquivo para ter autocomplete e type-safety nas suas requisições
 * Copie para o seu projeto: src/types/api.types.ts
 */

// ========== BASE TYPES ==========

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

// ========== USER & AUTH ==========

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  preferences?: Record<string, any>;
  isActive: boolean;
  emailVerifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface UserWithStats extends User {
  _count: {
    reviews: number;
    favorites: number;
    trips: number;
  };
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  avatarUrl?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number; // seconds (7 days = 604800)
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  password?: string;
  confirmPassword?: string;
}

// ========== CATEGORY ==========

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithCount extends Category {
  _count: {
    destinations: number;
  };
}

export interface CategoryWithDestinations extends Category {
  destinations: DestinationSummary[];
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

// ========== DESTINATION ==========

export interface DestinationImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  isPrimary: boolean;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  province: string;
  latitude: number;
  longitude: number;
  images: DestinationImage[];
  rating: number;
  reviewCount: number;
  categoryId: string;
  category: Category;
  tags: string[];
  facilities: string[];
  bestTimeToVisit?: string;
  entryFee?: string;
  openingHours?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationSummary {
  id: string;
  name: string;
  slug: string;
  location: string;
  province: string;
  latitude: number;
  longitude: number;
  images: DestinationImage[];
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  isFeatured: boolean;
  createdAt: string;
}

export interface DestinationFilters extends PaginationParams {
  categoryId?: string;
  province?: string;
  search?: string;
  sortBy?: 'rating' | 'popular' | 'recent';
}

export interface CreateDestinationDto {
  name: string;
  slug: string;
  description: string;
  location: string;
  province: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  images?: Array<{
    url: string;
    thumbnailUrl?: string;
    caption?: string;
    isPrimary?: boolean;
  }>;
  tags?: string[];
  facilities?: string[];
  bestTimeToVisit?: string;
  entryFee?: string;
  openingHours?: string;
  isFeatured?: boolean;
}

export interface UpdateDestinationDto {
  name?: string;
  slug?: string;
  description?: string;
  location?: string;
  province?: string;
  categoryId?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  facilities?: string[];
  bestTimeToVisit?: string;
  entryFee?: string;
  openingHours?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

// ========== REVIEW ==========

export interface ReviewImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
}

export interface Review {
  id: string;
  rating: number; // 1-5
  comment: string;
  visitDate?: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  destination: {
    id: string;
    name: string;
    slug: string;
  };
  images: ReviewImage[];
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFilters extends PaginationParams {
  destinationId?: string;
  userId?: string;
  minRating?: number;
  sortBy?: 'rating' | 'helpful' | 'recent';
}

export interface CreateReviewDto {
  destinationId: string;
  rating: number; // 1-5
  comment: string;
  visitDate?: string;
  images?: Array<{
    url: string;
    thumbnailUrl?: string;
  }>;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
  visitDate?: string;
}

// ========== FAVORITE ==========

export interface Favorite {
  id: string;
  destination: DestinationSummary;
  createdAt: string;
}

export interface CreateFavoriteDto {
  destinationId: string;
}

export interface FavoriteCheckResponse {
  isFavorite: boolean;
}

// ========== TRIP ==========

export type TripStatus = 'planned' | 'ongoing' | 'completed' | 'cancelled';

export interface TripDestination {
  id: string;
  destination: DestinationSummary;
  visitDate?: string;
  notes?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  destinations: TripDestination[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripDto {
  title: string;
  description?: string;
  startDate: string; // ISO date string: "2025-12-01"
  endDate: string;
  status?: TripStatus;
}

export interface UpdateTripDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: TripStatus;
}

export interface AddDestinationToTripDto {
  destinationId: string;
  visitDate?: string;
  notes?: string;
}

// ========== HEALTH ==========

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    status: 'healthy' | 'unhealthy';
    responseTime: string;
  };
  version: string;
}

export interface DatabaseHealthResponse {
  status: 'healthy' | 'unhealthy';
  responseTime: string;
  timestamp: string;
  error?: string;
}

// ========== API CLIENT TYPE-SAFE METHODS ==========

/**
 * Exemplo de uso com axios:
 * 
 * import axios from 'axios';
 * import type { ApiResponse, AuthResponse, LoginDto } from './types/api.types';
 * 
 * const api = axios.create({ baseURL: 'http://localhost:3000/api' });
 * 
 * async function login(data: LoginDto): Promise<AuthResponse> {
 *   const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
 *   return response.data.data!;
 * }
 */

export interface ApiClientMethods {
  // Auth
  register(data: RegisterDto): Promise<AuthResponse>;
  login(data: LoginDto): Promise<AuthResponse>;
  getProfile(): Promise<UserWithStats>;
  updateProfile(data: UpdateProfileDto): Promise<User>;
  
  // Categories
  getCategories(): Promise<CategoryWithCount[]>;
  getCategory(id: string): Promise<CategoryWithDestinations>;
  
  // Destinations
  getDestinations(filters?: DestinationFilters): Promise<PaginatedResponse<DestinationSummary>>;
  getDestination(idOrSlug: string): Promise<Destination>;
  
  // Reviews
  getReviews(filters?: ReviewFilters): Promise<PaginatedResponse<Review>>;
  getDestinationReviews(destinationId: string, filters?: ReviewFilters): Promise<PaginatedResponse<Review>>;
  createReview(data: CreateReviewDto): Promise<Review>;
  updateReview(id: string, data: UpdateReviewDto): Promise<Review>;
  deleteReview(id: string): Promise<void>;
  markReviewHelpful(id: string): Promise<void>;
  
  // Favorites
  getFavorites(): Promise<Favorite[]>;
  addFavorite(destinationId: string): Promise<Favorite>;
  removeFavorite(id: string): Promise<void>;
  checkFavorite(destinationId: string): Promise<FavoriteCheckResponse>;
  
  // Trips
  getTrips(): Promise<Trip[]>;
  getTrip(id: string): Promise<Trip>;
  createTrip(data: CreateTripDto): Promise<Trip>;
  updateTrip(id: string, data: UpdateTripDto): Promise<Trip>;
  deleteTrip(id: string): Promise<void>;
  addDestinationToTrip(tripId: string, data: AddDestinationToTripDto): Promise<TripDestination>;
  removeDestinationFromTrip(tripId: string, destinationId: string): Promise<void>;
  
  // Health
  healthCheck(): Promise<HealthCheckResponse>;
  databaseHealth(): Promise<DatabaseHealthResponse>;
}

// ========== PROVINCES OF ANGOLA ==========

export const ANGOLA_PROVINCES = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huíla',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uíge',
  'Zaire',
] as const;

export type AngolaProvince = typeof ANGOLA_PROVINCES[number];

// ========== HELPER TYPES ==========

export type SortOrder = 'asc' | 'desc';

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: ValidationError[];
}

// ========== ZOD SCHEMAS (OPCIONAL) ==========

/**
 * Se vocês usarem Zod para validação no frontend:
 * 
 * import { z } from 'zod';
 * 
 * export const loginSchema = z.object({
 *   email: z.string().email('Email inválido'),
 *   password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
 * });
 * 
 * export const registerSchema = z.object({
 *   name: z.string().min(2, 'Nome muito curto'),
 *   email: z.string().email('Email inválido'),
 *   password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
 *   confirmPassword: z.string(),
 *   phone: z.string().optional(),
 * }).refine((data) => data.password === data.confirmPassword, {
 *   message: 'Senhas não conferem',
 *   path: ['confirmPassword'],
 * });
 */
