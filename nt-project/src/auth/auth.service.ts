import * as bcrypt from 'bcrypt'; 
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterResponseDto } from '../dto/register/register-response.dto';
import { LoginResponseDto } from '../dto/login/login-response.dto';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';
import { UserRole } from '../enums/user-role.enum';
import { AuthRepository } from '../repositories/auth.repository';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '../security/jwt.service';
import { RegisterDto } from '../dto/register/register.dto';
import { LoginDto } from '../dto/login/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { username, password, email, name, lastName, phoneNumber } = registerDto;
  
    const existingAuth = await this.authRepository.findByUsername(username);
    if (existingAuth) {
      throw new UserAlreadyExistsException(username);
    }
  
    const user = await this.userRepository.save({ email, name, lastName, phoneNumber });

    const auth = {
      username,
      password: await bcrypt.hash(password, 10),
      role: UserRole.ROLE_USER,
      userId: user.firebaseUid,
    };
  
    const token = await this.jwtService.generateToken({
      username: auth.username,
      role: auth.role,
      user: { id: auth.userId }, 
    });
  
    const savedAuth = await this.authRepository.save(auth);
  
    return new RegisterResponseDto(savedAuth.id, savedAuth.username, token, savedAuth.role);
  }
  
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;
  
    const auth = await this.authRepository.findByUsername(username);
    if (!auth) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    const passwordMatches = await bcrypt.compare(password, auth.password);
    if (!passwordMatches) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
  
    const token = await this.jwtService.generateToken({
      username: auth.username,
      role: auth.role,
      user: { id: auth.userId }, 
    });
  
    return new LoginResponseDto(token, auth.userId);
  }
  

  async delete(userId: string): Promise<void> {
    await this.authRepository.deleteByUserId(userId);
  }
}
