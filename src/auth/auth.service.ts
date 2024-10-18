import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { env } from 'process';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    
    
    const user = await this.usersService.findByEmail(email);
  
    

    
   
    
    
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async generateAccessToken(user: User): Promise<string> {
    const payload = { email: user.email, id: user.id, name: user.name, roles:user.roles };
    
    return this.jwtService.sign(payload, {
      secret:`${process.env.SECRET_ACCESS}`
    });
  }
  async verifyRefreshToken(refreshToken: string): Promise<any | null> {

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret:process.env.SECRET_REFRESH, // используйте тот же секретный ключ, что и при создании refresh токена
      });
      return decoded;
    } catch (error) {
      // В случае ошибки возвращаем null или обрабатываем ее по необходимости
      console.error('Error verifying refresh token:', error.message);
      return null;
    }
  }
  async generateRefreshToken(user: User): Promise<string> {
    const payload = { email: user.email, id: user.id, name: user.name, roles:user.roles };
    return this.jwtService.sign(payload, { expiresIn: '7d', secret: process.env.SECRET_REFRESH});
  }
  async login(user: User) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    const result = await this.validateUser(user.email, user.password)
    
    if(result){
        return {
            access_token: this.jwtService.sign(payload, {
              secret:env.SECRET_ACCESS
            }),
          };    
    }
  }

  async validateUserByJwt(payload: any) {
    return await this.usersService.findById(payload.sub);
  }
}