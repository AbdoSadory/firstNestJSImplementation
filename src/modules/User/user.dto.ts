import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class upadateBodyDTO {
  @IsString()
  @MinLength(3, { message: 'min length is 3' })
  @MaxLength(10, { message: 'max length is 10' })
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(6, { message: 'min length is 6' })
  @MaxLength(10, { message: 'max length is 10' })
  @IsNotEmpty()
  @IsOptional()
  password: string;
}
