import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "./report.controller";
import { HabitLog } from "./entities/habit-log.entity";
import { ReportService } from "./report.service";

@Module({
  imports: [TypeOrmModule.forFeature([HabitLog])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {} 