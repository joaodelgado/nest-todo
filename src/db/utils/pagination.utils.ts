import { PaginatedFilter, PaginatedResult } from "src/domain/utils/pagination.util";
import { FindManyOptions } from "typeorm";

export function paginate<DbEntity>(options: FindManyOptions<DbEntity>, filter: PaginatedFilter<any>): FindManyOptions<DbEntity> {
  options.skip = (filter.page - 1) * filter.size;
  options.take = filter.size + 1; // +1 to check if there's a next page
  return options
}

export function to_paginated_result<DbEntity, Entity>(filter: PaginatedFilter<any>, contents: DbEntity[], mapper: (content: DbEntity) => Entity): PaginatedResult<Entity> {
  return {
    page: filter.page,
    has_next: contents.length > filter.size,
    content: contents.slice(0, filter.size).map(mapper),
  }
}
