import { Entity } from '@src/shared/domain/entities/entity';
import { InMemoryRepository } from '../../in-memory.repository';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';

type EntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<EntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'teste', price: 1234 });
    await sut.insert(entity);

    expect(sut.items[0].toJson()).toStrictEqual(entity.toJson());
  });

  it('should throw an error when not found entity by ID', async () => {
    await expect(sut.findByID('rejectID')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('should find entity by ID', async () => {
    const entity = new StubEntity({ name: 'test', price: 1234 });

    await sut.insert(entity);

    const result = await sut.findByID(entity._id);

    expect(entity.toJson()).toStrictEqual(result.toJson());
  });

  it('should find all entities', async () => {
    const entity = new StubEntity({ name: 'test', price: 1234 });

    await sut.insert(entity);

    const result = await sut.findAll();

    expect([entity]).toStrictEqual(result);
  });

  it('should update entity', async () => {
    const entity = new StubEntity({ name: 'test', price: 1234 });

    await sut.insert(entity);

    const entityUpdated = new StubEntity({ name: 'updatedTest', price: 1234 });

    await sut.update(entity._id, entityUpdated);

    expect(sut.items[0].toJson()).toStrictEqual(entityUpdated.toJson());
  });

  it('should throw an error when try update entity with a invalid ID', async () => {
    const entity = new StubEntity({ name: 'test', price: 1234 });

    expect(sut.update(entity._id, entity)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('should delete entity ', async () => {
    const entity = new StubEntity({ name: 'test', price: 1234 });

    await sut.insert(entity);

    await sut.delete(entity._id);

    expect(sut.items).toHaveLength(0);
  });

  it('should throw an error when try delete entity with a invalid ID', async () => {
    const entity = new StubEntity({ name: 'test', price: 1234 });

    expect(sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });
});
