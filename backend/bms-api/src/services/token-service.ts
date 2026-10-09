import {UserProfile} from '@loopback/security';
export interface TokenService {
  generateToken(userProfile: UserProfile): Promise<string>;

  verifyToken(token: string): Promise<UserProfile>;
}