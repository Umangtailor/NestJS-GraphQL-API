import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false })
  declare username: string;

  @Column({ allowNull: false, unique: true })
  declare email: string;

  @Column({ allowNull: false })
  declare password: string;

  @Column({ allowNull: true, type: DataType.STRING })
  declare resetPasswordToken: string | null;

  // @HasMany(() => Event)
  // declare events?: Event[];

  // @HasMany(() => Invitee, 'createdBy')
  // declare createdInvitees?: Invitee[];
}
