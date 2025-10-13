import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
// import { InjectModel } from '@nestjs/sequelize';
// import { TokenBlacklist } from 'src/database/models/token-blacklist.model';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    // @InjectModel(TokenBlacklist) private tokenBlacklistModel: typeof TokenBlacklist,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }
    const token = authHeader.replace('Bearer ', '');
    // const isBlacklisted = await this.tokenBlacklistModel.findOne({ where: { token } });
    // if (isBlacklisted) {
    //   throw new UnauthorizedException('Token has been blacklisted');
    // }

    try {
      const payload = this.jwtService.verify(token);
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
