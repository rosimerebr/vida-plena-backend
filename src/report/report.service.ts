import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HabitLog } from "./entities/habit-log.entity";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(HabitLog)
    private readonly habitLogRepo: Repository<HabitLog>,
  ) {}

  async registerHabit(userId: number, habit: string, date: string) {
    const log = this.habitLogRepo.create({ userId, habit, date });
    return this.habitLogRepo.save(log);
  }
} 