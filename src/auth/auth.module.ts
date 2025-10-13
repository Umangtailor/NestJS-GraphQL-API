import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../database/models/user.model'; // Ensure this is the correct import
// import { TokenBlacklist } from '../database/models/token-blacklist.model';
@Module({
  imports: [
    AppConfigModule,  // ✅ this makes ConfigService available to the whole AuthModule
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: configService.jwtLifeTime },
      }),
      inject: [AppConfigService],
    }),
    SequelizeModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }