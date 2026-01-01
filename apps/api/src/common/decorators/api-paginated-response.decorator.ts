import type { Type } from "@nestjs/common";

import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

import { PaginationMeta } from "../types/paginated-response.type";

/**
 * Decorator for documenting paginated API responses in Swagger.
 *
 * The NestJS Swagger plugin cannot automatically introspect generic types like
 * `PaginatedResponse<T>` because TypeScript generics are erased at compile time.
 * This decorator provides the OpenAPI schema manually by using `getSchemaPath()`
 * to reference the model and pagination metadata.
 *
 * @example
 * ```typescript
 * @Get()
 * @ApiPaginatedResponse(FolderDto)
 * async findUserFolders(): Promise<PaginatedResponse<FolderDto>> {
 *   // ...
 * }
 * ```
 */
export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel
) =>
  applyDecorators(
    ApiExtraModels(PaginationMeta, model),
    ApiOkResponse({
      schema: {
        properties: {
          items: {
            type: "array",
            items: { $ref: getSchemaPath(model) },
          },
          meta: {
            $ref: getSchemaPath(PaginationMeta),
          },
        },
      },
    })
  );
