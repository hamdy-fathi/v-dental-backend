import { Global, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as fs from "fs";
import * as path from "path";
import { SimpleUploadController } from "./simple-upload.controller";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadsPath = process.env.UPLOADS_PATH || "/var/www/v-dental-backend/uploads";
          
          // Ensure uploads directory exists
          if (!fs.existsSync(uploadsPath)) {
            fs.mkdirSync(uploadsPath, { recursive: true });
          }
          
          cb(null, uploadsPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [UploadsController, SimpleUploadController],
  providers: [UploadsService],
})
export class UploadsModule {}
