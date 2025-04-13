import {
  UserRepositoryInterface,
  UserSearchParams,
} from '@src/domain/repositories/user.repository';

import { PaginationMapperInterface } from '@src/shared/application/mappers/pagination-mapper.interface';
import { PaginationOutputDto } from '@src/shared/application/dto/pagination-output.dto';
import { SearchInputDto } from '@src/shared/application/dto/search-input.dto';
import { UserOutputDto } from '../_dto/user-output.dto';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class ListUsers {
  /**
   * Caso de uso para listagem de usuários com paginação e ordenação
   * @param userRepository Repositório de usuários
   * @param paginationMapper Mapeador de paginação
   * @param validator Validador de entradas
   */
  constructor(
    readonly userRepository: UserRepositoryInterface,
    private readonly paginationMapper: PaginationMapperInterface,
    private readonly validator: ValidatorInterface<ListUsersInput>,
  ) {}

  /**
   * Executa a listagem de usuários com paginação e ordenação
   *
   * @param input - Dados da paginação e ordenação
   * @returns Uma promessa com a lista de usuários paginados e ordenados
   */
  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    // Valida o input do usu rio
    this.validator.validate(input);

    // Cria um objeto de parâmetros de busca com os dados do input
    const searchParams = new UserSearchParams({
      page: input.page,
      perPage: input.perPage,
      sort: input.sort,
      sortDir: input.sortDir,
      filter: input.filter,
    });

    // Busca os usuários no banco de dados
    const listedUsers = await this.userRepository.search(searchParams);

    // Converte os resultados da busca para o formato desejado
    return this.paginationMapper.toOutput(listedUsers);
  }
}

export type ListUsersInput = SearchInputDto;

export type ListUsersOutput = PaginationOutputDto<UserOutputDto>;
