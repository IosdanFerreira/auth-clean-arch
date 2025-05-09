export interface ValidatorStrategyInterface<T> {
  validate(data: T): void;
}
