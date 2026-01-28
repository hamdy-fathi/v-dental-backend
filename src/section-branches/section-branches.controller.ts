import { Body, Controller, Delete, HttpCode, Post, Put, Req } from "@nestjs/common";
import { Auth } from "src/shared/decorators/auth.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthType, Role } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import {
  CreateSectionBranchesDto,
  UpdateSectionBranchesDto,
} from "./dto/create-section-branches.dto";
import { SectionBranchesService } from "./section-branches.service";

@Controller("section-branches")
export class SectionBranchesController implements SelectOptions, RelationOptions {
  constructor(private readonly service: SectionBranchesService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      branches: true,
      is_active: true,
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
    return this.service.findAll(filterQueryDto);
  }

  @Post("/show")
  @HttpCode(200)
  async findOne(@Body() filterQueryDto: any) {
    return this.service.findOne(filterQueryDto);
  }

  @Post("/get-active")
  @HttpCode(200)
  @Auth(AuthType.None)
  async getActiveSectionBranches() {
    return this.service.getActiveSectionBranches();
  }

  @Post("/store")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async create(@Body() create: CreateSectionBranchesDto, @Req() req: Request) {
    const contentWithCreatedBy = create.content.map(item => ({
      language_id: item.language_id,
      branches: item.branches,
      is_active: item.is_active,
      createdBy: req["createdBy"],
    }));

    return await this.service.create(
      contentWithCreatedBy as any,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async update(@Body() update: UpdateSectionBranchesDto, @Req() req: Request) {
    const contentWithCreatedBy = update.content.map(item => ({
      id: item.id,
      language_id: item.language_id,
      branches: item.branches,
      is_active: item.is_active,
      createdBy: req["createdBy"],
    }));

    return await this.service.update(
      contentWithCreatedBy as any,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
