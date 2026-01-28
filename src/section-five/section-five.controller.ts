import { Body, Controller, Delete, HttpCode, Post, Put, Req } from "@nestjs/common";
import { Auth } from "src/shared/decorators/auth.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthType, Role } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { CreateSectionFiveDto, UpdateSectionFiveDto } from "./dto/create-section-five.dto";
import { SectionFiveService } from "./section-five.service";

@Controller("section-five")
export class SectionFiveController implements SelectOptions, RelationOptions {
  constructor(private readonly service: SectionFiveService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      doctor_image: true,
      about_services: true,
      experience_years: true,
      title: true,
      short_description: true,
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
  async getActiveSectionFive() {
    return this.service.getActiveSectionFive();
  }

  @Post("/store")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async create(@Body() create: CreateSectionFiveDto, @Req() req: Request) {
    const contentWithCreatedBy = create.content.map(item => ({
      language_id: item.language_id,
      doctor_image: item.doctor_image,
      about_services: item.about_services,
      experience_years: item.experience_years,
      title: item.title,
      short_description: item.short_description,
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
  async update(@Body() update: UpdateSectionFiveDto, @Req() req: Request) {
    const contentWithCreatedBy = update.content.map(item => ({
      id: item.id,
      language_id: item.language_id,
      doctor_image: item.doctor_image,
      about_services: item.about_services,
      experience_years: item.experience_years,
      title: item.title,
      short_description: item.short_description,
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
