// src\services\db\mongo\db.service.init.mongo.ts
import * as mongoDB from 'mongodb';

import { CreateUserDbDto } from '../dto/create.user.db.dto';

export class BddServiceInitMongo
{
  constructor(
    private readonly inversify:{mongo: mongoDB.Db, loggerService:any, bddService:any},
    private readonly config:any
  ){}

  async initConnection() {
    const clientMongo = new mongoDB.MongoClient(this.config.db.connection_string);
    await clientMongo.connect();
    this.inversify.mongo = clientMongo.db(this.config.db.name);
    this.inversify.loggerService.log(
      'info',
      `Successfully connected to database: ${this.inversify.mongo.databaseName}`,
    );

    const admin = await this.inversify.bddService.getUser({
      code: 'admin',
    });
    if (!admin) {
      const user: CreateUserDbDto = {
        code: 'admin',
        password:
          'B5DicCkBcu6twsf95mosv5wfjrR9YeCBl/v26tHQDwQB1fwoNjzipo51R8+IuCUQ7yijXFSzktxaSR3+9LXqyA==',
        name_first: 'admin',
        name_last: 'admin',
        description: 'password avec le secret secretKey',
        mail: 'admin',
      };
      await this.inversify.bddService.createUser(user);
    }
  }
}
