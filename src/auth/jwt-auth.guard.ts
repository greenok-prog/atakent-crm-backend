import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
    
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    

    if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header not found');
    }

    try {
    const token = request.headers.authorization.substring(7); // удаляем "Bearer " из строки
    const decoded = this.jwtService.verify(token, {
        secret:process.env.SECRET_ACCESS
    });
      request.user = decoded; // сохраняем информацию о пользователе в объекте запроса
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}