import { IsOptional, IsPositive, Max } from 'class-validator';
import { PaginatedResult } from 'src/domain/utils/pagination.util';

export class PaginatedRequest {
  @IsOptional()
  @IsPositive()
  @Max(50)
  public page: number = 1;

  @IsOptional()
  @IsPositive()
  @Max(50)
  public size: number = 10;
}

export class PaginatedResponse<T> {
  page: number;
  size: number;
  has_next: boolean;
  content: T[];

  public static from_domain<T, D>(
    result: PaginatedResult<D>,
    mapper: (content: D) => T,
  ): PaginatedResponse<T> {
    const response = new PaginatedResponse<T>();
    response.page = result.page;
    response.size = result.content.length;
    response.has_next = result.has_next;
    response.content = result.content.map(mapper);
    return response;
  }
}
