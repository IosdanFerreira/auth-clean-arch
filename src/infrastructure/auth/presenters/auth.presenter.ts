import { UserOutputDto } from '@src/application/use-cases/auth/dto/user-output.dto';
import { ListUsersOutput } from '@src/application/use-cases/auth/list-users.use-case';
import { CollectionPresenter } from '@src/shared/infrastructure/presenters/collection.presenter';
import { Transform } from 'class-transformer';

export class AuthPresenter {
  id: string;
  name: string;
  email: string;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: UserOutputDto) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: AuthPresenter[];

  constructor(output: ListUsersOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new AuthPresenter(item));
  }
}
