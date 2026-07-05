import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";
import { FindOptionsWhere } from "typeorm";

interface NativeExpressionFilters {
  search?: string;
  maxResults?: number | string;
  title?: string;
}

/**
 * Builds a TypeORM WHERE clause from only the allowed filter fields.
 * Allowed: `title` (string).
 */
const buildWhitelistedWhere = (
  where: NativeExpressionFilters,
): FindOptionsWhere<NativeExpressionEntity> => {
  const allowed: FindOptionsWhere<NativeExpressionEntity> = {};

  if (typeof where.title === "string") {
    allowed.title = where.title;
  }

  return allowed;
};

const findAllNativeExpressions = async (
  where?: NativeExpressionFilters,
): Promise<NativeExpressionEntity[]> => {
  if (!where) {
    return NativeExpressionRepository.find({});
  }

  const sanitizedWhere = buildWhitelistedWhere(where);
  const take: number = where.maxResults ? Number(where.maxResults) : 50;

  if (where.search) {
    const qb =
      NativeExpressionRepository.createQueryBuilder("expression").where(
        sanitizedWhere,
      );

    const searchWords = where.search.split(/\s+/).filter(Boolean);
    searchWords.forEach((searchWord: string, i: number) => {
      const param = `search${i}`;
      qb.andWhere(
        `(
expression.title LIKE :${param} 
OR expression.description LIKE :${param} 
OR CAST(expression.code AS CHAR) LIKE :${param} 
)`,
        { [param]: `%${searchWord}%` },
      );
    });

    return await qb.take(take).getMany();
  }

  return await NativeExpressionRepository.find({
    where: sanitizedWhere,
    take,
  });
};

export default findAllNativeExpressions;
