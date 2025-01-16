import { UserRole } from '../enums/user-role.enum'; 

export interface Auth {
  id: string; 
  username: string;
  password: string;
  role: UserRole;
  userId: string;
}

