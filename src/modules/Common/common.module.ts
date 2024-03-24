import { Global, Module } from '@nestjs/common';
import { SendEmailService } from './Services/send-email.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [SendEmailService],
  exports: [SendEmailService],
})
export class CommonModule {}
