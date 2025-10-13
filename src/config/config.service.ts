import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly nestConfigService: NestConfigService) { }

  /**
   * App port configuration.
   */
  get port(): number {
    return this.nestConfigService.get<number>('port', 8001);
  }

  /**
   * JWT secret key.
   */
  get jwtSecret(): string {
    return this.nestConfigService.get<string>('jwt.secret', 'defaultSecret');
  }

  /**
   * JWT lifetime for access tokens.
   */
  get jwtLifeTime(): string {
    return this.nestConfigService.get<string>('jwt.lifeTime', '1h'); // e.g., '1h' for 1 hour
  }

  /**
   * JWT lifetime for password reset tokens.
   */
  get jwtResetTokenLifeTime(): string {
    return this.nestConfigService.get<string>('jwt.resetTokenLifeTime', '1h');
  }

  /**
   * Database host.
   */
  get databaseHost(): string {
    return this.nestConfigService.get<string>('database.host', 'localhost');
  }

  /**
   * Database port.
   */
  get databasePort(): number {
    return this.nestConfigService.get<number>('database.port', 5432); // default for PostgreSQL
  }

  /**
   * Database username.
   */
  get databaseUsername(): string {
    return this.nestConfigService.get<string>('database.username', 'postgres');
  }

  /**
   * Database password.
   */
  get databasePassword(): string {
    return this.nestConfigService.get<string>('database.password', 'postgres');
  }

  /**
   * Database name.
   */
  get databaseName(): string {
    return this.nestConfigService.get<string>('database.name', 'nestjs-graphql');
  }
  /**
   * Whether to allow GraphQL introspection and show the landing page.
   */
  get allowIntrospection(): boolean {
    return this.nestConfigService.get<boolean>('ALLOW_INTROSPECTION', true);
  }

  /**
   * Redis host.
   */
  get redisHost(): string {
    return this.nestConfigService.get<string>('redis.host', 'localhost');
  }

  /**
   * Redis port.
   */
  get redisPort(): number {
    return this.nestConfigService.get<number>('redis.port', 6379);
  }
}
