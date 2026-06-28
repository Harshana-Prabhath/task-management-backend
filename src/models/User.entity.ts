import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Task } from "./Task.entity";

export enum UserRole {
  ADMIN = "Admin",
  USER = "User",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  name!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  
  @OneToMany(() => Task, (task) => task.createdBy)
  createdTasks!: Task[];

  
  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}