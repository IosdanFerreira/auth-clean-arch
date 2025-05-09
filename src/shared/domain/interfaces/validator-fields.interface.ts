import { FieldsErrors } from '../types';

export interface ValidatorFieldsInterface<ValidatedProps> {
  error: FieldsErrors;
  validatedData: ValidatedProps;
  validate(data: any): void;
}
