// src\graphql\guard\roles.guard.ts
import {
  ExecutionContext,
  CanActivate,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  //constructor(private reflector: Reflector) { // <= bloque le lancement
  constructor() {
    console.log('✅ RolesGuard instantiated');
  }

  canActivate(executionContext: ExecutionContext): boolean {
    console.log('✅ RolesGuard triggered');
    return true;
  }
}
