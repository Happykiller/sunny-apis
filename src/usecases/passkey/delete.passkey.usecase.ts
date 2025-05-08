// src\usecases\passkey\delete.passkey.usecase.ts
import DeletePasskeyUsecaseDto from './dto/delete.passkey.usecase.dto';

export class DeletePasskeyUsecase {
  inversify: any;

  constructor(inversify: any) {
    this.inversify = inversify;
  }

  execute(dto: DeletePasskeyUsecaseDto): Promise<boolean> {
    return this.inversify.bddService.deletePasskey(dto);
  }
}
