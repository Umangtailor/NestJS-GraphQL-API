import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../database/models/user.model';
import * as bcrypt from 'bcrypt';
import { LoginUserInput } from '../dto/login-user.input';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private authService: AuthService,
  ) { }

  async execute(loginUserInput: LoginUserInput): Promise<{ message: string; token: string }> {
    const { email, password } = loginUserInput;
    const user = await this.userModel.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await this.authService.generateAccessToken(user);
    return { message: 'Login successful', token };
  }
}
