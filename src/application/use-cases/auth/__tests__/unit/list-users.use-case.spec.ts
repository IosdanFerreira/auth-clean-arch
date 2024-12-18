import { UserInMemoryRepository } from '@src/infrastructure/repositories/user/in-memory/user-in-memory.repository';
import { ListUsers } from '../../list-users.use-case';
import { UserSearchResults } from '@src/domain/repositories/user.repository';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';

describe('ListUsers unit tests', () => {
  let sut: ListUsers;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ListUsers(repository);
  });

  it('toOutput method', () => {
    let result = new UserSearchResults({
      items: [],
      totalItems: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    });

    let output = sut['toOutput'](result);

    expect(output).toStrictEqual({
      items: [],
      totalItems: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    });

    const user = new UserEntity(UserDataBuilder({}));

    result = new UserSearchResults({
      items: [user],
      totalItems: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    });

    output = sut['toOutput'](result);

    expect(output).toStrictEqual({
      items: [user.toJson()],
      totalItems: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    });
  });

  it('Should return the users ordered by createdAt', async () => {
    const createdAt = new Date();

    const users = [
      new UserEntity(UserDataBuilder({ createdAt })),
      new UserEntity(
        UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
      ),
    ];

    repository.items = users;

    const output = await sut.execute({
      page: 0,
      perPage: 0,
      sort: '',
      sortDir: 'asc',
    });

    expect(output).toStrictEqual({
      items: [...users].reverse().map((item) => item.toJson()),
      totalItems: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    });
  });

  it('should return the users using pagination, sort and filter', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'a' })),
      new UserEntity(UserDataBuilder({ name: 'AA' })),
      new UserEntity(UserDataBuilder({ name: 'Aa' })),
      new UserEntity(UserDataBuilder({ name: 'b' })),
      new UserEntity(UserDataBuilder({ name: 'c' })),
    ];

    repository.items = items;

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    });

    expect(output).toStrictEqual({
      items: [items[1].toJson(), items[2].toJson()],
      totalItems: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0].toJson()],
      totalItems: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    });
    output = await sut.execute({
      page: 1,
      perPage: 3,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0].toJson(), items[2].toJson(), items[1].toJson()],
      totalItems: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    });
  });
});
