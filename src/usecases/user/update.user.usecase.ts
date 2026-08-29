// src\usecase\user\update.user.usecase.ts
import { ERRORS } from '../../common/ERROR';
import { UserUsecaseModel } from './model/user.usecase.model';
import { UpdateUserUsecaseDto } from './dto/update.user.usecase.dto';
import { UpdateUserDbDto } from '../../services/db/dto/update.user.db.dto';
import type { InversifyInterface } from '../../types/inversify.interface';

export class UpdateUserUsecase {
  inversify: InversifyInterface;

  constructor(inversify: InversifyInterface) {
    this.inversify = inversify;
  }

  async execute(dto: UpdateUserUsecaseDto): Promise<UserUsecaseModel> {
    // Lève GET_USER_USECASE_USER_NOT_FOUND si l'id ne correspond à personne.
    // include_inactive : réactiver un compte suppose de pouvoir le lire alors
    // qu'il est coupé.
    const current: UserUsecaseModel = await this.inversify.getUserUsecase.execute(
      { id: dto.user_id, include_inactive: true },
    );

    // Un administrateur qui se désactive lui-même se verrouille dehors : le
    // guard relit l'utilisateur en base à chaque requête et rejette tout compte
    // inactif. Plus personne ne peut alors le réactiver par l'API.
    if (
      dto.active === false &&
      dto.requester_id &&
      dto.requester_id === dto.user_id
    ) {
      throw new Error(ERRORS.UPDATE_USER_USECASE_SELF_DEACTIVATION);
    }

    // `code` identifie l'utilisateur à la connexion : deux comptes qui le
    // partagent rendent l'authentification non déterministe.
    if (dto.code && dto.code !== current.code) {
      let holder: UserUsecaseModel;
      try {
        holder = await this.inversify.getUserUsecase.execute({
          code: dto.code,
          include_inactive: true,
        });
      } catch (e) {
        if (e.message !== ERRORS.GET_USER_USECASE_USER_NOT_FOUND) {
          throw e;
        }
      }
      if (holder) {
        throw new Error(ERRORS.UPDATE_USER_USECASE_CODE_ALREADY_USED);
      }
    }

    // On ne transmet que les champs réellement fournis : un `undefined` qui
    // descend jusqu'au `$set` effacerait la valeur existante.
    const payload: UpdateUserDbDto = { user_id: dto.user_id };
    if (dto.code !== undefined) payload.code = dto.code;
    if (dto.name_first !== undefined) payload.name_first = dto.name_first;
    if (dto.name_last !== undefined) payload.name_last = dto.name_last;
    if (dto.description !== undefined) payload.description = dto.description;
    if (dto.mail !== undefined) payload.mail = dto.mail;
    if (dto.active !== undefined) payload.active = dto.active;

    // Le mot de passe est stocké haché. Le laisser passer en clair fermerait le
    // compte définitivement : plus aucune saisie ne correspondrait au stocké.
    if (dto.password !== undefined) {
      payload.password = this.inversify.cryptService.crypt({
        message: dto.password,
      });
    }

    return this.inversify.bddService.updateUser(payload);
  }
}
