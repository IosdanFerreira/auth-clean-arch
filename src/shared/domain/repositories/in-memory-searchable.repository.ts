import {
  SearchParams,
  SearchResult,
  SearchableRepositoryInterface,
} from './searchable-repository-contract';

import { Entity } from '../entities/entity';
import { InMemoryRepository } from './in-memory.repository';

export abstract class InMemorySearchableRepository<T extends Entity>
  extends InMemoryRepository<T>
  implements SearchableRepositoryInterface<T, any>
{
  sortableFields: string[] = [];

  /**
   * Recupera uma lista de entidades que atendem aos critérios de busca.
   * @param props - Os critérios de busca.
   * @returns Uma promessa que resolve para um SearchResult contendo os resultados da busca.
   */
  async search(props: SearchParams): Promise<SearchResult<T>> {
    // Filtra as entidades com base no filtro recebido
    const itemsFiltered = await this.applyFilter(this.items, props.filter);

    // Ordena as entidades com base no campo e direção recebidos
    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sortDir,
    );

    // Aplica a paginação nas entidades ordenadas
    const itemsPaginated = await this.applyPaginate(
      itemsSorted,
      props.page,
      props.perPage,
    );

    // Retorna um SearchResult com as entidades paginadas e informa es de paginação
    return new SearchResult({
      items: itemsPaginated,
      totalItems: itemsFiltered.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
    });
  }

  /**
   * Aplica um filtro sobre as entidades.
   * @param items - As entidades a serem filtradas.
   * @param filter - O valor do filtro.
   * @returns Uma promessa que resolve para um array de entidades filtradas.
   */
  protected abstract applyFilter(
    items: T[],
    filter: string | null,
  ): Promise<T[]>;

  /**
   * Ordena as entidades com base no campo e direção recebidos.
   * @param items - As entidades a serem ordenadas.
   * @param sort - O nome do campo que serve como base para a ordenação.
   * @param sortDir - A direção da ordenação: "asc" ou "desc".
   * @returns Uma promessa que resolve para um array de entidades ordenadas.
   */
  protected async applySort(
    items: T[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<T[]> {
    // Se o campo de ordenação não for especificado, retorna as entidades sem ordenação
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    // Realiza a ordenação em memória
    return [...items].sort((a, b) => {
      // Compara os valores das propriedades de cada entidade
      if (a.props[sort] < b.props[sort]) {
        // Se a propriedade de "a" for menor que a de "b", retorna -1
        // Se a direção for "asc", retorna -1, caso contrário, retorna 1
        return sortDir === 'asc' ? -1 : 1;
      }

      // Se a propriedade de "a" for maior que a de "b", retorna 1
      // Se a direção for "asc", retorna 1, caso contrário, retorna -1
      if (a.props[sort] > b.props[sort]) {
        return sortDir === 'asc' ? 1 : -1;
      }

      // Se as propriedades forem iguais, retorna 0
      return 0;
    });
  }

  /**
   * Aplica a paginação sobre as entidades.
   * @param items - As entidades a serem paginadas.
   * @param page - O número da página a ser retornada.
   * @param perPage - O número de entidades por página.
   * @returns Uma promessa que resolve para um array de entidades paginadas.
   */
  protected async applyPaginate(
    items: T[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<T[]> {
    // C lculo do início da página
    const start = (page - 1) * perPage;

    // Cálculo do fim da página
    const limit = start + perPage;

    // Retorna um slice do array com as entidades paginadas
    return items.slice(start, limit);
  }
}
