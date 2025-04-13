export interface JwtProviderInterface {
  generateToken(payload: any, options?: any): Promise<string>;
  verifyToken(token: string, type: 'access' | 'refresh'): Promise<any>;
}
