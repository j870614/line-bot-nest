import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineModule } from './line/line.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 讓所有 module 都可以使用 ConfigService
    }),
    LineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
