export interface ValidatorInterface<T> {
  validate(input: T): void;
}
