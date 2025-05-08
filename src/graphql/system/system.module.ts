// src\graphql\system\system.module.ts
import { DynamicModule, Module } from '@nestjs/common';

import { SystemResolver } from './system.resolver';

export interface SystemModuleOptions {
  version: string;
  inversify: any;
}

@Module({})
export class SystemModule {
  static forRoot(options: SystemModuleOptions): DynamicModule {
    return {
      module: SystemModule,
      providers: [
        {
          provide: 'Inversify',
          useValue: options.inversify,
        },
        {
          provide: 'Version',
          useValue: options.version,
        },
        SystemResolver
      ],
    };
  }
}
