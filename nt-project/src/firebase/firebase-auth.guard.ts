import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No authorization token provided');
    }

    const token = authorization.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const decodedToken = await this.firebaseService.verifyIdToken(token);
      request.user = decodedToken; // Attach the user info to the request object
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
