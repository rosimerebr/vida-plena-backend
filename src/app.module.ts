import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { BibleModule } from "./bible/bible.module";
import { ReportModule } from "./report/report.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
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
