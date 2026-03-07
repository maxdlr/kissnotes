import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import { AppDataSource } from "@/services/database/datasource";

const NativeExpressionRepository = AppDataSource.getRepository(
  NativeExpressionEntity,
);

// export const NativeExpressionRepository = AppDataSource.getRepository(NativeExpression).extend({
//     findByTitle(title: string) {
//         return this.createQueryBuilder("nativeExpression")
//             .where("nativeExpression.title = :title", { title })
//             .getMany()
//     },
// })

export default NativeExpressionRepository;
