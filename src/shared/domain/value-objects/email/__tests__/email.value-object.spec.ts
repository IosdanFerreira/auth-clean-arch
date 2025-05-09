import { Email } from '../email.value-object';
import { InvalidParamError } from '@src/shared/domain/errors/invalid-param.error';

describe('Email Value Object', () => {
  it('deve criar um email válido', () => {
    const email = Email.create('usuario@email.com');
    expect(email.value).toBe('usuario@email.com');
  });

  it('deve criar um email válido com espaços extras removidos', () => {
    const email = Email.create('   user@domain.com   ');
    expect(email.value).toBe('user@domain.com');
  });

  it('deve considerar dois emails iguais como iguais', () => {
    const email1 = Email.create('user@example.com');
    const email2 = Email.create('user@example.com');
    expect(email1.equals(email2)).toBe(true);
  });

  it('deve lançar erro se o email for vazio', () => {
    expect(() => Email.create('')).toThrow(InvalidParamError);
  });

  it('deve lançar erro se o email não for string', () => {
    // @ts-expect-error Testando tipo inválido
    expect(() => Email.create(123)).toThrow(InvalidParamError);
  });

  it('deve lançar erro se o formato do email for inválido', () => {
    const invalidEmails = [
      'user@', // sem domínio
      '@domain.com', // sem nome de usuários
      'user@domain', // sem TLD
      'user@.com', // domínio inválido
      'userdomain.com', // sem @
      'user@domain..com', // dois pontos seguidos
      'user@domain,com', // vírgula inválida
    ];

    invalidEmails.forEach((invalidEmail) => {
      expect(() => Email.create(invalidEmail)).toThrow(InvalidParamError);
    });
  });
});
