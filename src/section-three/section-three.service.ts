import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LanguageService } from "src/language/language.service";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interfaces/crud-service.interface";
import { Repository } from "typeorm";
import { CreateSectionThreeDto, UpdateSectionThreeDto } from "./dto/create-section-three.dto";
import { SectionThree } from "./section-three.entity";

@Injectable()
export class SectionThreeService
  extends BaseService<SectionThree, CreateSectionThreeDto, UpdateSectionThreeDto>
  implements ICrudService<SectionThree, CreateSectionThreeDto, UpdateSectionThreeDto>
{
  constructor(
    @InjectRepository(SectionThree)
    repository: Repository<SectionThree>,
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

  // Get active section three data
  public async getActiveSectionThree() {
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
