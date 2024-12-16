import { UserRole } from '../common-types/user-role.enum'; 

export interface Auth {
  id: string; 
  username: string;
  password: string;
  role: UserRole;
  userId: string;
}

