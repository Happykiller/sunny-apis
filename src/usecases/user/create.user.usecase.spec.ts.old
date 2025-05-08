import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { ERRORS } from '@src/common/ERROR';
import { BddService } from '@service/db/db.service';
import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { userRopo } from '@service/db/fake/mock/user.ropo';
import { CryptService } from '@service/crypt/crypt.service';
import { GetUserUsecase } from '@usecase/user/get.user.usecase';
import { CreateUserUsecase } from '@usecase/user/create.user.usecase';

describe('CreateUserUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockBddService: MockProxy<BddService> = mock<BddService>();
  const mockCryptService: MockProxy<CryptService> = mock<CryptService>();
  const mockGetUserUsecase: MockProxy<GetUserUsecase> = mock<GetUserUsecase>();

  mockInversify.bddService = mockBddService;
  mockInversify.cryptService = mockCryptService;
  mockInversify.getUserUsecase = mockGetUserUsecase;

  const usecase: CreateUserUsecase = new CreateUserUsecase(mockInversify);

  describe('#execute', () => {
    it('should build', () => {
      // arrange
      // act
      // assert
      expect(usecase).toBeDefined();
    });

    it('should create a user', async () => {
      // arrange
      const data = {
        code: 'ropo',
        password: 'password',
        name_first: 'Robert',
        name_last: 'Paulson',
        description: 'password with secret secretKey',
        mail: 'r.paulson@bob.com',
      };
      const expected = {
        id: '65d4d015261e894a1da31a64',
        ...data,
        role: USER_ROLE.USER,
        active: true,
      };
      mockBddService.createUser.mockResolvedValue(expected);
      mockCryptService.crypt.mockReturnValue('password');
      // act
      const response = await usecase.execute(data);
      // assert
      expect(response).toEqual(expected);
    });

    it('should already exist', async () => {
      // arrange
      mockGetUserUsecase.execute.mockResolvedValue(userRopo);
      const data = {
        code: 'ropo',
        password: 'password',
        name_first: 'Robert',
        name_last: 'Paulson',
        description: 'password with secret secretKey',
        mail: 'r.paulson@bob.com',
      };
      // act
      let error;
      try {
        await usecase.execute(data);
      } catch (e) {
        error = e.message;
      }
      // assert
      expect(error).toEqual(ERRORS.CREATE_USER_USECASE_USER_ALREADY_EXIST);
    });
  });
});
