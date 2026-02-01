import { Body, Controller, Delete, Get, HttpCode, Post, Put } from "@nestjs/common";
import { Auth } from "src/shared/decorators/auth.decorator";
import { AuthType } from "src/shared/enum/global-enum";
import { BeforeAfterService } from "./before-after.service";
import { CreateBeforeAfterDto, UpdateBeforeAfterDto } from "./dto/before-after.dto";

@Controller("before-after")
export class BeforeAfterController {
  constructor(private readonly beforeAfterService: BeforeAfterService) {}

  @Get()
  @Auth(AuthType.None)
  getBeforeAfterPairs() {
    return this.beforeAfterService.getPairs();
  }

  @Post("/index")
  @HttpCode(200)
  @Auth(AuthType.Bearer)
  getAll() {
    return this.beforeAfterService.getAll();
  }

  @Get("/index")
  @Auth(AuthType.Bearer)
  getAllGet() {
    return this.beforeAfterService.getAll();
  }

  @Post("/store")
  @Auth(AuthType.Bearer)
  create(@Body() createDto: CreateBeforeAfterDto) {
    return this.beforeAfterService.createPair(createDto);
  }

  @Put("/update")
  @Auth(AuthType.Bearer)
  update(@Body() updateDto: UpdateBeforeAfterDto) {
    return this.beforeAfterService.updatePair(updateDto);
  }

  @Delete("/delete")
  @Auth(AuthType.Bearer)
  delete(@Body() body: { id: number }) {
    return this.beforeAfterService.deletePair(body.id);
  }
}

