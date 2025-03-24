import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserOutputMapper } from '../../user-output.dto';

describe('UserOutputMapper unit tests', () => {
  it('should convert a user in output', () => {
    const entity = new UserEntity(UserDataBuilder({}));

    const spyToJson = jest.spyOn(entity, 'toJson');
    const sut = UserOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJson());
  });
});
