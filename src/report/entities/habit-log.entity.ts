import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class HabitLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  habit: string;

  @Column({ type: 'date' })
  date: string;
} 