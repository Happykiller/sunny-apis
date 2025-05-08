// src\services\db\db.service.base.ts
import { GetUserDbDto } from "./dto/get.user.db.dto";
import { UserDbModel } from "./model/user.db.model";
import PasskeyDbModel from "./model/passkey.db.model";
import { CreateUserDbDto } from "./dto/create.user.db.dto";
import { UpdateUserDbDto } from "./dto/update.user.db.dto";
import { GetPasskeyDbDto } from "./dto/get.passkey.db.dto";
import { DeletePasskeyDbDto } from "./dto/delete.passkey.db.dto";
import { CreatePasskeyDbDto } from "./dto/create.passkey.db.dto";
import { GetPasskeyByUserIdDbDto } from "./dto/getByUserId.passkey.db.dto";

export interface BddServiceBase {
  test(): Promise<boolean>;
  initConnection(): Promise<void>;
  /**
   * User
   */
  getAllUser(): Promise<UserDbModel[]>;
  getUser(dto: GetUserDbDto): Promise<UserDbModel>;
  createUser(dto: CreateUserDbDto): Promise<UserDbModel>;
  updateUser(dto: UpdateUserDbDto): Promise<UserDbModel>;
  /**
   * Passkey
   */
  createPasskey(dto: CreatePasskeyDbDto): Promise<PasskeyDbModel>;
  getPasskeyByUserId(dto: GetPasskeyByUserIdDbDto): Promise<PasskeyDbModel[]>;
  getPasskey(dto: GetPasskeyDbDto): Promise<PasskeyDbModel>;
  deletePasskey(dto: DeletePasskeyDbDto): Promise<boolean>;
}
