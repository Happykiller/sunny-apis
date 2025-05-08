import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { BddService } from '@service/db/db.service';
import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { GetAllUserUsecase } from '@usecase/user/get_all.user.usecase';

describe('GetAllUserUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockBddService: MockProxy<BddService> = mock<BddService>();

  mockInversify.bddService = mockBddService;

  const usecase: GetAllUserUsecase = new GetAllUserUsecase(mockInversify);

  describe('#execute', () => {
    it('should build', () => {
      // arrange
      // act
      // assert
      expect(usecase).toBeDefined();
    });

    it('should get all users', async () => {
      // arrange
      const data = [
        {
          id: '65d4d015261e894a1da31a64',
          code: 'ropo',
          password:
            'WV5FXp063tPBcccZbqAHH0B93s2Wzf/nTXu8UaU2TeCMh+F0OsXUX02HNsI1Ytd2yowsT707bKCV0KC5uA0usQ==',
          name_first: 'Robert',
          name_last: 'Paulson',
          description: 'password with secret secretKey',
          mail: 'r.paulson@bob.com',
          role: USER_ROLE.USER,
          active: true,
        },
      ];
      mockBddService.getAllUser.mockResolvedValue(data);
      // act
      const response = await usecase.execute();
      // assert
      expect(response).toEqual(data);
    });
  });
});
