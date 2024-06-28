import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module'; // импортируем UsersModule
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule, // импортируем UsersModule для доступа к UsersService
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_ACCESS, // замените на ваш секретный ключ JWT
      signOptions: { expiresIn: '1h' }, // настройки подписи JWT токена
    }),
    JwtModule.register({
      secret: process.env.SECRET_ACCESS, // секретный ключ для refresh токена
      signOptions: {
        expiresIn: '7d', // время жизни refresh токена (например, 7 дней)
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  
})
export class AuthModule {}