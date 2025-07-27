import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { BibleModule } from "./bible/bible.module";
import { ReportModule } from "./report/report.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>("NODE_ENV") === "production";
        const type = configService.get<string>("DATABASE_TYPE") || "sqlite";

        // Verifica se todas as variáveis do Postgres estão configuradas
        const postgresHost = configService.get<string>("DATABASE_HOST");
        const postgresUser = configService.get<string>("DATABASE_USERNAME");
        const postgresPassword = configService.get<string>("DATABASE_PASSWORD");
        const postgresDatabase = configService.get<string>("DATABASE_NAME");

        const hasPostgresConfig = postgresHost && postgresUser && postgresPassword && postgresDatabase;

        if (type === "postgres" && hasPostgresConfig) {
          return {
            type: "postgres",
            host: postgresHost,
            port: parseInt(
              configService.get<string>("DATABASE_PORT") || "5432",
              10,
            ),
            username: postgresUser,
            password: postgresPassword,
            database: postgresDatabase,
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: !isProd,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        } else {
          // Fallback para SQLite se Postgres não estiver configurado
          console.log(
            "Using SQLite database (Postgres not configured or incomplete)",
          );
          return {
            type: "sqlite",
            database: configService.get<string>("DATABASE_NAME") || "db.sqlite",
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: true,
          };
        }
      },
    }),
    UserModule,
    AuthModule,
    BibleModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
