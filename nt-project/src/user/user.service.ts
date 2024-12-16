import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository'; 
import { GetUserDto } from '../dto/user/get-user.dto';
import { PatchUserDto } from '../dto/user/patch-user.dto';
import { PatchUserResponseDto } from '../dto/user/patch-user-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async getUserByUsername(username: string): Promise<GetUserDto> {
    const auth = await this.authRepository.findByUsername(username); 
    if (!auth) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const user = await this.userRepository.findByFirebaseUid(auth.userId);
    return new GetUserDto(user.firebaseUid, user.name, user.lastName, user.email);
  }

  async getAllUsers(): Promise<GetUserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => new GetUserDto(user.firebaseUid, user.name, user.lastName, user.email));
  }

  async getUserById(id: string): Promise<GetUserDto> {
    const user = await this.userRepository.findByFirebaseUid(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new GetUserDto(user.firebaseUid, user.name, user.lastName, user.email);
  }

  async update(firebaseUid: string, dto: PatchUserDto): Promise<PatchUserResponseDto> {
    const user = await this.userRepository.findByFirebaseUid(firebaseUid);
    if (!user) {
      throw new NotFoundException(`User with ID ${firebaseUid} not found`);
    }

    if (dto.email) user.email = dto.email;
    if (dto.name) user.name = dto.name;
    if (dto.lastName) user.lastName = dto.lastName;

    const updatedUser = await this.userRepository.update(firebaseUid, user); 
    return new PatchUserResponseDto(updatedUser.firebaseUid, updatedUser.name, updatedUser.lastName, updatedUser.email);
  }
}
