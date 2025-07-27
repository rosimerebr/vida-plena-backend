import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Habit } from "./report/entities/habit.entity";
import { HabitLog } from "./report/entities/habit-log.entity";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "dpg-d234qsfdiees739a64t0-a.oregon-postgres.render.com",
  port: 5432,
  username: "vida_plena_postgres_user",
  password: "8K1Kgg9AkdSiXTtIi5H4uQtLzFrIxzew",
  database: "vida_plena_postgres",
  entities: [User, Habit, HabitLog],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createTables() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully!");
    
    // Força a criação das tabelas
    await AppDataSource.synchronize();
    console.log("✅ Tables created successfully!");
    
    await AppDataSource.destroy();
    console.log("✅ Connection closed!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createTables(); 