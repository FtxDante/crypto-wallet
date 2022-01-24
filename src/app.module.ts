import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coins } from './schemas/coins.entity';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Coins])],
  controllers: [],
  providers: [],
})
export class AppModule {}
