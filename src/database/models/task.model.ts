import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Project } from './project.model';

@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false })
  declare title: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  declare description: string | null;

  @Column({ defaultValue: 'pending' })
  declare status: string; // 'pending', 'in-progress', 'completed'

  @ForeignKey(() => Project)
  @Column({ allowNull: false, type: DataType.UUID })
  declare projectId: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.UUID })
  declare createdBy: string;

  @ForeignKey(() => User)
  @Column({ allowNull: true, type: DataType.UUID })
  declare assignedTo: string | null;

  @Column({ defaultValue: false })
  declare isDeleted: boolean;

  @Column({ allowNull: true, type: DataType.DATE })
  declare deletedAt: Date;

  @BelongsTo(() => Project, { onDelete: 'CASCADE' })
  declare project: Project;

  @BelongsTo(() => User, { foreignKey: 'createdBy' })
  declare creator: User;

  @BelongsTo(() => User, { foreignKey: 'assignedTo' })
  declare assignee: User;
}