/** API DTOs aligned with OpenAPI schema (backend auth endpoints). */

export interface AuthUserDto {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthTokensResponseDto {
  user: AuthUserDto
  accessToken: string
  refreshToken: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  name: string
  password: string
}

/** Session item from GET /me – backend session with token metadata. */
export interface SessionItemDto {
  id: string
  expiresAt: string
  token?: string
  createdAt: string
  updatedAt: string
  ipAddress?: string | null
  userAgent?: string | null
  userId: string
}

/** Account item from GET /me (linked provider account). */
export interface AccountItemDto {
  id: string
  accountId?: string
  providerId: string
  userId: string
  createdAt?: string
  updatedAt?: string
}

/** Raw response from GET /api/users/me (flat user + sessions + accounts). */
export interface MeApiResponse {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
  createdAt: string
  updatedAt: string
  sessions?: SessionItemDto[]
  accounts?: AccountItemDto[]
}

/** Normalized shape for profile UI – user + sessions + accounts. */
export interface MeResponseDto {
  user: AuthUserDto
  sessions?: SessionItemDto[]
  accounts?: AccountItemDto[]
}

