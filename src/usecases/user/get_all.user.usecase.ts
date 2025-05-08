// src\usecases\user\get_all.user.usecase.ts
import { UserUsecaseModel } from './model/user.usecase.model';

export class GetAllUserUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  async execute(): Promise<UserUsecaseModel[]> {
    return await this.inversify.bddService.getAllUser();
  }
}
