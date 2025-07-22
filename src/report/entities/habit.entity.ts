import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { HabitLog } from "./habit-log.entity";

@Entity()
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => HabitLog, (habitLog) => habitLog.habit)
  habitLogs: HabitLog[];
} 