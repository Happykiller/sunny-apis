import type { Db } from 'mongodb';

// Common
import { LoggerService } from '../services/logger/logger.service';

// Services
import type { HttpService } from '../services/http/http.service';
import type { CryptService } from '../services/crypt/crypt.service';
import type { MorgansService } from '../services/morgans/morgans.service';
import type { PasswordLessService } from '../services/passwordless/passwordless.service';

// Usecases - Auth
import type { AuthUsecase } from '../usecases/auth/auth.usecase';
import { AuthPasskeyUsecase } from '../usecases/auth/passkey.auth.usecase';
import { DeletePasskeyUsecase } from '../usecases/passkey/delete.passkey.usecase';
import { CreatePasskeyUsecase } from '../usecases/passkey/create.passkey.usecase';
import { GetByUserIdPasskeyUsecase } from '../usecases/passkey/getByUserId.passkey.usecase';

// Usecases - User
import type { GetUserUsecase } from '../usecases/user/get.user.usecase';
import { UpdPasswordUsecase } from '../usecases/user/updPassword.usecase';
import type { CreateUserUsecase } from '../usecases/user/create.user.usecase';
import type { GetAllUserUsecase } from '../usecases/user/get_all.user.usecase';


export interface InversifyInterface {
  // DB & Infrastructure
  mongo?: Db;
  loggerService?: LoggerService;
  bddService?: any;

  // Core services
  httpService?: HttpService;
  cryptService?: CryptService;
  morgansService?: MorgansService;
  passwordLessService?: PasswordLessService;

  // Usecases - Auth
  authUsecase?: AuthUsecase;
  authPasskeyUsecase?: AuthPasskeyUsecase;
  deletePasskeyUsecase?: DeletePasskeyUsecase;
  createPasskeyUsecase?: CreatePasskeyUsecase;
  getByUserIdPasskeyUsecase?: GetByUserIdPasskeyUsecase;

  // Usecases - Users
  createUserUsecase?: CreateUserUsecase;
  getUserUsecase?: GetUserUsecase;
  getAllUserUsecase?: GetAllUserUsecase;
  updPasswordUsecase?: UpdPasswordUsecase;
}
