import { compare, hash } from 'bcryptjs';

import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';

export class BcryptjsHashProvider implements HashProviderInterface {
  /**
   * Gera um hash com base no payload e na quantidade de salt especificada.
   *
   * @param payload O valor a ser gerado o hash.
   * @param salt A quantidade de salt a ser utilizada.
   * @returns Uma string representando o hash gerado.
   */
  generateHash(payload: string, salt: number): Promise<string> {
    return hash(payload, salt);
  }
  /**
   * Compara o hash armazenado com o hash gerado com o payload informado.
   *
   * @param payload O valor a ser comparado com o hash.
   * @param hash O hash armazenado.
   * @returns true se o hash gerado for igual ao hash armazenado, false caso contrário.
   */
  compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }
}
