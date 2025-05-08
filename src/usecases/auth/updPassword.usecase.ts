// src\usecase\auth\updPassword.usecase.ts
import { UserUsecaseModel } from '../user/model/user.usecase.model';
import { UpdPasswordAuthUsecaseDto } from './dto/updPassword.usecase.dto';
import { UserSessionUsecaseModel } from '../user/model/userSession.usecase.model';

export class UpdPasswordUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  async execute(
    dto: UpdPasswordAuthUsecaseDto,
  ): Promise<UserSessionUsecaseModel> {
    const user: UserUsecaseModel = await this.inversify.getUserUsecase.execute({
      id: dto.user_id,
    });

    const cryptPassword = this.inversify.cryptService.crypt({
      message: dto.old_value,
    });

    const cryptNewPassword = this.inversify.cryptService.crypt({
      message: dto.new_value,
    });

    const cryptConfPassword = this.inversify.cryptService.crypt({
      message: dto.conf_value,
    });

    if (
      user &&
      user.active &&
      user.password === cryptPassword &&
      cryptNewPassword === cryptConfPassword
    ) {
      await this.inversify.bddService.updateUser({
        user_id: dto.user_id,
        password: cryptNewPassword,
      });

      return {
        id: user.id,
        code: user.code,
        name_first: user.name_first,
        name_last: user.name_last,
        description: user.description,
        mail: user.mail,
        role: user.role,
      };
    } else {
      return null;
    }
  }
}
