// src\usecases\passkey\options.register.passkey.usecase.ts
import { randomUUID } from 'crypto';

import { ERRORS } from '../../common/ERROR';
import PasskeyDbModel from '../../services/db/model/passkey.db.model';
import { challengeServiceParDefaut } from '../../services/challenge/challenge.service.memory';

export interface RegisterOptionsUsecaseModel {
  /** Émis par le serveur, valable une fois. */
  challenge: string;
  /**
   * Le « user handle » WebAuthn — l'identifiant opaque sous lequel le
   * gestionnaire de mots de passe range le compte.
   */
  user_handle: string;
  /** Les credentials déjà enregistrées, à ne pas dupliquer. */
  exclude_credentials: string[];
}

/**
 * Amorce une cérémonie d'enregistrement, pour un utilisateur **déjà
 * authentifié**.
 *
 * Le point délicat est le `user_handle`. La bibliothèque cliente en génère un
 * au hasard quand on ne lui en donne pas — c'est ce qui se passait jusqu'ici,
 * et il changeait donc **à chaque enregistrement** : le gestionnaire de mots de
 * passe voyait autant de comptes différents que de clés, et rien ne permettait
 * de remonter d'une assertion au compte. La spec demande l'inverse : un
 * identifiant stable par compte, opaque, non devinable, et surtout jamais une
 * donnée personnelle (WebAuthn L3, §5.4.3 et §14.6.1) — d'où un UUID plutôt
 * que le code utilisateur ou son adresse.
 *
 * On le retrouve **sans nouvelle colonne** : le handle d'origine est déjà
 * conservé dans le JSON `registration` des passkeys existantes. Le premier
 * trouvé fait foi ; à défaut, on en crée un. Une base existante se met donc à
 * jour d'elle-même, sans migration ni ré-enregistrement.
 */
export class OptionsRegisterPasskeyUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  private get challenges() {
    return this.inversify.challengeService ?? challengeServiceParDefaut;
  }

  async execute(dto: { user_id: string }): Promise<RegisterOptionsUsecaseModel> {
    try {
      const passkeys: PasskeyDbModel[] =
        (await this.inversify.bddService.getPasskeyByUserId({
          user_id: dto.user_id,
        })) ?? [];

      const handleConnu = passkeys
        .map((passkey) => passkey.registration?.user?.id)
        .find((handle) => !!handle);

      return {
        challenge: await this.challenges.issue(),
        user_handle: handleConnu ?? randomUUID(),
        // Sans cette liste, l'utilisateur qui relance l'enregistrement chez le
        // même fournisseur y accumule des clés en double, toutes valides et
        // impossibles à distinguer dans son gestionnaire.
        exclude_credentials: passkeys
          .map((passkey) => passkey.registration?.id)
          .filter((id) => !!id),
      };
    } catch (e) {
      this.inversify.loggerService.error(
        `OptionsRegisterPasskeyUsecase => ${e.message}`,
      );
      throw new Error(ERRORS.CREATE_PASSKEY_USECASE_FAIL);
    }
  }
}
