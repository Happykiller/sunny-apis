// src/graphql/guard/guard.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AlwaysAllowGuard } from './always-allow.guard';
import { RolesGuard } from './roles.guard';

export interface AuthGuardOptions {
  inversify: any;
  appConfig: any;
}

@Module({})
export class AuthGuardModule {
  static forRoot(options: AuthGuardOptions): DynamicModule {
    return {
      module: AuthGuardModule,
      providers: [
        { provide: 'Inversify', useValue: options.inversify },
        { provide: 'AppConfig', useValue: options.appConfig },
        RolesGuard,
        AlwaysAllowGuard,
      ],
      exports: [RolesGuard, AlwaysAllowGuard],
    };
  }
}