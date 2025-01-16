import {
  Controller,
  Req,
  Get,
  Patch,
  Body,
  Param,
  HttpException,
  HttpStatus,
} 
from '@nestjs/common';import { UserService } from './user.service';
import { PatchUserDto } from '../dto/user/patch-user.dto';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getUserProfile(@Req() req) {
    const { firebaseUid } = req.user; 
    try {
      return await this.userService.getUserById(firebaseUid);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch('profile')
  async updateUserProfile(@Req() req, @Body() patchUserDto: PatchUserDto) {
    const { firebaseUid } = req.user;
    try {
      return await this.userService.update(firebaseUid, patchUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':firebaseUid')
  async getUserByFirebaseUid(@Param('firebaseUid') firebaseUid: string) {
    try {
      return await this.userService.getUserById(firebaseUid);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
