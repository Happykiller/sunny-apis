// src/graphql/guard/always-allow.guard.ts
import {
  ExecutionContext,
  CanActivate,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AlwaysAllowGuard implements CanActivate {
  constructor() {
    console.log('✅ AlwaysAllowGuard instantiated');
  }

  canActivate(context: ExecutionContext): boolean {
    console.log('✅ AlwaysAllowGuard triggered');
    return true; // always allow
  }
}
