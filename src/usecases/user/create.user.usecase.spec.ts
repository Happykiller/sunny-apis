// src\usecases\user\create.user.usecase.spec.ts
import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { ERRORS } from '@src/common/ERROR';
import { USER_ROLE } from '@graphql/guard/userRole';
import { userRopo } from '@services/db/fake/mock/user.ropo';
import { CryptService } from '@services/crypt/crypt.service';
import { BddServiceBase } from '@services/db/db.service.base';
import { GetUserUsecase } from '@usecases/user/get.user.usecase';
import { CreateUserUsecase } from '@usecases/user/create.user.usecase';
import { MorgansService } from '@src/services/morgans/morgans.service';

describe('CreateUserUsecase', () => {
  const mockInversify: MockProxy<any> = mock<any>();
  const mockCryptService: MockProxy<CryptService> = mock<CryptService>();
  const mockBddService: MockProxy<BddServiceBase> = mock<BddServiceBase>();
  const mockMorgansService: MockProxy<MorgansService> = mock<MorgansService>();
  const mockGetUserUsecase: MockProxy<GetUserUsecase> = mock<GetUserUsecase>();

  mockInversify.bddService = mockBddService;
  mockInversify.cryptService = mockCryptService;
  mockInversify.getUserUsecase = mockGetUserUsecase;
  mockInversify.morgansService = mockMorgansService;

  const usecase: CreateUserUsecase = new CreateUserUsecase(mockInversify, {
    app_name: 'test'
  } as any);

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

    // Le mail part sans être attendu : son rejet ne peut pas être rattrapé par
    // le try/catch qui l'entoure. Sans gestionnaire, Node tue le process — un
    // service de mail injoignable faisait tomber l'API sur chaque création.
    it('should survive a mail service that rejects', async () => {
      // arrange
      mockInversify.getUserUsecase.execute = jest
        .fn()
        .mockRejectedValue(new Error(ERRORS.GET_USER_USECASE_USER_NOT_FOUND));
      mockInversify.morgansService.sendWelcome = jest
        .fn()
        .mockRejectedValue(new Error('getaddrinfo ENOTFOUND morgans'));
      // Ce spec ne câble pas de logger : le usecase en réclame un sur ce chemin.
      mockInversify.loggerService = { error: jest.fn(), log: jest.fn(), info: jest.fn() };
      const rejets: unknown[] = [];
      const capture = (e: unknown) => rejets.push(e);
      process.on('unhandledRejection', capture);

      // act
      const response = await usecase.execute({
        code: 'ropo',
        name_first: 'Robert',
        name_last: 'Paulson',
        description: 'un compte',
        mail: 'r.paulson@bob.com',
        password: 'en-clair',
      });
      // laisse la file de microtâches s'écouler
      await new Promise((r) => setImmediate(r));
      process.off('unhandledRejection', capture);

      // assert
      expect(response).toBeDefined();
      expect(rejets).toEqual([]);
      expect(mockInversify.loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining('Error while send mail'),
      );
    });
  });
});
