import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import * as bcrypt from "bcrypt";

// Conexão com PostgreSQL
const PostgresDataSource = new DataSource({
  type: "postgres",
  host: "dpg-d234qsfdiees739a64t0-a.oregon-postgres.render.com",
  port: 5432,
  username: "vida_plena_postgres_user",
  password: "8K1Kgg9AkdSiXTtIi5H4uQtLzFrIxzew",
  database: "vida_plena_postgres",
  entities: [User],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrateSecretQuestions() {
  try {
    await PostgresDataSource.initialize();
    console.log("✅ Connected to PostgreSQL database!");

    const userRepo = PostgresDataSource.getRepository(User);

    // Buscar usuários sem secretQuestion
    const usersWithoutSecret = await userRepo.find({
      where: {
        secretQuestion: null as any
      }
    });

    console.log(`Found ${usersWithoutSecret.length} users without secret question:`);
    usersWithoutSecret.forEach((user) => {
      console.log(`- ${user.fullName} (${user.email})`);
    });

    if (usersWithoutSecret.length === 0) {
      console.log("ℹ️ All users already have secret questions configured.");
      return;
    }

    // Atualizar usuários com pergunta padrão
    for (const user of usersWithoutSecret) {
      user.secretQuestion = "What is your mother's name?";
      user.secretAnswer = await bcrypt.hash("default", 10); // Resposta padrão temporária
      
      await userRepo.save(user);
      console.log(`✅ Updated user: ${user.fullName} (${user.email})`);
    }

    console.log("✅ Secret questions migration completed successfully!");
    console.log(`📊 Summary: ${usersWithoutSecret.length} users updated`);
    console.log("⚠️  Note: Users with default secret answer need to update their password recovery settings.");

  } catch (error) {
    console.error("❌ Error during migration:", error);
  } finally {
    await PostgresDataSource.destroy();
  }
}

migrateSecretQuestions(); 