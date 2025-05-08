import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { Inversify } from '@src/inversify/investify';
import { AuthUsecase } from '@usecase/auth/auth.usecase';
import { USER_ROLE } from '@presentation/guard/userRole';
import { CryptService } from '@service/crypt/crypt.service';
import { GetUserUsecase } from '@usecase/user/get.user.usecase';

describe('AuthUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockGetUserUsecase: MockProxy<GetUserUsecase> = mock<GetUserUsecase>();
  const mockCryptService: MockProxy<CryptService> = mock<CryptService>();

  mockInversify.cryptService = mockCryptService;
  mockInversify.getUserUsecase = mockGetUserUsecase;

  const usecase: AuthUsecase = new AuthUsecase(mockInversify);

  describe('#execute', () => {
    it('should build', () => {
      // arrange
      // act
      // assert
      expect(usecase).toBeDefined();
    });

    it('should get response of auth', async () => {
      // arrange
      const data = {
        id: '65d4d015261e894a1da31a65',
        code: 'faro',
        name_first: 'Fabrice',
        name_last: 'Rosito',
        description: 'Admin',
        mail: 'fabrice.rosito@gmail.com',
        role: 'USER',
      };
      mockGetUserUsecase.execute.mockResolvedValue({
        active: true,
        password: 'password',
        ...data,
        role: USER_ROLE.USER,
      });
      mockCryptService.crypt.mockReturnValue('password');
      // act
      const response = await usecase.execute({
        login: 'login',
        password: 'password',
      });
      // assert
      expect(response).toEqual(data);
    });

    it('should get response wrong credential', async () => {
      // arrange
      mockGetUserUsecase.execute.mockResolvedValue({
        id: '65d4d015261e894a1da31a65',
        code: 'faro',
        password: 'password',
        name_first: 'Fabrice',
        name_last: 'Rosito',
        description: 'Admin',
        mail: 'fabrice.rosito@gmail.com',
        active: true,
        role: USER_ROLE.USER,
      });
      mockCryptService.crypt.mockReturnValue('wrong');
      // act
      const response = await usecase.execute({
        login: 'login',
        password: 'password',
      });
      // assert
      expect(response).toEqual(null);
    });
  });
});
