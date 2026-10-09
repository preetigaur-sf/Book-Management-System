import {inject} from '@loopback/core';
import * as bcrypt from 'bcrypt';
import {PasswordHasher} from './password-hasher';
import {PasswordHasherBindings} from '../keys';

export class BcryptHasher implements PasswordHasher {
  constructor(
    @inject(PasswordHasherBindings.ROUNDS)
    public readonly rounds: number,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.rounds);
  }

  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    return bcrypt.compare(providedPass, storedPass);
  }
}