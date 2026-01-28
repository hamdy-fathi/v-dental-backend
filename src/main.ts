import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import * as express from "express";
import { AppModule } from "./app.module";
import { DatabaseExceptionFilter } from "./shared/global-erros/database-error.filter";
import { HttpExceptionFilter } from "./shared/global-erros/http-exception.filter";
dotenv.config({ path: ".env.pro" });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
  });

  // Increase request size limit for large SVG files (up to 10MB)
  app.use((req, res, next) => {
    req.setTimeout(30000); // 30 seconds timeout
    next();
  });

  // Configure body parser for large JSON payloads
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  app.enableCors();
  app.setGlobalPrefix("/api/v1");
  app.useGlobalFilters(new DatabaseExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3001);
}
bootstrap();
