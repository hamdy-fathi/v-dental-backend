import { Body, Controller, Delete, HttpCode, Post, Put, Req } from "@nestjs/common";
import { Auth } from "src/shared/decorators/auth.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthType, Role } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { LanguageService } from "./language.service";

@Controller("language")
export class LanguageController implements SelectOptions, RelationOptions {
  constructor(private readonly service: LanguageService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Auth(AuthType.None)
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll({
      length: 2,
      start: 0,
      search: { value: null, regex: false },
      columns: [
        { name: "name", searchable: false, orderable: false },
        { name: "id", searchable: false, orderable: false },
      ],
      order: [
        {
          column: filterQueryDto.column !== -1 ? filterQueryDto.column : 0,
          dir: filterQueryDto.sortOrder === 1 ? "asc" : "desc",
        },
      ],
    });
  }

  @Post("/show")
  @HttpCode(200)
  async findOne(@Body() filterQueryDto: any) {
    return this.service.findOne(filterQueryDto);
  }

  @Post("/store")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async create(@Body() create: CreateLanguageDto, @Req() req: Request) {
    return await this.service.create(
      {
        name: create.name,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async update(@Body() update: UpdateLanguageDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        name: update.name,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
