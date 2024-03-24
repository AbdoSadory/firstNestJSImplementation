import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { models } from 'src/DB/models.generator';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [models],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
