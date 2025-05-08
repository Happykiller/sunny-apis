// src\graphql\passkey\passkey.module.ts
import { DynamicModule, Module } from '@nestjs/common';

import { PasskeyResolver } from './passkey.resolver';

export interface PasskeyModuleOptions {
  inversify: any;
}

@Module({})
export class PasskeyModule {
  static forRoot(options: PasskeyModuleOptions): DynamicModule {
    return {
      module: PasskeyModule,
      providers: [
        {
          provide: 'Inversify',
          useValue: options.inversify,
        },
        PasskeyResolver
      ],
    };
  }
}