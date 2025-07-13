import { Controller, Get, Body, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { HabitLog } from "./entities/habit-log.entity";
import { ReportService } from "./report.service";

const HABITS = [
  "Sunlight",
  "Water",
  "Air",
  "Healthy Food",
  "Exercise",
  "Temperance",
  "Rest",
  "Trust in God"
];

@Controller("report")
export class ReportController {
  constructor(
    @InjectRepository(HabitLog)
    private readonly habitLogRepo: Repository<HabitLog>,
    private readonly reportService: ReportService,
  ) {}

  @Get()
  async getWeeklyHabitsReport() {
    // Busca todos os hábitos da semana atual
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // domingo
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // sábado

    const logs = await this.habitLogRepo.find({
      where: {
        date: Between(
          startOfWeek.toISOString().slice(0, 10),
          endOfWeek.toISOString().slice(0, 10)
        ),
      },
    });

    // Inicializa o resultado
    const result: Record<string, number[]> = {};
    for (const habit of HABITS) {
      result[habit] = [0, 0, 0, 0, 0, 0, 0];
    }

    // Agrupa os logs por hábito e dia da semana
    for (const log of logs) {
      const habit = log.habit;
      const day = new Date(log.date).getDay(); // 0=domingo, 6=sábado
      if (result[habit]) {
        result[habit][day] += 1;
      }
    }

    return result;
  }

  @Post()
  async registerHabit(@Body() body: { userId: number; habit: string; date: string }) {
    return this.reportService.registerHabit(body.userId, body.habit, body.date);
  }
} 