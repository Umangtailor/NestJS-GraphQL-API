import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';
import { Project } from './project.model';

@Table({ tableName: 'project_members' })
export class ProjectMember extends Model<ProjectMember> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Project)
  @Column({ allowNull: false, type: DataType.UUID })
  declare projectId: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.UUID })
  declare userId: string;

  @Column({ defaultValue: 'member' })
  declare role: string;
}