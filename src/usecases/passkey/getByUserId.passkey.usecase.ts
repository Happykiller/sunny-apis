// src\usecases\passkey\getByUserId.passkey.usecase.ts
import PasskeyUsecaseModel from './model/passkey.usecase.model';
import GetByUserIdPasskeyUsecaseDto from './dto/getByUserId.passkey.usecase.dto';

export class GetByUserIdPasskeyUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  execute(dto: GetByUserIdPasskeyUsecaseDto): Promise<PasskeyUsecaseModel[]> {
    return this.inversify.bddService.getPasskeyByUserId(dto);
  }
}
