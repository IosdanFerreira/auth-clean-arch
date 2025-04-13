import {
  UserRepositoryInterface,
  UserSearchParams,
  UserSearchResults,
} from '@src/domain/repositories/user.repository';

import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/shared/infrastructure/database/prisma/prisma.service';
import { SearchResult } from '@src/shared/domain/repositories/searchable-repository-contract';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserModelMapper } from '../models/user-model.mapper';

export class AuthRepositoryDatabase implements UserRepositoryInterface {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Recupera um usuário pelo seu endereço de email.
   * @param email - O endereço de email a ser pesquisado.
   * @returns Uma promessa que resolve para a entidade de usuário.
   * @throws {NotFoundError} Se o usuário não for encontrado.
   */
  async findByEmail(email: string): Promise<UserEntity> {
    // Consulta o banco de dados para encontrar um usuário pelo endereço de email
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    // Se o usuário não for encontrado, retorna null
    if (!user) {
      return null;
    }

    // Mapeia o modelo de usuário recuperado para uma entidade de usuário
    return UserModelMapper.toEntity(user);
  }

  /**
   * Recupera uma lista de usuários que atendem aos critérios de busca.
   * @param props - Os critérios de busca.
   * @returns Uma promessa que resolve para um SearchResult contendo os resultados da busca.
   */
  async search(props: UserSearchParams): Promise<UserSearchResults> {
    // Valores padr o
    const page = props.page && props.page > 0 ? props.page : 1;
    const perPage = props.perPage && props.perPage > 0 ? props.perPage : 15;

    // Construir o WHERE clause com tipagem correta
    const where = props.filter
      ? {
          OR: [
            {
              name: {
                contains: props.filter,
                mode: 'insensitive' as const,
              },
            },
            {
              email: {
                contains: props.filter,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    // L gica de ordena o 100% funcional
    const orderBy: Prisma.UserOrderByWithRelationInput = {};

    if (props.sort && this.sortableFields.includes(props.sort)) {
      const sortField = props.sort;
      const sortOrder = props.sortDir === 'asc' ? 'asc' : 'desc';

      // Atribui o din mica com notacao de colchetes
      orderBy[sortField as keyof Prisma.UserOrderByWithRelationInput] =
        sortOrder;
    } else {
      // Ordena o padr o
      orderBy.createdAt = 'desc';
    }

    // Consulta com ordena o garantida
    const [totalItems, models] = await Promise.all([
      this.prismaService.user.count({ where }),
      this.prismaService.user.findMany({
        where,
        orderBy, // Agora garantido que funciona
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return new SearchResult({
      items: models.map(UserModelMapper.toEntity),
      totalItems,
      currentPage: page,
      perPage,
      sort: props.sort,
      sortDir: props.sortDir || 'desc',
      filter: props.filter,
    });
  }

  /**
   * Insere um novo de usuário no banco de dados.
   * @param entity - A entidade de usuário a ser inserida.
   * @returns Uma promessa que resolve quando a inserção estiver completa.
   */
  async insert(entity: UserEntity): Promise<void> {
    // Registra o novo de usuário no banco de dados
    await this.prismaService.user.create({
      data: entity.toJSON(), // Converta a entidade de usuário para um objeto JSON para inserção no banco de dados
    });
  }

  /**
   * Recupera todos os usuário do banco de dados.
   * @returns Uma promessa que resolve para uma lista de UserEntity.
   */
  async findAll(): Promise<UserEntity[]> {
    // Recupera todos os usuário do banco de dados
    const users = await this.prismaService.user.findMany();

    // Mapeia os modelos de usuário recuperados para UserEntity
    return users.map((user) => UserModelMapper.toEntity(user));
  }

  /**
   * Recupera um usuário pelo seu ID.
   * @param id - O ID do usuário.
   * @returns Uma promessa que resolve para a entidade de Usuário.
   */
  async findByID(id: string): Promise<UserEntity> {
    // Recupera o usuário do banco de dados
    const user = await this._get(id);

    // Retorna o usuário
    return user;
  }

  /**
   * Atualiza um usuário no banco de dados.
   * @param id - O ID do usuário.
   * @param entity - A entidade de Usuário atualizada.
   */
  async update(id: string, entity: UserEntity): Promise<void> {
    // Recupera a entidade de Usuário do banco de dados
    const user = await this._get(id);

    // Atualiza o usuário no banco de dados
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: entity.toJSON(),
    });
  }

  /**
   * Remove uma entidade de usuário do banco de dados.
   * @param id - O ID do usuário.
   */
  async delete(id: string): Promise<void> {
    const user = await this._get(id);

    // Remove o usuário do banco de dados
    await this.prismaService.user.delete({
      where: {
        id: user.id,
      },
    });
  }

  /**
   * Recupera uma entidade de usuário pelo seu ID
   * @param id - O ID do usuário.
   * @returns Uma promessa que resolve para a entidade de usuário.
   */
  protected async _get(id: string): Promise<UserEntity> {
    if (!this.isValidUUID(id)) {
      return null;
    }

    // Consulta o banco de dados para encontrar um usuário pelo seu ID
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }
    // Mapeia o modelo de usuário recuperado para uma entidade de usuário
    return UserModelMapper.toEntity(user);
  }

  private isValidUUID(uuid: string): boolean {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  }
}
