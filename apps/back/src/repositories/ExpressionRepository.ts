import ExpressionEntity from "@/entities/ExpressionEntity";
import { AppDataSource } from "@/services/database/datasource";

const ExpressionRepository = AppDataSource.getRepository(ExpressionEntity)
    // .extend({
    // add a prefind* so that it matches any find method and adds data to the response
    // async find(...args: Parameters<typeof ExpressionRepository["find"]>) {
    //     const expressions = await super.find(...args);

    //     for (const expression of expressions) {
    //         expression.symbols = parseAeExpression(expression.code)
    //     }

    //     return expressions;
    // },
// });

// export const ExpressionRepository = AppDataSource.getRepository(Expression).extend({
//     findByTitle(title: string) {
//         return this.createQueryBuilder("expression")
//             .where("expression.title = :title", { title })
//             .getMany()
//     },
// })

export default ExpressionRepository;
