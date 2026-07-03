import ExpressionEntity from "@/entities/ExpressionEntity";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";
import { FindOptionsWhere } from "typeorm";

const findAllNativeExpressions = async (
  where?: any,
): Promise<NativeExpressionEntity[]> => {
  const { search, maxResults, symbols, ...sanitizedWhere } = where;

  const take: number = maxResults ? Number(maxResults) : 50;

  if (search) {
    const baseWhere = sanitizedWhere as FindOptionsWhere<ExpressionEntity>;
    const qb =
      NativeExpressionRepository.createQueryBuilder("expression").where(
        baseWhere,
      );

    const searchWords = search.split(/\s+/).filter(Boolean);
    searchWords.forEach((searchWord: string, i: number) => {
      const param = `search${i}`;
      qb.andWhere(
        `(
expression.title LIKE :${param} 
OR expression.description LIKE :${param} 
OR CAST(expression.example AS CHAR) LIKE :${param} 
)`,
        { [param]: `%${searchWord}%` },
      );
    });

    return await qb.take(take).getMany();
  }

  return await NativeExpressionRepository.findBy(sanitizedWhere);
};

export default findAllNativeExpressions;
