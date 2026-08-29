// src\usecases\user\update.user.usecase.spec.ts
import { describe, expect, it, beforeEach } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { ERRORS } from '@src/common/ERROR';
import { USER_ROLE } from '@graphql/guard/userRole';
import { BddServiceBase } from '@services/db/db.service.base';
import { UpdateUserUsecase } from '@usecases/user/update.user.usecase';

describe('UpdateUserUsecase', () => {
  const USER_ID = '65d4d015261e894a1da31a64';

  const utilisateur = (surcharge: any = {}) => ({
    id: USER_ID,
    code: 'ropo',
    password: 'hash-existant',
    name_first: 'Robert',
    name_last: 'Paulson',
    description: 'un compte',
    mail: 'r.paulson@bob.com',
    role: USER_ROLE.USER,
    active: true,
    ...surcharge,
  });

  let mockInversify: MockProxy<any>;
  let mockBddService: MockProxy<BddServiceBase>;
  let usecase: UpdateUserUsecase;

  beforeEach(() => {
    mockInversify = mock<any>();
    mockBddService = mock<BddServiceBase>();
    mockInversify.bddService = mockBddService;
    mockInversify.getUserUsecase = {
      execute: jest.fn().mockResolvedValue(utilisateur()),
    };
    mockInversify.cryptService = {
      crypt: jest.fn().mockReturnValue('hash-calcule'),
    };
    mockBddService.updateUser.mockImplementation(async (dto: any) =>
      utilisateur(dto),
    );
    usecase = new UpdateUserUsecase(mockInversify);
  });

  describe('#execute', () => {
    it('should build', () => {
      expect(usecase).toBeDefined();
    });

    // Le compte à réactiver est inactif : sans include_inactive, la lecture
    // échoue et la réactivation devient impossible par l'API.
    it('should read the account even when it is deactivated', async () => {
      await usecase.execute({ user_id: USER_ID, active: true });

      expect(mockInversify.getUserUsecase.execute).toHaveBeenCalledWith({
        id: USER_ID,
        include_inactive: true,
      });
    });

    // `active: false` est falsy : un `if (dto.active)` l'aurait perdu.
    it('should forward active:false to the db layer', async () => {
      await usecase.execute({ user_id: USER_ID, active: false });

      expect(mockBddService.updateUser).toHaveBeenCalledWith({
        user_id: USER_ID,
        active: false,
      });
    });

    // Un mot de passe transmis en clair fermerait le compte définitivement.
    it('should hash the password before writing it', async () => {
      await usecase.execute({ user_id: USER_ID, password: 'en-clair' });

      expect(mockInversify.cryptService.crypt).toHaveBeenCalledWith({
        message: 'en-clair',
      });
      expect(mockBddService.updateUser).toHaveBeenCalledWith({
        user_id: USER_ID,
        password: 'hash-calcule',
      });
    });

    // Un champ absent ne doit pas descendre en `undefined` jusqu'au $set.
    it('should only forward the fields actually provided', async () => {
      await usecase.execute({ user_id: USER_ID, mail: 'neuf@bob.com' });

      expect(mockBddService.updateUser).toHaveBeenCalledWith({
        user_id: USER_ID,
        mail: 'neuf@bob.com',
      });
    });

    // Se désactiver soi-même verrouille dehors sans recours : le guard relit
    // l'utilisateur en base à chaque requête et rejette tout compte inactif.
    it('should refuse self deactivation', async () => {
      let error;
      try {
        await usecase.execute({
          user_id: USER_ID,
          active: false,
          requester_id: USER_ID,
        });
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual(ERRORS.UPDATE_USER_USECASE_SELF_DEACTIVATION);
      expect(mockBddService.updateUser).not.toHaveBeenCalled();
    });

    it('should allow deactivating someone else', async () => {
      await usecase.execute({
        user_id: USER_ID,
        active: false,
        requester_id: 'un-autre-admin',
      });

      expect(mockBddService.updateUser).toHaveBeenCalled();
    });

    // Deux comptes partageant le même code rendraient la connexion ambiguë.
    it('should refuse a code already taken by someone else', async () => {
      mockInversify.getUserUsecase.execute = jest
        .fn()
        .mockResolvedValueOnce(utilisateur())
        .mockResolvedValueOnce(utilisateur({ id: 'un-autre-id', code: 'pris' }));

      let error;
      try {
        await usecase.execute({ user_id: USER_ID, code: 'pris' });
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual(ERRORS.UPDATE_USER_USECASE_CODE_ALREADY_USED);
      expect(mockBddService.updateUser).not.toHaveBeenCalled();
    });

    it('should accept a code that nobody holds', async () => {
      mockInversify.getUserUsecase.execute = jest
        .fn()
        .mockResolvedValueOnce(utilisateur())
        .mockRejectedValueOnce(
          new Error(ERRORS.GET_USER_USECASE_USER_NOT_FOUND),
        );

      await usecase.execute({ user_id: USER_ID, code: 'libre' });

      expect(mockBddService.updateUser).toHaveBeenCalledWith({
        user_id: USER_ID,
        code: 'libre',
      });
    });

    // Réécrire son propre code à l'identique ne doit pas passer pour un conflit.
    it('should not treat an unchanged code as a conflict', async () => {
      await usecase.execute({ user_id: USER_ID, code: 'ropo' });

      expect(mockInversify.getUserUsecase.execute).toHaveBeenCalledTimes(1);
      expect(mockBddService.updateUser).toHaveBeenCalled();
    });
  });
});
