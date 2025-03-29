export interface JwtProviderInterface {
  generateToken(payload: any): Promise<string>;
  verifyToken(token: string): Promise<any>;
}
