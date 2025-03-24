import { UpdateUserInput } from '@src/application/use-cases/user/update-user.use-case';

export class UpdateUserDto implements Omit<UpdateUserInput, 'id'> {
  name: string;
}
