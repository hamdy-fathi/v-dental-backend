import { registerAs } from "@nestjs/config";

export default registerAs("appConfig", () => ({
  environment: process.env.NODE_ENV || "production",
  apiVersion: process.env.API_VERSION,
  uploadsPath: process.env.UPLOADS_PATH || "/var/www/v-dental-backend/uploads",
}));
