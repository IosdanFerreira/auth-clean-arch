import { HashProviderInterface } from '@src/shared/application/providers/hash-provider';
import { compare, hash } from 'bcryptjs';

export class BcryptjsHashProvider implements HashProviderInterface {
  generateHash(payload: string, salt: number): Promise<string> {
    return hash(payload, salt);
  }
  compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }
}
