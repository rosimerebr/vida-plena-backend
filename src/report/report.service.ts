import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HabitLog } from "./entities/habit-log.entity";
import { Between } from "typeorm";

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

  async getMonthlyLogs(userId: number, month: string) {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    );
    const logs = await this.habitLogRepo.find({
      where: {
        userId,
        date: Between(
          startDate.toISOString().slice(0, 10),
          endDate.toISOString().slice(0, 10),
        ),
      },
    });
    const daysMap: Record<string, Record<string, boolean>> = {};
    logs.forEach((log) => {
      if (!daysMap[log.date]) daysMap[log.date] = {};
      daysMap[log.date][log.habit] = true;
    });
    const daysInMonth = endDate.getDate();
    const habitNames = [
      "Sunlight",
      "Water",
      "Air",
      "Healthy Food",
      "Exercise",
      "Temperance",
      "Rest",
      "Trust in God",
    ];
    const result: any[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${month}-${d.toString().padStart(2, "0")}`;
      const habits: Record<string, boolean> = {};
      habitNames.forEach((habit) => {
        habits[habit] = !!(daysMap[dateStr] && daysMap[dateStr][habit]);
      });
      result.push({ date: dateStr, habits });
    }
    return [...result];
  }
} 