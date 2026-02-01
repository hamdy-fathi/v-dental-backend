import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Auth } from "src/shared/decorators/auth.decorator";
import { AuthType } from "src/shared/enum/global-enum";

@Controller()
export class SimpleUploadController {
  @Post("upload")
  @Auth(AuthType.None)
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }
}

