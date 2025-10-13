import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/models/user.model';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }
  async generateAccessToken(user: User): Promise<string> {
    const payload = { userId: user.id };
    return this.jwtService.sign(payload);
  }
}