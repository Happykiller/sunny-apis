// src\usecases\passkey\create.passkey.usecase.ts
import { RegistrationInfo } from '@passwordless-id/webauthn/dist/esm/types';

import { ERRORS } from '../../common/ERROR';
import PasskeyUsecaseModel from './model/passkey.usecase.model';
import CreatePasskeyUsecaseDto from './dto/create.passkey.usecase.dto';

export class CreatePasskeyUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  async execute(dto: CreatePasskeyUsecaseDto): Promise<PasskeyUsecaseModel> {
    try {

      const expected = {
        challenge: dto.challenge,
        origin: (origin) => origin.includes(dto.hostname),
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
