import { validate as uuidValidate } from 'uuid';
import { Entity } from '../../entity';
import { beforeEach } from 'node:test';

type StubProps = {
  prop1: number;
  prop2: string;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  let props: StubProps;

  beforeEach(() => {
    props = { prop1: 1, prop2: 'value' };
  });

  it('should set props and ID to StubEntity', () => {
    const entity = new StubEntity(props);

    expect(entity.props).toStrictEqual(props);
    expect(entity._id).not.toBeNull();
    expect(uuidValidate(entity._id)).toBeTruthy();
  });

  it('should accept a valide uuid', () => {
    const id = '698b0c7e-c68b-4cfd-99dd-aac08024be8d';
    const entity = new StubEntity(props, id);

    expect(uuidValidate(entity._id)).toBeTruthy();
    expect(entity._id).toBe(id);
  });

  it('should convert a entity to JSON', () => {
    const id = '698b0c7e-c68b-4cfd-99dd-aac08024be8d';
    const entity = new StubEntity(props, id);

    expect(entity.toJson()).toStrictEqual({ id, ...props });
  });
});
