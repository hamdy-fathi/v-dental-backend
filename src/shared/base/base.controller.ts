import { Body, Controller, Delete, HttpCode, Post } from "@nestjs/common";
import { Auth } from "../decorators/auth.decorator";
import { Roles } from "../decorators/roles.decorator";
import { AuthType } from "../enum/global-enum";
import { BaseService } from "./base";

@Controller()
export abstract class BaseController<T, CreateDto, UpdateDto> {
  constructor(protected readonly service: BaseService<T, CreateDto, UpdateDto>) {}

  @Post("/front")
  @HttpCode(200)
  @Auth(AuthType.None)
  public async findAll(@Body() query: any) {
    return await this.service.findFront(query);
  }

  @Post("/index")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  @HttpCode(200)
  public index(@Body() filter: any) {
    return this.service.findAll(filter);
  }

  @Delete("/delete")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
