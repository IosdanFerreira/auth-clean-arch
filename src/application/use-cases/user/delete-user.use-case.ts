import { UserRepository } from '@src/domain/repositories/user.repository';

export class DeleteUser {
  constructor(private userRepository: UserRepository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    await this.userRepository.findByID(input.id);

    await this.userRepository.delete(input.id);
  }
}

export type DeleteUserInput = {
  id: string;
};

export type DeleteUserOutput = void;
