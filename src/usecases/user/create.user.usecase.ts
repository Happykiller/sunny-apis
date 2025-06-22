// src\usecase\user\create.user.usecase.ts
import { ERRORS } from '../../common/ERROR';
import { UserUsecaseModel } from './model/user.usecase.model';
import { UserDbModel } from '../../services/db/model/user.db.model';
import { CreateUserUsecaseDto } from './dto/create.user.usecase.dto';
import type { InversifyInterface } from '../../types/inversify.interface';

export class CreateUserUsecase {
  inversify: InversifyInterface;

  constructor(inversify: InversifyInterface, private readonly config: any) {
    this.inversify = inversify;
  }

  capitalizeFirstLetter = (text: string): string =>
    text.charAt(0).toUpperCase() + text.slice(1);

  async execute(dto: CreateUserUsecaseDto): Promise<UserUsecaseModel> {
    try {
      let user: UserDbModel;
      try {
        user = await this.inversify.getUserUsecase.execute({
          code: dto.code,
        });
      } catch (e) {
        throw new Error(ERRORS.CREATE_USER_USECASE_FETCH_USER);
      }

      if (user) {
        throw new Error(ERRORS.CREATE_USER_USECASE_USER_ALREADY_EXIST);
      }

      try {
        this.inversify.morgansService.sendWelcome({
          to: dto.mail,
          subject: `Bienvenue sur ${this.capitalizeFirstLetter(this.config.app_name)} 🎉`,
          variables: {
            "id": dto.code,
            "email": dto.mail,
            "password": dto.password,
            "logoUrl": `https://${this.config.app_name}.happykiller.net/favicon-192x192.png`,
            "serviceUrl": `https://${this.config.app_name}.happykiller.net/`,
            "serviceName": this.capitalizeFirstLetter(this.config.app_name),
            "siguriUrl": "https://siguri.happykiller.net/"
          }
        });
      } catch (e) {
        this.inversify.loggerService.error(`Error while send mail => ${e.message}`);
      }

      dto.password = this.inversify.cryptService.crypt({
        message: dto.password,
      });

      user = await this.inversify.bddService.createUser(dto);

      return user;
    } catch (e) {
      throw new Error(ERRORS.CREATE_USER_USECASE);
    }
  }
}
