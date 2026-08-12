// src\usecases\passkey\options.auth.passkey.usecase.ts
import { ERRORS } from '../../common/ERROR';
import { challengeServiceParDefaut } from '../../services/challenge/challenge.service.memory';

/**
 * Amorce une cérémonie d'authentification : le serveur émet le challenge.
 *
 * Ce usecase est appelé **sans être authentifié**, et c'est voulu : sa réponse
 * ne contient aucune donnée liée à un utilisateur — pas de liste de
 * credentials, pas d'identifiant. C'est la condition d'un parcours sans
 * identifiant : le navigateur propose lui-même les passkeys du domaine, et le
 * serveur ne découvre qui se connecte qu'en recevant l'assertion.
 *
 * En rendre plus ouvrirait une énumération des comptes (WebAuthn L3, §14.6.2).
 */
export class OptionsAuthPasskeyUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  private get challenges() {
    return this.inversify.challengeService ?? challengeServiceParDefaut;
  }

  async execute(): Promise<{ challenge: string }> {
    try {
      return { challenge: await this.challenges.issue() };
    } catch (e) {
      this.inversify.loggerService.error(
        `OptionsAuthPasskeyUsecase => ${e.message}`,
      );
      throw new Error(ERRORS.AUTH_PASSKEY_USECASE_FAIL);
    }
  }
}
