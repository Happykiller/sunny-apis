// src\usecase\user\create.user.usecase.ts
import { ERRORS } from '../../common/ERROR';
import { UserUsecaseModel } from './model/user.usecase.model';
import { UserDbModel } from '../../services/db/model/user.db.model';
import { CreateUserUsecaseDto } from './dto/create.user.usecase.dto';

export class CreateUserUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  async execute(dto: CreateUserUsecaseDto): Promise<UserUsecaseModel> {
    let user: UserDbModel;
    try {
      user = await this.inversify.getUserUsecase.execute({
        code: dto.code,
      });
    } catch (e) {}

    if (user) {
      throw new Error(ERRORS.CREATE_USER_USECASE_USER_ALREADY_EXIST);
    }

    this.inversify.morgansService.sendWelcome({
      to: dto.mail,
      subject: 'Bienvenue sur Vergo 🎉',
      variables: {
        "id": dto.code,
        "email": dto.mail,
        "password": dto.password,
        "logoUrl": "https://vergo.happykiller.net/favicon-192x192.png",
        "serviceUrl": "https://vergo.happykiller.net/",
        "serviceName": "Vergo",
        "siguriUrl": "https://siguri.happykiller.net/"
      }
    });

    dto.password = this.inversify.cryptService.crypt({
      message: dto.password,
    });
    user = await this.inversify.bddService.createUser(dto);
    return user;
  }
}
