import { IsNotEmpty, MinLength, IsAlphanumeric, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class RecoveryPassword {
  @ApiProperty({ example: '123abc...', description: 'Token de recuperación' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 1745960810181, description: 'Fecha de expiración (timestamp)' })
  @IsNotEmpty()
  expires: number;
}

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'Nombre del usuario (mínimo 5 caracteres)' })
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @ApiProperty({ example: 'secret123', description: 'Contraseña alfanumérica (mínimo 8 caracteres)' })
  @IsNotEmpty()
  @MinLength(8)
  @IsAlphanumeric()
  password: string;

  @ApiPropertyOptional({ type: () => RecoveryPassword, description: 'Objeto de recuperación de contraseña' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RecoveryPassword)
  recoveryPassword?: RecoveryPassword | null;
}

