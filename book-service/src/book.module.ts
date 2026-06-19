import { Module } from '@nestjs/common';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [],
  controllers: [],
  providers: [JwtStrategy],
})
export class BookModule {}