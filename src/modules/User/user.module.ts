import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { models } from 'src/DB/models.generator';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from '../Common/Services/send-email.service';

@Module({
  imports: [models],
  controllers: [UserController],
  providers: [UserService, JwtService, SendEmailService],
})
export class UserModule {}
