import { Entity } from '@src/shared/domain/entities/Entity';
import { InMemoryRepository } from '../../in-memory.repository';

class FakeEntity extends Entity {
  constructor(
    public props: any,
    id: string,
  ) {
    super(props, id);
  }
}

describe('InMemoryRepository', () => {
  let sut: InMemoryRepository<FakeEntity>;
  let entity: FakeEntity;

  beforeEach(() => {
    sut = new InMemoryRepository<FakeEntity>();
    entity = new FakeEntity({ name: 'Test Entity' }, 'some-id');
  });

  describe('insert', () => {
    it('should insert a new entity', async () => {
      // Arrange
      // Act
      await sut.insert(entity);
      const result = await sut.findAll();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(entity);
    });
  });

  describe('findByID', () => {
    it('should return the entity if found', async () => {
      // Arrange
      await sut.insert(entity);

      // Act
      const result = await sut.findByID(entity.id);

      // Assert
      expect(result).toEqual(entity);
    });

    it('should throw if entity not found', async () => {
      // Arrange
      const invalidId = 'non-existing-id';

      // Act & Assert
      await expect(sut.findByID(invalidId)).rejects.toThrow('Entity not found');
    });
  });

  describe('update', () => {
    it('should update the entity if it exists', async () => {
      // Arrange
      await sut.insert(entity);
      const updatedEntity = new FakeEntity(
        { name: 'Updated Entity' },
        entity.id,
      );
      Object.defineProperty(updatedEntity, 'id', { value: entity.id });

      // Act
      await sut.update(entity.id, updatedEntity);
      const result = await sut.findByID(entity.id);

      // Assert
      expect(result.props.name).toBe('Updated Entity');
    });

    it('should throw if entity does not exist', async () => {
      // Arrange
      const fakeEntity = new FakeEntity({ name: 'Fake' }, 'fake-id');

      // Act & Assert
      await expect(sut.update(fakeEntity.id, fakeEntity)).rejects.toThrow(
        'Entity not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete the entity if it exists', async () => {
      // Arrange
      await sut.insert(entity);

      // Act
      await sut.delete(entity.id);
      const result = await sut.findAll();

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should throw if entity does not exist', async () => {
      // Arrange
      const fakeId = 'non-existing-id';

      // Act & Assert
      await expect(sut.delete(fakeId)).rejects.toThrow('Entity not found');
    });
  });

  describe('findAll', () => {
    it('should return all entities', async () => {
      // Arrange
      const entity2 = new FakeEntity({ name: 'Second Entity' }, 'some-id2');
      await sut.insert(entity);
      await sut.insert(entity2);

      // Act
      const result = await sut.findAll();

      // Assert
      expect(result).toEqual([entity, entity2]);
    });
  });
});
