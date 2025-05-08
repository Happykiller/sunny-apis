// src\service\db\mongo\db.service.user.mongo.ts
import { Collection, Db, ObjectId } from 'mongodb';

import { UserDbModel } from '../model/user.db.model';
import { GetUserDbDto } from '../dto/get.user.db.dto';
import { USER_ROLE } from '../../../graphql/guard/userRole';
import { CreateUserDbDto } from '../dto/create.user.db.dto';
import { UpdateUserDbDto } from '../dto/update.user.db.dto';

export class BddServiceUserMongo {
  constructor(private readonly inversify:{mongo: Db}){}

  private async getUserCollection(): Promise<Collection> {
    return this.inversify.mongo.collection('users');
  }

  async getAllUser(): Promise<UserDbModel[]> {
    // Query for a movie that has the title 'The Room'
    const query = {
      active: true,
    };
    const options = {};
    // Execute query
    const results = (await this.getUserCollection()).find(query, options);

    const users: UserDbModel[] = [];

    // Print returned documents
    for await (const doc of results) {
      const tmp: any = {
        id: doc._id.toString(),
        ... doc
      };
      delete tmp._id;
      users.push(tmp);
    }

    return users;
  }

  async getUser(dto: GetUserDbDto): Promise<UserDbModel> {
    try {
      const query = {
        active: true,
        $or: [{ _id: new ObjectId(dto.id) }, { code: dto.code }],
      };
      const options = {};
      // Execute query
      const doc: any = await (
        await this.getUserCollection()
      ).findOne(query, options);

      const tmp: any = {
        id: doc._id.toString(),
        ... doc
      };
      delete tmp._id;

      return Promise.resolve(tmp);
    } catch (e) {
      return null;
    }
  }

  async createUser(dto: CreateUserDbDto): Promise<UserDbModel> {
    try {
      const result = await (
        await this.getUserCollection()
      ).insertOne({
        ...dto,
        role: USER_ROLE.USER,
        active: true,
      });

      return Promise.resolve({
        id: result.insertedId.toString(),
        ...dto,
        role: USER_ROLE.USER,
        active: true,
      });
    } catch (e) {
      return null;
    }
  }

  async updateUser(dto: UpdateUserDbDto): Promise<UserDbModel> {
    const set: any = {};

    if (dto.password) {
      set.password = dto.password;
    }

    if (dto.description) {
      set.description = dto.description;
    }

    if (dto.code) {
      set.code = dto.code;
    }

    if (dto.name_first) {
      set.name_first = dto.name_first;
    }

    if (dto.name_last) {
      set.name_last = dto.name_last;
    }

    if (dto.mail) {
      set.mail = dto.mail;
    }

    await (
      await this.getUserCollection()
    ).updateOne(
      { _id: new ObjectId(dto.user_id) },
      {
        $set: set,
      },
    );

    return await this.getUser({
      id: dto.user_id,
    });
  }
}
