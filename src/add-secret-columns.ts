import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";

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

async function addSecretColumns() {
  try {
    await PostgresDataSource.initialize();
    console.log("✅ Connected to PostgreSQL database!");

    const queryRunner = PostgresDataSource.createQueryRunner();

    // Verificar se as colunas já existem
    const columns = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      AND column_name IN ('secretQuestion', 'secretAnswer')
    `);

    console.log("Existing secret columns:", columns);

    // Adicionar coluna secretQuestion se não existir
    if (!columns.find((col: any) => col.column_name === 'secretquestion')) {
      await queryRunner.query(`
        ALTER TABLE "user" 
        ADD COLUMN "secretQuestion" VARCHAR
      `);
      console.log("✅ Added secretQuestion column");
    } else {
      console.log("ℹ️ secretQuestion column already exists");
    }

    // Adicionar coluna secretAnswer se não existir
    if (!columns.find((col: any) => col.column_name === 'secretanswer')) {
      await queryRunner.query(`
        ALTER TABLE "user" 
        ADD COLUMN "secretAnswer" VARCHAR
      `);
      console.log("✅ Added secretAnswer column");
    } else {
      console.log("ℹ️ secretAnswer column already exists");
    }

    await queryRunner.release();
    console.log("✅ Secret columns migration completed!");

  } catch (error) {
    console.error("❌ Error during migration:", error);
  } finally {
    await PostgresDataSource.destroy();
  }
}

addSecretColumns(); 