// src\usecase\user\get.user.usecase.ts
import { ERRORS } from '../../common/ERROR';
import { UserUsecaseModel } from './model/user.usecase.model';
import { GetUserUsecaseDto } from './dto/get.user.usecase.dto';
import { UserDbModel } from '../../services/db/model/user.db.model';

export class GetUserUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  async execute(dto: GetUserUsecaseDto): Promise<UserUsecaseModel> {
    const entity: UserDbModel = await this.inversify.bddService.getUser(dto);

    if (!entity) {
      throw new Error(ERRORS.GET_USER_USECASE_USER_NOT_FOUND);
    }

    return entity;
  }
}
