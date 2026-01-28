import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LanguageService } from "src/language/language.service";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interfaces/crud-service.interface";
import { Repository } from "typeorm";
import { CreateSectionFourDto, SectionFourUpdateContentDto } from "./dto/create-section-four.dto";
import { SectionFour } from "./section-four.entity";

@Injectable()
export class SectionFourService
  extends BaseService<SectionFour, CreateSectionFourDto, SectionFourUpdateContentDto>
  implements ICrudService<SectionFour, CreateSectionFourDto, SectionFourUpdateContentDto>
{
  constructor(
    @InjectRepository(SectionFour)
    repository: Repository<SectionFour>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly languageService: LanguageService,
  ) {
    super(repository, apiFeaturesService, languageService);
  }

  // Override findAll to return data without pagination
  public async findAll(filterData: any) {
    return this.findFront({
      query: {
        ...filterData,
        isPagination: "false",
      },
    });
  }

  // Get active section four data
  public async getActiveSectionFour() {
    const sections = await this.findAll({
      is_active: true,
      relations: {
        language: {
          select: ["id", "name"],
        },
      },
    });
    if (sections && sections.data && sections.data.length > 0) {
      return { content: sections.data.map(item => ({ ...item, language_id: item.language.id })) };
    }
    return { content: null };
  }
}
