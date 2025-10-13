import { Injectable } from '@nestjs/common';

// import { UpdatePasswordService } from './services/update-password.service';
// import { User } from '../database/models/user.model';
import { SignupService } from './services/signup.service';
import { LoginService } from './services/login.service';
// import { LogoutService } from './services/logout.service';
// import { ChangePasswordService } from './services/change-password.service';
// import { ResetPasswordService } from './services/reset-password.service';

@Injectable()
export class UsersService {
  constructor(
    private signupService: SignupService,
    private loginService: LoginService,
    // private logoutService: LogoutService,
    // private changePasswordService: ChangePasswordService,
    // private resetPasswordService: ResetPasswordService,
    // private updatePasswordService: UpdatePasswordService,
  ) { }

  async signUp(input: Parameters<SignupService['execute']>[0]) {
    return this.signupService.execute(input);
  }

  async loginUser(input: Parameters<LoginService['execute']>[0]) {
    return this.loginService.execute(input);
  }

  // async logoutUser(token: Parameters<LogoutService['execute']>[0]) {
  //   return this.logoutService.execute(token);
  // }

  // async changePassword(userId: string, input: Parameters<ChangePasswordService['execute']>[1]) {
  //   return this.changePasswordService.execute(userId, input);
  // }

  // async resetPassword(input: Parameters<ResetPasswordService['execute']>[0]) {
  //   return this.resetPasswordService.execute(input);
  // }

  // async updatePassword(input: Parameters<UpdatePasswordService['execute']>[0]) {
  //   return this.updatePasswordService.execute(input);
  // }

  // async findAllUsers(offset?: number, limit?: number, search?: string): Promise<User[]> {
  //   return this.signupService.findAllUsers(offset, limit, search);
  // }
}
