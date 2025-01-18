import { Body, Controller, Post, HttpException, HttpStatus, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto//register/register.dto'; 
import { LoginDto } from '../dto//login/login.dto';      
import { RegisterResponseDto } from '../dto//register/register-response.dto'; 
import { LoginResponseDto } from '../dto//login/login-response.dto';       

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {} 

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{ data: RegisterResponseDto; statusCode: number }> {
    try {
      const response = await this.authService.register(registerDto);
      return { data: response, statusCode: HttpStatus.CREATED };
    } catch (error) {
      
      if (error.status) {
        throw new HttpException(error.message, error.status); 
      }
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST); 
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ data: LoginResponseDto; statusCode: number }> {
    try {
      const response = await this.authService.login(loginDto);
      return { data: response, statusCode: HttpStatus.OK };
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Delete('user/userId')
  async deleteUser(@Param() userId: string): Promise<void> {
    try {
      await this.authService.delete(userId);
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException('User deletion failed', HttpStatus.BAD_REQUEST);
    }
  }
}
