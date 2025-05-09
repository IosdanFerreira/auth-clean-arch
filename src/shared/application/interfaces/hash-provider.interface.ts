export interface HashProviderInterface {
  generateHash(password: string, salt: number): Promise<string>;
  compareHash(password: string, hash: string): Promise<boolean>;
}
