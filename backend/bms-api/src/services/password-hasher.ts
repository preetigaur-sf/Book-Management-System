export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;

  comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean>;
}