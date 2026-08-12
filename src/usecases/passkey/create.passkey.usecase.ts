// src\usecases\passkey\create.passkey.usecase.ts
import { RegistrationInfo } from '@passwordless-id/webauthn/dist/esm/types';

import { ERRORS } from '../../common/ERROR';
import PasskeyUsecaseModel from './model/passkey.usecase.model';
import CreatePasskeyUsecaseDto from './dto/create.passkey.usecase.dto';
import { challengeServiceParDefaut } from '../../services/challenge/challenge.service.memory';

export class CreatePasskeyUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  private get challenges() {
    return this.inversify.challengeService ?? challengeServiceParDefaut;
  }

  async execute(dto: CreatePasskeyUsecaseDto): Promise<PasskeyUsecaseModel> {
    try {

      // Le challenge était celui que le client venait d'inventer, et qu'on
      // vérifiait donc contre lui-même : la cérémonie ne prouvait rien de la
      // fraîcheur de l'enregistrement. Il vient maintenant du serveur
      // (`passkey_register_options`) et n'est acceptable qu'une fois.
      // L'origine est comparée par égalité d'hôte : `includes` acceptait toute
      // origine contenant la chaîne attendue, où qu'elle se trouve.
      const expected = {
        challenge: (challenge: string) => this.challenges.consume(challenge),
        origin: (origin: string) => {
          try {
            return new URL(origin).hostname === dto.hostname;
          } catch {
            return false;
          }
        },
      }
      const registrationParsed:RegistrationInfo = await this.inversify.passwordLessService.verifyRegistration(dto.registration, expected);
      //this.inversify.loggerService.debug('registrationParsed', registrationParsed);

      return this.inversify.bddService.createPasskey({
        ...dto,
        registrationParsed
      });
    } catch (e) {
      this.inversify.loggerService.error(`AuthPasskeyUsecase => ${e.message}`);
      throw new Error(ERRORS.CREATE_PASSKEY_USECASE_FAIL);
    }
  }
}
