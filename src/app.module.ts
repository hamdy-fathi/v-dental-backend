import { CacheModule } from "@nestjs/cache-manager";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BeforeAfterModule } from "./before-after/before-after.module";
import jwtConfig from "./auth/config/jwt.config";
import { AccessTokenGuard } from "./auth/guards/access-token/access-token.guard";
import { AuthenticationGuard } from "./auth/guards/authentication/authentication.guard";
import { RolesGuard } from "./auth/guards/roles/roles.guard";
import { BlogModule } from "./blogs/blog.module";
import { CategoryModule } from "./categories/category.module";
import { SubCategoryModule } from "./categories/sub-categories/sub-category.module";
import { ContactModule } from "./contact/contact.module";
import { GeneralSettingsModule } from "./general-settings/settings.module";
import { LanguageModule } from "./language/language.module";
import { SectionBranchesModule } from "./section-branches/section-branches.module";
import { SectionDoctorsModule } from "./section-doctors/section-doctors.module";
import { SectionFiveModule } from "./section-five/section-five.module";
import { SectionFourModule } from "./section-four/section-four.module";
import { SectionOneModule } from "./section-one/section-one.module";
import { SectionReviewsModule } from "./section-reviews/section-reviews.module";
import { SectionThreeModule } from "./section-three/section-three.module";
import { SectionTwoModule } from "./section-two/section-two.module";
import appConfig from "./shared/config/app.config";
import databaseConfig from "./shared/config/database.config";
import { FilterDateModule } from "./shared/filters/filter-date.module";
import { APIFeaturesService } from "./shared/filters/filter.service";
import { UploadsModule } from "./shared/global-api/uploads/uploads.module";
import { TransformInterceptor } from "./shared/interceptor/transform-response.interceptor";
import { ListModule } from "./shared/list/list.module";
import { LanMiddleware } from "./shared/middleware/lang.middleware";
import { UserMiddleware } from "./shared/middleware/user.middleware";
import { EmailModule } from "./shared/services/email.module";
import { SharedModule } from "./shared/shared.module";
import enviromentValidation from "./shared/validations/env.validation";
import { UnifiedDataModule } from "./unified-data";
import { UserModule } from "./users/users.module";
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    SharedModule,
    EmailModule,
    UploadsModule,
    FilterDateModule,
    CategoryModule,
    SubCategoryModule,
    UserModule,
    BlogModule,
    ContactModule,
    ListModule,
    GeneralSettingsModule,
    LanguageModule,
    SectionOneModule,
    SectionTwoModule,
    SectionThreeModule,
    SectionFourModule,
    SectionFiveModule,
    SectionReviewsModule,
    SectionBranchesModule,
    SectionDoctorsModule,
    CategoryModule,
    SubCategoryModule,
    UnifiedDataModule,
    AuthModule,
    BeforeAfterModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
      serveStaticOptions: {
        index: false,
        fallthrough: true,
      },
    }),
    CacheModule.register({
      ttl: 5000,
      max: 10,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? ".env" : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: enviromentValidation,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "/public",
      serveStaticOptions: {
        index: false,
        fallthrough: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("database.host"),
        port: configService.get("database.port"),
        database: configService.get("database.name"),
        username: configService.get("database.user"),
        password: configService.get("database.password"),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    APIFeaturesService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanMiddleware).forRoutes("*");
    consumer
      .apply(UserMiddleware)
      .exclude(
        { path: "auth/login", method: RequestMethod.ALL },
        { path: "contact/store", method: RequestMethod.ALL },
        { path: "sub/create", method: RequestMethod.ALL },
        { path: "sub/subscribe", method: RequestMethod.ALL },
      )
      .forRoutes(
        { path: "*/store", method: RequestMethod.POST },
        { path: "*/update", method: RequestMethod.POST },
      );
  }
}
