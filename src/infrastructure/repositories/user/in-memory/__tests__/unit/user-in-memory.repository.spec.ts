import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserInMemoryRepository } from '../../user-in-memory.repository';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { ConflictError } from '@src/shared/domain/errors/conflict-error';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('Should throw error when not found - findByEmail method', async () => {
    await expect(sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError('User not found using a@a.com'),
    );
  });

  it('Should find a entity by email - findByEmail method', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await sut.insert(entity);

    const result = await sut.findByEmail(entity.email);

    expect(entity.toJson()).toStrictEqual(result.toJson());
  });

  it('Should throw error when not found - emailExists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await sut.insert(entity);

    await expect(sut.emailExist(entity.email)).rejects.toThrow(
      new ConflictError('User already exist'),
    );
  });

  it('Should find a entity by email - emailExists method', async () => {
    expect.assertions(0);
    await sut.emailExist('a@a.com');
  });

  it('Should find a entity by ID', async () => {
    const input = new UserEntity(UserDataBuilder({}));

    await sut.insert(input);

    const output = await sut.findByID(input._id);

    expect(output._id).toBeDefined();
    expect(output.name).toStrictEqual(input.name);
    expect(output.email).toStrictEqual(input.email);
    expect(output.createdAt).toStrictEqual(input.createdAt);
  });

  it('Should throw error when a user not found', async () => {
    const input = new UserEntity(UserDataBuilder({}));

    await sut.insert(input);

    expect(sut.findByID('wrong_id')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should no filter items when filter object is null', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await sut.insert(entity);

    const result = await sut.findAll();

    const spyFilter = jest.spyOn(result, 'filter');

    const itemsFiltered = await sut['applyFilter'](result, null);

    expect(spyFilter).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(result);
  });

  it('Should filter name field using filter param', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'fake' })),
    ];

    const spyFilter = jest.spyOn(items, 'filter');

    const itemsFiltered = await sut['applyFilter'](items, 'TEST');

    expect(spyFilter).toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('Should sort by createAt when sort param is null', async () => {
    const createdAt = new Date();

    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test', createdAt })),

      new UserEntity(
        UserDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),

      new UserEntity(
        UserDataBuilder({
          name: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ];

    const itemsSorted = await sut['applySort'](items, null, null);

    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('Should sort by name field', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'c' })),
      new UserEntity(
        UserDataBuilder({
          name: 'd',
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'a',
        }),
      ),
    ];

    let itemsSorted = await sut['applySort'](items, 'name', 'asc');

    expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);

    itemsSorted = await sut['applySort'](items, 'name', null);

    expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
  });
});
