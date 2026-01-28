import { Body, Controller, Delete, HttpCode, Post, Put, Req } from "@nestjs/common";
import { Auth } from "src/shared/decorators/auth.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthType, Role } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { CreateSectionFourDto, UpdateSectionFourDto } from "./dto/create-section-four.dto";
import { SectionFourService } from "./section-four.service";

@Controller("section-four")
export class SectionFourController implements SelectOptions, RelationOptions {
  constructor(private readonly service: SectionFourService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      main_headline: true,
      main_description: true,
      right_section_image_1: true,
      right_section_image_2: true,
      right_section_image_3: true,
      right_section_image_4: true,
      features: true,
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
  async getActiveSectionFour() {
    return this.service.getActiveSectionFour();
  }

  @Post("/store")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async create(@Body() create: CreateSectionFourDto, @Req() req: Request) {
    const contentWithCreatedBy = create.content.map(item => ({
      language_id: item.language_id,
      main_headline: item.main_headline,
      main_description: item.main_description,
      right_section_image_1: item.right_section_image_1,
      right_section_image_2: item.right_section_image_2,
      right_section_image_3: item.right_section_image_3,
      right_section_image_4: item.right_section_image_4,
      features: item.features,
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
  async update(@Body() update: UpdateSectionFourDto, @Req() req: Request) {
    const contentWithCreatedBy = update.content.map(item => ({
      id: item.id,
      language_id: item.language_id,
      main_headline: item.main_headline,
      main_description: item.main_description,
      right_section_image_1: item.right_section_image_1,
      right_section_image_2: item.right_section_image_2,
      right_section_image_3: item.right_section_image_3,
      right_section_image_4: item.right_section_image_4,
      features: item.features,
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
