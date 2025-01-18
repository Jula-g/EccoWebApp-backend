import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey: string = process.env.JWT_SECRET || 'secretKey';
  private readonly expiresIn: string = '1h';

  generateToken(auth: { username: string; role: string; user: { id: string } }): string {
    const payload = {
      username: auth.username,
      role: auth.role,
      userId: auth.user.id,
    };
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.secretKey); 
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
