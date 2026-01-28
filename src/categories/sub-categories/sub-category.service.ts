import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interfaces/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { SubCategoryDto } from "./dtos/create.dto";
import { PatchSubCategoryDto } from "./dtos/patch.dto";
import { SubCategory } from "./sub-category.entity";

@Injectable()
export class SubCategoryService
  extends BaseService<SubCategory, SubCategoryDto, PatchSubCategoryDto>
  implements ICrudService<SubCategory, SubCategoryDto, PatchSubCategoryDto>
{
  constructor(
    apiFeaturesService: APIFeaturesService,
    @InjectRepository(SubCategory)
    repository: Repository<SubCategory>,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    const parentId = filteredRecord?.parentId;
    super.queryRelationIndex(queryBuilder, filteredRecord);

    if (parentId) {
      queryBuilder.leftJoin("e.category", "category").andWhere("category.id = :parentId", {
        parentId: filteredRecord.parentId,
      });
    } else {
      queryBuilder.where("e.parent IS NULL");
    }
  }
}
