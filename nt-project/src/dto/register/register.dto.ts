import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '../../common-types/user-role.enum';

export class RegisterDto {
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  role: UserRole = UserRole.ROLE_USER; 

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

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
