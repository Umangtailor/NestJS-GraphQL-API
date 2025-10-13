import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript';
import { User } from './user.model';
import { Task } from './task.model';
import { ProjectMember } from './project-member.model';

@Table({ tableName: 'projects' })
export class Project extends Model<Project> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  declare description: string | null;

  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.UUID })
  declare ownerId: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  declare owner: User;

  @HasMany(() => Task)
  declare tasks: Task[];

  @BelongsToMany(() => User, () => ProjectMember)
  declare members: User[];
}