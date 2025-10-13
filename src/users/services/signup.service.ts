import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../database/models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from '../dto/create-user.input';
import { Op } from 'sequelize';

@Injectable()
export class SignupService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
  ) { }

  async execute(createUserInput: CreateUserInput): Promise<User> {
    const { username, email, password } = createUserInput;

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const userExists = await this.userModel.findOne({ where: { email } });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userModel.create({ username, email, password: hashedPassword } as any);
  }

  async findAllUsers(offset?: number, limit?: number, search?: string): Promise<User[]> {
    const options: any = {};
    if (offset !== undefined) options.offset = offset;
    if (limit !== undefined) options.limit = limit;
    if (search) {
      options.where = {
        ...(options.where || {}),
        [Op.or]: [
          { email: { [Op.iLike]: `%${search}%` } },
          { username: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }
    const users = await this.userModel.findAll(options);
    if (!users.length) throw new BadRequestException('No users found');
    return users;
  }
}
