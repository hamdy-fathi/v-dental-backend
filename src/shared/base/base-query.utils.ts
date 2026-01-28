import { SelectQueryBuilder } from "typeorm";

export abstract class BaseQueryUtils<T> {
  protected getRelationQuery(queryBuilder: SelectQueryBuilder<T>, relations: Record<string, any>) {
    if (relations && Object.keys(relations).length > 0) {
      const processRelation = (relationPath: string, fields: Record<string, any>) => {
        const selectFields = Object.entries(fields).map(([key]) => `${relationPath}.${key}`);
        queryBuilder.leftJoin(`e.${relationPath}`, relationPath).addSelect(selectFields);

        Object.entries(fields).forEach(([key, value]) => {
          if (typeof value === "object" && !Array.isArray(value))
            processRelation(`${relationPath}.${key}`, value);
        });
      };

      Object.entries(relations).forEach(([relation, fields]) => {
        if (typeof fields === "object") processRelation(relation, fields);
      });
    }
  }

  protected getSelectQuery(
    queryBuilder: SelectQueryBuilder<T>,
    selectOptions: Record<string, boolean>,
  ) {
    if (selectOptions) {
      const selectFields = Object.entries(selectOptions).map(([key]) => `e.${key}`);
      queryBuilder.select(selectFields);
    }
  }

  protected response(data: T[], totalRecords: number) {
    return {
      data,
      recordsFiltered: data.length,
      totalRecords: +totalRecords,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected queryRelationIndex(queryBuilder?: SelectQueryBuilder<T>, filteredRecord?: any) {
    queryBuilder.leftJoin("e.createdBy", "ec").addSelect(["ec.id", "ec.firstName", "ec.lastName"]);
  }

  // front query filters
  protected applySearch(queryBuilder: any, search?: string) {
    if (search) {
      queryBuilder.where("e.name LIKE :search", { search: `%${search}%` });
    }
    return queryBuilder;
  }

  protected applyFilters(
    queryBuilder: any,
    filters?: Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    customFilters?: Record<string, any>,
  ) {
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryBuilder.andWhere(`e.${key} = :${key}`, { [key]: value });
        }
      });
    }
    return queryBuilder;
  }

  protected applySorting(queryBuilder: any, sort?: { field: string; order: "ASC" | "DESC" }) {
    if (sort) {
      queryBuilder.orderBy(`e.${sort.field}`, sort.order);
    }
    return queryBuilder;
  }

  protected applyPagination(
    queryBuilder: SelectQueryBuilder<T>,
    page: number,
    limit: number,
    isPagination: string,
  ) {
    if (isPagination === "true" && page && limit) {
      const skip = (page - 1) * limit;
      return queryBuilder.skip(skip).take(limit);
    }
    return queryBuilder;
  }

  protected applyLimit(queryBuilder: SelectQueryBuilder<T>, limit: number, isPagination: string) {
    if (isPagination === "false" && limit) {
      return queryBuilder.skip(0).take(limit);
    }
    return queryBuilder;
  }

  protected applySelect(queryBuilder: SelectQueryBuilder<T>, selectOptions: string[]) {
    if (selectOptions && selectOptions.length) {
      const selectFields = selectOptions.map(field => `e.${field}`);
      queryBuilder.select(selectFields);
    }
    return queryBuilder;
  }
}
