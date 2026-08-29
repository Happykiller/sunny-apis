// src\usecases\user\get_all.user.usecase.ts
import { UserUsecaseModel } from './model/user.usecase.model';
import { GetAllUserUsecaseDto } from './dto/get_all.user.usecase.dto';

export class GetAllUserUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  async execute(dto?: GetAllUserUsecaseDto): Promise<UserUsecaseModel[]> {
    return await this.inversify.bddService.getAllUser(dto);
  }
}
