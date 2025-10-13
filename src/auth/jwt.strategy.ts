import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AppConfigService } from '../config/config.service';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../database/models/user.model';
// import { TokenBlacklist } from '../database/models/token-blacklist.model';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: AppConfigService,
    @InjectModel(User) private userModel: typeof User,
    // @InjectModel(TokenBlacklist) private tokenBlacklistModel: typeof TokenBlacklist,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
      passReqToCallback: true, 
    });
  }

  async validate(req: Request, payload: any) {
    // const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // const isBlacklisted = await this.tokenBlacklistModel.findOne({ where: { token } });
    // if (isBlacklisted) {
    //   throw new UnauthorizedException('Token has been blacklisted');
    // }

    const user = await this.userModel.findByPk(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
