// src\usecases\auth\passkey.auth.usecase.ts
import { ERRORS } from '../../common/ERROR';
import { UserUsecaseModel } from '../user/model/user.usecase.model';
import { PasskeyAuthUsecaseDto } from './dto/passkey.auth.usecase.dto';
import { UserSessionUsecaseModel } from '../user/model/userSession.usecase.model';
import { challengeServiceParDefaut } from '../../services/challenge/challenge.service.memory';

/**
 * Authentification par passkey.
 *
 * Trois propriétés tiennent ce usecase, chacune corrigeant un défaut de la
 * version précédente :
 *
 * 1. **La credential désigne le compte.** On partait auparavant du `user_code`
 *    envoyé par le client, on vérifiait la signature d'une credential
 *    quelconque, et on ouvrait la session sur le premier sans jamais confronter
 *    les deux : le porteur d'une passkey valide obtenait une session sur
 *    n'importe quel compte, rôle compris. Ici le `user_code` est facultatif et
 *    n'est qu'une assertion à confirmer.
 * 2. **Le challenge est émis par le serveur et ne sert qu'une fois.** On
 *    réutilisait celui figé en base à l'enregistrement — constant pour la durée
 *    de vie de la passkey, donc rejouable indéfiniment. Il est désormais
 *    consommé au moment de la vérification (`challengeService`).
 * 3. **L'origine est comparée par égalité d'hôte.** Le prédicat
 *    `origin.includes(hostname)` acceptait toute origine contenant la chaîne
 *    stockée, où qu'elle se trouve.
 *
 * Le `user_code` facultatif n'est pas qu'une conséquence : c'est ce qui rend
 * possible la connexion sans identifiant, seul parcours utilisable quand la
 * passkey est synchronisée sur un poste où le navigateur ne sait rien.
 */
export class AuthPasskeyUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  private get challenges() {
    return this.inversify.challengeService ?? challengeServiceParDefaut;
  }

  async execute(dto: PasskeyAuthUsecaseDto): Promise<UserSessionUsecaseModel> {
    try {
      const passkey = await this.inversify.bddService.getPasskey({
        credential_id: dto.authentication.id,
      });

      if (!passkey) {
        throw new Error(`unknown credential ${dto.authentication.id}`);
      }

      const user: UserUsecaseModel = await this.inversify.getUserUsecase.execute(
        {
          id: passkey.user_id,
        },
      );

      // Le client peut nommer un utilisateur — il ne peut pas en désigner un
      // autre que celui de la credential qu'il présente.
      if (dto.user_code && dto.user_code !== user.code) {
        throw new Error(
          `credential of user ${user.code} presented as ${dto.user_code}`,
        );
      }

      const expected: any = {
        // Prédicat plutôt que valeur : la vérification et la consommation du
        // challenge deviennent le même geste, impossible à oublier.
        challenge: (challenge: string) => this.challenges.consume(challenge),
        origin: (origin: string) => {
          try {
            return new URL(origin).hostname === passkey.hostname;
          } catch {
            return false;
          }
        },
        userVerified: true,
        verbose: false,
      };

      await this.inversify.passwordLessService.verifyAuthentication(
        dto.authentication,
        passkey.registrationParsed.credential,
        expected,
      );

      return {
        id: user.id,
        code: user.code,
        name_first: user.name_first,
        name_last: user.name_last,
        description: user.description,
        mail: user.mail,
        role: user.role,
      };
    } catch (e) {
      // Le client reçoit toujours le même code : distinguer « credential
      // inconnue » de « signature invalide » le renseignerait sur ce qui existe
      // en base. Le détail reste au journal.
      this.inversify.loggerService.error(`AuthPasskeyUsecase => ${e.message}`);
      throw new Error(ERRORS.AUTH_PASSKEY_USECASE_FAIL);
    }
  }
}
