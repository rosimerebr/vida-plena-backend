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
    // Verifica se já existe registro para o mesmo userId, habit e date
    const exists = await this.habitLogRepo.findOneBy({ userId, habit, date });
    if (exists) {
      return exists; // Não salva duplicado
    }
    const log = this.habitLogRepo.create({ userId, habit, date });
    return this.habitLogRepo.save(log);
  }
} 