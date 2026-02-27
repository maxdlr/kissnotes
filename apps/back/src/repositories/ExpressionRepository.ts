import ExpressionEntity from "@/entities/ExpressionEntity";
import { AppDataSource } from "@/services/database/datasource";

const ExpressionRepository = AppDataSource.getRepository(ExpressionEntity);

// export const ExpressionRepository = AppDataSource.getRepository(Expression).extend({
//     findByTitle(title: string) {
//         return this.createQueryBuilder("expression")
//             .where("expression.title = :title", { title })
//             .getMany()
//     },
// })

export default ExpressionRepository;
