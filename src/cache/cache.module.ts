import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { CacheService } from './cache.service';

@Module({
  imports: [
    AppConfigModule,
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        store: redisStore as any,
        host: configService.redisHost || 'localhost',
        port: configService.redisPort || 6379,
        ttl: 60, // 1 minute default
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheModule, CacheService],
})
export class RedisCacheModule {}