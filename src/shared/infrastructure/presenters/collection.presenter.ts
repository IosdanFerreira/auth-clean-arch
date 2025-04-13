import { Exclude, Expose } from 'class-transformer';

import { PaginationPresenter } from './pagination.presenter';

/**
 * Classe abstrata base para presenters de coleções.
 * Fornece a estrutura para apresentar uma coleções de dados com paginação.
 */
export abstract class CollectionPresenter {
  /**
   * Presenter de paginação.
   * @protected
   */
  @Exclude()
  protected readonly paginationPresenter: PaginationPresenter;

  /**
   * Construtor da classe.
   * @param paginationPresenter Presenter de paginação.
   */
  constructor(paginationPresenter: PaginationPresenter) {
    this.paginationPresenter = new PaginationPresenter(paginationPresenter);
  }

  /**
   * Getter para os metadados da paginação.
   * @returns Metadados da paginação.
   */
  @Expose({ name: 'meta' })
  get meta(): PaginationPresenter {
    return this.paginationPresenter;
  }

  /**
   * Getter para os dados da coleção.
   * @returns Dados da coleção.
   */
  abstract get data(): any;
}
