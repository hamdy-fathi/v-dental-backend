import {
  BadRequestException,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UploadsService } from "./uploads.service";

@Controller("global-media")
export class UploadsController {
  constructor(private readonly fileUploadService: UploadsService) {}

  @Post("upload")
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        fileSize: 10485760, // 10MB (قبل الضغط)
        files: 10,
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
          "application/pdf",
          "image/svg+xml",
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Invalid file type"), false);
        }
      },
      storage: diskStorage({
        destination: process.env.UPLOADS_PATH || "/var/www/v-dental-backend/uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fieldName = file.fieldname || "file";
          cb(null, `${fieldName}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException("No files were uploaded");
    }
    return this.fileUploadService.handleFilesUpload(files);
  }
  @Post("upload-single")
  @UseInterceptors(FileInterceptor("file"))
  uploadSingleFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 10485760, // 10MB (قبل الضغط)
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileUploadService.handleFilesUpload([file]);
  }
}
