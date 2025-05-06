// src/graphql/auth/auth.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';

export interface AuthModuleOptions {
  jwtConfig: Parameters<typeof JwtModule.register>[0];
  appConfig: any;
  inversify: any;
}

@Module({})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule,
        JwtModule.register(options.jwtConfig),
      ],
      providers: [
        AuthResolver,
        JwtStrategy,
        {
          provide: 'Inversify',
          useValue: options.inversify,
        },
        {
          provide: 'AppConfig',
          useValue: options.appConfig,
        },
      ],
      exports: [],
    };
  }
}
