export interface HashProviderInterface {
  generateHash(payload: string, salt: number): Promise<string>;
  compareHash(payload: string, hash: string): Promise<boolean>;
}
