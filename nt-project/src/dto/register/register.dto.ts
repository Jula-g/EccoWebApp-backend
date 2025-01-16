import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  role: UserRole = UserRole.ROLE_USER; 

  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsString()
  @IsOptional()   
  phoneNumber: string;

  constructor(
    username: string,
    password: string,
    role: UserRole,
    email: string,
    name: string,
    lastName: string,
    phoneNumber?: string
  ) {
    this.username = username;
    this.password = password;
    this.role = role;
    this.email = email;
    this.name = name;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
  }
}
