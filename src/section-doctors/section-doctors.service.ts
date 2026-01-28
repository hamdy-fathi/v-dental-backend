import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LanguageService } from "src/language/language.service";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interfaces/crud-service.interface";
import { Repository } from "typeorm";
import {
  CreateSectionDoctorsDto,
  SectionDoctorsUpdateContentDto,
} from "./dto/create-section-doctors.dto";
import { SectionDoctors } from "./section-doctors.entity";

@Injectable()
export class SectionDoctorsService
  extends BaseService<SectionDoctors, CreateSectionDoctorsDto, SectionDoctorsUpdateContentDto>
  implements ICrudService<SectionDoctors, CreateSectionDoctorsDto, SectionDoctorsUpdateContentDto>
{
  constructor(
    @InjectRepository(SectionDoctors)
    repository: Repository<SectionDoctors>,
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

  // Get active section doctors data
  public async getActiveSectionDoctors() {
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
