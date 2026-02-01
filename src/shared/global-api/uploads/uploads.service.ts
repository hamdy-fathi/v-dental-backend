import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}
  async handleFilesUpload(files: Array<Express.Multer.File>) {
    const processedFiles = [];

    for (const file of files) {
      const isImage = file.mimetype.startsWith("image/");

      if (isImage) {
        // ضغط الصور
        const compressedFile = await this.compressImage(file);
        processedFiles.push({
          name: `uploads/${compressedFile.filename}`,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          compressionRatio: Math.round((1 - compressedFile.size / file.size) * 100),
        });
      } else {
        // الملفات الأخرى بدون ضغط
        processedFiles.push({
          name: `uploads/${file.filename}`,
        });
      }
    }

    return processedFiles;
  }

  private async compressImage(file: Express.Multer.File): Promise<Express.Multer.File> {
    // Use the same path where the file was uploaded (from MulterModule config)
    const uploadPath = this.configService.get<string>("appConfig.uploadsPath") || "/var/www/v-dental-backend/uploads";
    const originalPath = path.join(uploadPath, file.filename);
    const targetSize = 150 * 1024; // 150KB

    // إنشاء اسم ملف مضغوط
    const compressedFilename = `compressed-${file.filename}`;
    const compressedPath = path.join(uploadPath, compressedFilename);

    try {
      let quality = 60;
      let currentSize = file.size;

      // إذا كان الملف أصغر من 150KB، لا نحتاج لضغطه
      if (currentSize <= targetSize) {
        return file;
      }

      // ضغط تدريجي حتى نصل للحجم المطلوب
      while (currentSize > targetSize && quality > 20) {
        await sharp(originalPath)
          .jpeg({
            quality: quality,
            progressive: true,
            mozjpeg: true,
          })
          .png({
            quality: quality,
            compressionLevel: 9,
            progressive: true,
          })
          .webp({
            quality: quality,
            effort: 6,
          })
          .resize(1200, 800, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .toFile(compressedPath);

        // التحقق من الحجم الجديد
        const stats = fs.statSync(compressedPath);
        currentSize = stats.size;

        // إذا لم نصل للحجم المطلوب، نخفض الجودة
        if (currentSize > targetSize) {
          quality -= 10;
        }
      }

      // حذف الملف الأصلي
      fs.unlinkSync(originalPath);

      // إعادة تسمية الملف المضغوط
      const finalPath = path.join(uploadPath, file.filename);
      fs.renameSync(compressedPath, finalPath);

      // الحصول على حجم الملف المضغوط النهائي
      const finalStats = fs.statSync(finalPath);

      return {
        ...file,
        size: finalStats.size,
        path: finalPath,
      };
    } catch (error) {
      console.error("Error compressing image:", error);
      // في حالة فشل الضغط، نرجع الملف الأصلي
      return file;
    }
  }
}
