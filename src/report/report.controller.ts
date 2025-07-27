import { Controller, Get, Body, Post, Query, UseGuards, Request } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { HabitLog } from "./entities/habit-log.entity";
import { ReportService } from "./report.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

interface HabitReport {
  habit: string;
  date: string;
}

const HABITS = [
  "Sunlight",
  "Water",
  "Air",
  "Healthy Food",
  "Exercise",
  "Temperance",
  "Rest",
  "Trust in God",
];

@Controller("report")
export class ReportController {
  constructor(
    @InjectRepository(HabitLog)
    private readonly habitLogRepo: Repository<HabitLog>,
    private readonly reportService: ReportService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWeeklyHabitsReport(@Request() req) {
    const userId = req.user.userId;
    
    // Search habits for the current week for the authenticated user
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

    const logs = await this.habitLogRepo.find({
      where: {
        userId: userId,
        date: Between(
          startOfWeek.toISOString().slice(0, 10),
          endOfWeek.toISOString().slice(0, 10),
        ),
      },
    });

    // Initialize the result
    const result: Record<string, number[]> = {};
    for (const habit of HABITS) {
      result[habit] = [0, 0, 0, 0, 0, 0, 0];
    }

    // Groups logs by habit and day of the week
    // And count how many different habits were marked per day
    const habitsPerDay: Record<number, Set<string>> = {
      0: new Set(),
      1: new Set(),
      2: new Set(),
      3: new Set(),
      4: new Set(),
      5: new Set(),
      6: new Set(),
    };
    for (const log of logs) {
      const habit = log.habit;
      const day = new Date(log.date).getDay(); // 0=Sunday, 6=Saturday
      if (result[habit]) {
        result[habit][day] += 1;
      }
      habitsPerDay[day].add(habit);
    }

    // Calcular streak: maior sequência de dias consecutivos em que TODOS os hábitos foram marcados
    let streak = 0;
    let currentStreak = 0;
    for (let i = 0; i < 7; i++) {
      if (habitsPerDay[i].size === HABITS.length) {
        currentStreak++;
        if (currentStreak > streak) streak = currentStreak;
      } else {
        currentStreak = 0;
      }
    }

    // Calculate totalCompleted: sum of all habit tags in the week
    let totalCompleted = 0;
    for (const habit of HABITS) {
      totalCompleted += result[habit].reduce((sum, val) => sum + val, 0);
    }

    return { ...result, streak, totalCompleted };
  }

  @UseGuards(JwtAuthGuard)
  @Get('monthly')
  async getMonthlyReport(@Request() req, @Query('month') month: string) {
    const userId = req.user.userId;
    return this.reportService.getMonthlyLogs(userId, month);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async registerHabits(@Request() req, @Body() habits: HabitReport[]) {
    const userId = req.user.userId;
    console.log("Received habits registration:", habits);

    try {
      const results: HabitLog[] = [];
      for (const habit of habits) {
        const result = await this.reportService.registerHabit(
          userId,
          habit.habit,
          habit.date,
        );
        results.push(result);
      }
      console.log("Habits registered successfully:", results);
      return {
        message: "Habits registered successfully",
        count: results.length,
      };
    } catch (error) {
      console.error("Error registering habits:", error);
      throw error;
    }
  }
}
