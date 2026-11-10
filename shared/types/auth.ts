export type UserRole = 'admin' | 'staff';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}
