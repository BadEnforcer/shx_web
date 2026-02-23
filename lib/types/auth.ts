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
