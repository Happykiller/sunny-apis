// src\services\db\mongo\db.service.passkey.mongo.ts
import { Collection, Db, ObjectId } from 'mongodb';

import PasskeyDbModel from '../model/passkey.db.model';
import { GetPasskeyDbDto } from '../dto/get.passkey.db.dto';
import { CreatePasskeyDbDto } from '../dto/create.passkey.db.dto';
import { DeletePasskeyDbDto } from '../dto/delete.passkey.db.dto';
import { GetPasskeyByUserIdDbDto } from '../dto/getByUserId.passkey.db.dto';

export class BddServicePasskeyMongo {
  constructor(private readonly inversify:{mongo: Db}){}

  private async getPasskeyCollection(): Promise<Collection> {
    return this.inversify.mongo.collection('passkeys');
  }

  async createPasskey(dto: CreatePasskeyDbDto): Promise<PasskeyDbModel> {
    try {
      const result = await (
        await this.getPasskeyCollection()
      ).insertOne({
        ...dto,
        active: true,
      });
      return Promise.resolve({
        id: result.insertedId.toString(),
        ...dto,
        active: true,
      });
    } catch (e) {
      return null;
    }
  }

  async getPasskey(dto: GetPasskeyDbDto): Promise<PasskeyDbModel> {
    try {
      const query = {
        active: true,
        $or: [
          { _id: new ObjectId(dto.passkey_id) },
          { 'registration.id': dto.credential_id },
        ],
      };
      const options = {};
      // Execute query
      const doc: any = await (
        await this.getPasskeyCollection()
      ).findOne(query, options);

      return Promise.resolve({
        id: doc._id.toString(),
        label: doc.label,
        user_code: doc.user_code,
        user_id: doc.user_id,
        hostname: doc.hostname,
        registration: doc.registration,
        registrationParsed: doc.registrationParsed,
        challenge: doc.challenge,
        active: doc.active,
      });
    } catch (e) {
      return null;
    }
  }

  async getPasskeyByUserId(
    dto: GetPasskeyByUserIdDbDto,
  ): Promise<PasskeyDbModel[]> {
    const query = {
      user_id: dto.user_id,
      active: true,
    };
    const options = {};
    // Execute query
    const results: any = await (
      await this.getPasskeyCollection()
    ).find(query, options);

    const passkeys = [];
    // Print returned documents
    for await (const doc of results) {
      passkeys.push({
        id: doc._id.toString(),
        label: doc.label,
        user_code: doc.user_code,
        user_id: doc.user_id,
        hostname: doc.hostname,
        registration: doc.registration,
        challenge: doc.challenge,
        active: doc.active,
      });
    }

    return passkeys;
  }

  async deletePasskey(dto: DeletePasskeyDbDto): Promise<boolean> {
    try {
      await (
        await this.getPasskeyCollection()
      ).updateOne(
        { _id: new ObjectId(dto.passkey_id) },
        {
          $set: { active: false },
        },
      );

      return true;
    } catch (e) {
      return null;
    }
  }
}
