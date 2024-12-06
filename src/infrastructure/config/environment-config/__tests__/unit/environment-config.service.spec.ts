import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentConfigService } from '../../environment-config.service';
import { EnvironmentConfigModule } from '../../environment-config.module';

describe('EnvironmentConfigService unit tests', () => {
  let sut: EnvironmentConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvironmentConfigModule.forRoot()],
      providers: [EnvironmentConfigService],
    }).compile();

    sut = module.get<EnvironmentConfigService>(EnvironmentConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return the variable PORT', () => {
    expect(sut.getAppPort()).toBe(3000);
  });

  it('should return the variable NODE_ENV', () => {
    expect(sut.getNodeEnv()).toBe('test');
  });
});
