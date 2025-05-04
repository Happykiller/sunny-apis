// src\services\logger\logger.service.ts
export interface LoggerService {
  log(): void;
  info(): void;
  error(): void;
}
