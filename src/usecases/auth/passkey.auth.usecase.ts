// src\usecases\auth\passkey.auth.usecase.ts
import { ERRORS } from '../../common/ERROR';
import { UserUsecaseModel } from '../user/model/user.usecase.model';
import { PasskeyAuthUsecaseDto } from './dto/passkey.auth.usecase.dto';
import { UserSessionUsecaseModel } from '../user/model/userSession.usecase.model';

export class AuthPasskeyUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  async execute(dto: PasskeyAuthUsecaseDto): Promise<UserSessionUsecaseModel> {
    try {

      const user: UserUsecaseModel = await this.inversify.getUserUsecase.execute({
        code: dto.user_code,
      });

      const passkey = await this.inversify.bddService.getPasskey({
        credential_id: dto.authentication.id,
      });

      /* istanbul ignore next */
      const expected:any = {
        challenge: passkey.challenge,
        origin: (origin) => origin.includes(passkey.hostname),
        userVerified: true, // no function allowed here
        verbose: false, // optional, enables debug logs containing sensitive information
      };

      const authenticationParsed = await this.inversify.passwordLessService.verifyAuthentication(dto.authentication, passkey.registrationParsed.credential, expected);
      //this.inversify.loggerService.debug('authenticationParsed', authenticationParsed);

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
      this.inversify.loggerService.error(`AuthPasskeyUsecase => ${e.message}`);
      throw new Error(ERRORS.AUTH_PASSKEY_USECASE_FAIL);
    }
  }
}
