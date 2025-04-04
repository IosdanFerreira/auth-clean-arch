import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ClassValidatorFields } from '../../class-validator-fields';

class StubRules {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  price: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data));
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('Should validate with erros', () => {
    const validator = new StubClassValidatorFields();

    expect(validator.validate(null)).toBeFalsy();
    expect(validator.errors).toStrictEqual({
      name: [
        'name must be shorter than or equal to 255 characters',
        'name should not be empty',
        'name must be a string',
      ],
      price: [
        'price must not be less than 1',
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    });
  });

  it('Should validate without erros', () => {
    const validator = new StubClassValidatorFields();

    expect(validator.validate({ name: 'test', price: 1 })).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(
      new StubRules({ name: 'test', price: 1 }),
    );
    expect(validator.errors).toStrictEqual(null);
  });
});
