import { JwtModuleOptions } from '@nestjs/jwt';
import { registerAs } from '@nestjs/config';

// Exporta uma configuração nomeada 'jwt' que retorna as opções do módulo JWT
export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    // Define a chave de segurança do token de acesso
    secret: process.env.JWT_SECRET,
  }),
);
