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

        if (type === "postgres") {
          return {
            type: "postgres",
            host: configService.get<string>("DATABASE_HOST"),
            port: parseInt(
              configService.get<string>("DATABASE_PORT") || "5432",
              10,
            ),
            username: configService.get<string>("DATABASE_USERNAME"),
            password: configService.get<string>("DATABASE_PASSWORD"),
            database: configService.get<string>("DATABASE_NAME"),
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: !isProd,
          };
        } else {
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
