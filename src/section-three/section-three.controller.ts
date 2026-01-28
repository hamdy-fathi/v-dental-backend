import { Body, Controller, Delete, HttpCode, Post, Put, Req } from "@nestjs/common";
import { Auth } from "src/shared/decorators/auth.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthType, Role } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { CreateSectionThreeDto, UpdateSectionThreeDto } from "./dto/create-section-three.dto";
import { SectionThreeService } from "./section-three.service";

@Controller("section-three")
export class SectionThreeController implements SelectOptions, RelationOptions {
  constructor(private readonly service: SectionThreeService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      main_headline: true,
      description: true,
      services_images: true,
      service_image_before: true,
      service_image_after: true,
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
  async getActiveSectionThree() {
    return this.service.getActiveSectionThree();
  }

  @Post("/store")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async create(@Body() create: CreateSectionThreeDto, @Req() req: Request) {
    const contentWithCreatedBy = create.content.map(item => ({
      language_id: item.language_id,
      main_headline: item.main_headline,
      description: item.description,
      services_images: item.services_images,
      service_image_before: item.service_image_before,
      service_image_after: item.service_image_after,
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
  async update(@Body() update: UpdateSectionThreeDto, @Req() req: Request) {
    const contentWithCreatedBy = update.content.map(item => ({
      id: item.id,
      language_id: item.language_id,
      main_headline: item.main_headline,
      description: item.description,
      services_images: item.services_images,
      service_image_before: item.service_image_before,
      service_image_after: item.service_image_after,
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
