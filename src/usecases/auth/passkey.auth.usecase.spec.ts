// src\usecases\auth\passkey.auth.usecase.spec.ts
import { LoggerService } from '@nestjs/common';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { ERRORS } from '@src/common/ERROR';
import { USER_ROLE } from '@graphql/guard/userRole';
import { BddServiceBase } from '@services/db/db.service.base';
import { GetUserUsecase } from '@usecases/user/get.user.usecase';
import { AuthPasskeyUsecase } from '@usecases/auth/passkey.auth.usecase';
import { ChallengeService } from '@services/challenge/challenge.service';
import { PasswordLessService } from '@services/passwordless/passwordless.service';

/**
 * Ce que ces tests verrouillent, et qui n'était vérifié nulle part :
 *
 * - **la credential désigne le compte** — la version précédente ouvrait la
 *   session sur le `user_code` reçu du client sans jamais le confronter à la
 *   credential signée, ce qui donnait à toute passkey valide l'accès à
 *   n'importe quel compte ;
 * - **le challenge est consommé** — il venait de la base, figé à
 *   l'enregistrement, donc rejouable indéfiniment ;
 * - **l'origine est comparée par égalité d'hôte** — `includes` acceptait toute
 *   origine contenant la chaîne attendue, où qu'elle se trouve.
 *
 * Les fixtures sont réduites à leur forme : la cryptographie est celle de
 * `@passwordless-id/webauthn`, ce n'est pas elle qu'on teste ici.
 */
const CREDENTIAL = { id: 'credential-de-invite', publicKey: 'cle-publique' };

const passkeyDe = (user_id: string) =>
  ({
    id: 'passkey-1',
    user_id,
    hostname: 'exemple.test',
    registrationParsed: { credential: CREDENTIAL },
  }) as any;

const compte = (id: string, code: string) =>
  ({
    id,
    code,
    name_first: 'P',
    name_last: 'N',
    description: '',
    mail: `${code}@exemple.test`,
    role: USER_ROLE.USER,
    active: true,
    password: 'hash',
  }) as any;

const assertion = { id: 'credential-de-invite' } as any;

describe('AuthPasskeyUsecase', () => {
  let mockInversify: MockProxy<any>;
  let mockBddService: MockProxy<BddServiceBase>;
  let mockLoggerService: MockProxy<LoggerService>;
  let mockGetUserUsecase: MockProxy<GetUserUsecase>;
  let mockChallengeService: MockProxy<ChallengeService>;
  let mockPasswordLessService: MockProxy<PasswordLessService>;
  let usecase: AuthPasskeyUsecase;

  beforeEach(() => {
    mockInversify = mock<any>();
    mockBddService = mock<BddServiceBase>();
    mockLoggerService = mock<LoggerService>();
    mockGetUserUsecase = mock<GetUserUsecase>();
    mockChallengeService = mock<ChallengeService>();
    mockPasswordLessService = mock<PasswordLessService>();

    mockInversify.bddService = mockBddService;
    mockInversify.loggerService = mockLoggerService;
    mockInversify.getUserUsecase = mockGetUserUsecase;
    mockInversify.challengeService = mockChallengeService;
    mockInversify.passwordLessService = mockPasswordLessService;

    mockPasswordLessService.verifyAuthentication.mockResolvedValue(null);
    mockChallengeService.consume.mockResolvedValue(true);

    usecase = new AuthPasskeyUsecase(mockInversify);
  });

  const attendu = () =>
    (mockPasswordLessService.verifyAuthentication as any).mock.calls[0][2];

  it('should build', () => {
    expect(usecase).toBeDefined();
  });

  it('ouvre la session sur le propriétaire de la credential', async () => {
    mockBddService.getPasskey.mockResolvedValue(passkeyDe('user-4'));
    mockGetUserUsecase.execute.mockResolvedValue(compte('user-4', 'invite'));

    const session = await usecase.execute({
      user_code: 'invite',
      authentication: assertion,
    });

    expect(session.id).toEqual('user-4');
    expect(session.code).toEqual('invite');
    expect(mockGetUserUsecase.execute).toHaveBeenCalledWith({ id: 'user-4' });
  });

  it('refuse une credential présentée sous l’identité d’un autre compte', async () => {
    // Le scénario d'usurpation : la credential appartient au compte « invite »,
    // la requête réclame une session pour « admin ».
    mockBddService.getPasskey.mockResolvedValue(passkeyDe('user-4'));
    mockGetUserUsecase.execute.mockResolvedValue(compte('user-4', 'invite'));

    await expect(
      usecase.execute({ user_code: 'admin', authentication: assertion }),
    ).rejects.toThrow(ERRORS.AUTH_PASSKEY_USECASE_FAIL);

    expect(mockPasswordLessService.verifyAuthentication).not.toHaveBeenCalled();
  });

  it('se connecte sans user_code', async () => {
    // Une passkey synchronisée ouverte sur un poste neuf n'apporte aucun
    // identifiant : la credential suffit à savoir qui se connecte.
    mockBddService.getPasskey.mockResolvedValue(passkeyDe('user-4'));
    mockGetUserUsecase.execute.mockResolvedValue(compte('user-4', 'invite'));

    const session = await usecase.execute({ authentication: assertion } as any);

    expect(session.code).toEqual('invite');
  });

  it('refuse une credential inconnue', async () => {
    mockBddService.getPasskey.mockResolvedValue(null);

    await expect(
      usecase.execute({ authentication: assertion } as any),
    ).rejects.toThrow(ERRORS.AUTH_PASSKEY_USECASE_FAIL);
  });

  it('consomme le challenge au lieu de relire celui de la base', async () => {
    mockBddService.getPasskey.mockResolvedValue(passkeyDe('user-4'));
    mockGetUserUsecase.execute.mockResolvedValue(compte('user-4', 'invite'));

    await usecase.execute({ authentication: assertion } as any);
    await attendu().challenge('un-challenge');

    expect(mockChallengeService.consume).toHaveBeenCalledWith('un-challenge');
  });

  it('n’accepte que l’hôte exact de la passkey', async () => {
    mockBddService.getPasskey.mockResolvedValue(passkeyDe('user-4'));
    mockGetUserUsecase.execute.mockResolvedValue(compte('user-4', 'invite'));

    await usecase.execute({ authentication: assertion } as any);

    expect(attendu().origin('https://exemple.test/login')).toBe(true);
    // Le prédicat précédent, fondé sur `includes`, acceptait celle-ci.
    expect(attendu().origin('https://exemple.test.attaquant.com/')).toBe(false);
    expect(attendu().origin('pas-une-url')).toBe(false);
  });

  it('should not found', async () => {
    mockBddService.getPasskey.mockResolvedValue(passkeyDe('user-4'));
    mockGetUserUsecase.execute.mockRejectedValue(
      new Error(ERRORS.GET_USER_USECASE_USER_NOT_FOUND),
    );

    await expect(
      usecase.execute({ authentication: assertion } as any),
    ).rejects.toThrow(ERRORS.AUTH_PASSKEY_USECASE_FAIL);
  });
});
