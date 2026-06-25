import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum TaskStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  TESTING = "Testing", 
  DONE = "Done",
}

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({
    type: "enum",
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status!: TaskStatus;

  @Column({ type: "date", nullable: true })
  dueDate!: Date;

  
  @ManyToOne(() => User, (user) => user.createdTasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "createdBy" })
  createdBy!: User;

 
  @ManyToOne(() => User, (user) => user.assignedTasks, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "assignedTo" })
  assignedTo!: User | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}