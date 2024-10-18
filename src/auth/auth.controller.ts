
import { Controller, Post, Body, UseGuards, Request, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(createUserDto.email)
  
    if(user){
      throw new HttpException('Данный пользователь уже существует', HttpStatus.NOT_FOUND)
    }
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.validateUser(createUserDto.email, createUserDto.password);
    
    if (!user) {
      throw new HttpException('Неверный логин или пароль', HttpStatus.NOT_FOUND)
    }

    else{
      const accessToken = await this.authService.generateAccessToken(user);
      const refreshToken = await this.authService.generateRefreshToken(user);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user:{
          email:user.email,
          name:user.name,
          roles:user.roles
        }
      }
    };
  }
  @Post('me')
  async me(@Body('access_token') access:string){
    const decodetToken = await this.authService.verifyRefreshToken(access)  
    if(decodetToken){
      const accessToken = await this.authService.generateAccessToken(decodetToken);
      const refreshToken = await this.authService.generateRefreshToken(decodetToken);
      
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user:{
          email:decodetToken.email,
          name:decodetToken.name,
          roles:decodetToken.roles
        }
      };
    }
    
  }
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    // Проверяем и декодируем refresh токен
    const decoded = this.authService.verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      throw new HttpException('Неверный refresh токен', HttpStatus.NOT_FOUND)
    }
    
    // Извлекаем пользователя из refresh токена
    const user = await this.authService.validateUserByJwt(decoded);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }

    // Генерируем новый access токен
    const accessToken = await this.authService.generateAccessToken(user);
    return {
      access_token: accessToken,
    };
  }
  @Post('profile')
  @UseGuards(AuthGuard())
  async profile(@Request() req) {
    return req.user;
  }
}