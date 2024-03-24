import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as modules from './modules';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    modules.AuthModule,
    modules.UserModule,
    modules.CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
