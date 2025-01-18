import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from 'src/security/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      return false;
    }

    try {
      const decodedToken = this.jwtService.verify(token);
      request.user = decodedToken; 
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7); 
    }
    return null;
  }
}
