// src\graphql\user\user.module.ts
import { DynamicModule, Module } from '@nestjs/common';

import { UserResolver } from './user.resolver';

export interface UserModuleOptions {
  inversify: any;
}

@Module({})
export class UserModule {
  static forRoot(options: UserModuleOptions): DynamicModule {
    return {
      module: UserModule,
      providers: [
        {
          provide: 'Inversify',
          useValue: options.inversify,
        },
        UserResolver
      ],
    };
  }
}