import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interfaces/crud-service.interface";
import { Repository } from "typeorm";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { Language } from "./language.entity";

@Injectable()
export class LanguageService
  extends BaseService<Language, CreateLanguageDto, UpdateLanguageDto>
  implements ICrudService<Language, CreateLanguageDto, UpdateLanguageDto>
{
  constructor(
    @InjectRepository(Language)
    repository: Repository<Language>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }
}
