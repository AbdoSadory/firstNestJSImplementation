import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class signUpBodyDTO {
  @IsString()
  @MinLength(3, { message: 'min length is 3' })
  @MaxLength(10, { message: 'max length is 10' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'min length is 6' })
  @MaxLength(10, { message: 'max length is 10' })
  @IsNotEmpty()
  password: string;
}

export class signInBodyDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'min length is 6' })
  @MaxLength(10, { message: 'max length is 10' })
  @IsNotEmpty()
  password: string;
}

export class verifyEmailQueryDTO {
  @IsString()
  token: string;
}
