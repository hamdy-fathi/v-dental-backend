import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LanguageService } from "src/language/language.service";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interfaces/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Contact } from "./contact.entity";
import { ContactDto } from "./dtos/create.dto";
import { PatchContactDto } from "./dtos/patch.dto";

@Injectable()
export class ContactsService
  extends BaseService<Contact, ContactDto, PatchContactDto>
  implements ICrudService<Contact, ContactDto, PatchContactDto>
{
  constructor(
    apiFeaturesService: APIFeaturesService,
    @InjectRepository(Contact)
    repository: Repository<Contact>,
    protected readonly languageService: LanguageService,
  ) {
    super(repository, apiFeaturesService, languageService);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>) {}
}
