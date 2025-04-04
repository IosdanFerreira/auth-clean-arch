import { UserEntityProps } from '../../user.entity';
import { faker } from '@faker-js/faker/.';

// Tipo para definir as propriedades opcionais que podem ser passadas para o construtor do builder.
type Props = {
  name?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
};

/**
 * Função que cria um objeto `UserEntityProps` com dados do usuário.
 * Caso as propriedades não sejam fornecidas, são gerados valores falsos utilizando a biblioteca `faker`.
 *
 * @param props - Propriedades do usuário que podem ser passadas para customizar a criação.
 *
 * @returns Um objeto `UserEntityProps` com os dados do usuário, preenchidos com valores reais ou gerados.
 */
export function UserDataBuilder(props: Props): UserEntityProps {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password:
      props.password ??
      `${faker.internet.password({ length: 6, memorable: true })}A1@`,
    createdAt: props.createdAt ?? new Date(),
  };
}
