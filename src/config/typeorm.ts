// Register tsconfig-paths before any other imports to resolve path aliases
import "tsconfig-paths/register";

import { ConfigService } from "@nestjs/config";
import { config as dotenvConfig } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: ".env.pro" });

const configService = new ConfigService();
const config = {
  type: "postgres",
  host: configService.get<string>("DATABASE_HOST"),
  port: configService.get<string>("DATABASE_PORT"),
  username: configService.get<string>("DATABASE_USER"),
  password: configService.get<string>("DATABASE_PASSWORD"),
  database: configService.get<string>("DATABASE_NAME"),
  synchronize: false,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
};

// Create and export DataSource instance as default
// TypeORM CLI requires exactly ONE default export of DataSource
export default new DataSource(config as DataSourceOptions);
