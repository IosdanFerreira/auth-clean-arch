import { InvalidParamError } from '@src/shared/domain/errors/invalid-param.error';
import { Name } from '../name.value-object';

describe('Name Value Object', () => {
  it('deve criar um nome válido com primeira letra maiúscula', () => {
    const name = Name.create('João');
    expect(name.value).toStrictEqual('João');
  });

  it('deve criar um nome composto válido', () => {
    const name = Name.create('Maria Clara');
    expect(name.value).toStrictEqual('Maria Clara');
  });

  it('deve considerar dois nomes iguais como iguais', () => {
    const name1 = Name.create('João');
    const name2 = Name.create('João');
    expect(name1.equals(name2)).toBe(true);
  });

  it('deve lançar erro se o nome for vazio', () => {
    expect(() => Name.create('')).toThrow(InvalidParamError);
  });

  it('deve lançar erro se o nome não for string', () => {
    expect(() => Name.create(123 as any)).toThrow(InvalidParamError);
  });

  it('deve lançar erro se o nome tiver menos de 3 caracteres', () => {
    expect(() => Name.create('Al')).toThrow(InvalidParamError);
  });

  it('deve lançar erro se a primeira letra for minúscula', () => {
    expect(() => Name.create('joão')).toThrow(InvalidParamError);
  });

  it('deve lançar erro se o nome tiver números', () => {
    expect(() => Name.create('Jo4o')).toThrow(InvalidParamError);
  });

  it('deve remover espaços extras antes de validar', () => {
    const name = Name.create('  João Pedro   ');
    expect(name.value).toStrictEqual('João Pedro');
  });
});
