// src\service\db\fake\db.service.user.fake.ts
import { ObjectId } from 'mongodb';

import { userRopo } from './mock/user.ropo';
import { UserDbModel } from '../model/user.db.model';
import { GetUserDbDto } from '../dto/get.user.db.dto';
import { USER_ROLE } from '../../../graphql/guard/userRole';
import { CreateUserDbDto } from '../dto/create.user.db.dto';
import { GetAllUserDbDto } from '../dto/get_all.user.db.dto';
import { UpdateUserDbDto } from '../dto/update.user.db.dto';

export class BddServiceUserFake {
  userCollection: UserDbModel[];

  getUserCollection(): UserDbModel[] {
    if (!this.userCollection) {
      this.userCollection = [userRopo];
    }
    return this.userCollection;
  }

  createUser(dto: CreateUserDbDto): Promise<UserDbModel> {
    const entity: UserDbModel = {
      id: new ObjectId().toString(),
      ...dto,
      role: USER_ROLE.USER,
      active: true,
    };
    this.getUserCollection().push(entity);
    return Promise.resolve(entity);
  }

  getAllUser(dto?: GetAllUserDbDto): Promise<UserDbModel[]> {
    const users = this.getUserCollection();
    return Promise.resolve(
      dto?.include_inactive ? users : users.filter((elt) => elt.active),
    );
  }

  getUser(dto: GetUserDbDto): Promise<UserDbModel> {
    const actif = (elt: UserDbModel) => dto.include_inactive || elt.active;
    return Promise.resolve(
      this.getUserCollection().find((elt) => {
        if (dto.id) {
          return elt.id === dto.id && actif(elt);
        } else if (dto.code) {
          return elt.code === dto.code && actif(elt);
        }
      }),
    );
  }

  async updateUser(dto: UpdateUserDbDto): Promise<UserDbModel> {
    // include_inactive : on doit pouvoir réactiver un compte déjà coupé.
    const user = await this.getUser({
      id: dto.user_id,
      include_inactive: true,
    });

    if (dto.password) {
      user.password = dto.password;
    }

    if (dto.description) {
      user.description = dto.description;
    }

    if (dto.code) {
      user.code = dto.code;
    }

    if (dto.name_first) {
      user.name_first = dto.name_first;
    }

    if (dto.name_last) {
      user.name_last = dto.name_last;
    }

    if (dto.mail) {
      user.mail = dto.mail;
    }

    if (dto.role !== undefined) {
      user.role = dto.role;
    }

    // `!== undefined` : `active: false` est la valeur qui compte.
    if (dto.active !== undefined) {
      user.active = dto.active;
    }

    return Promise.resolve(JSON.parse(JSON.stringify(user)));
  }
}
