import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  refreshToken: string;

  @IsNotEmpty()
  @IsUUID(4, { message: 'User ID must be a valid UUID v4' })
  userId: string;
} 