import CodeEntity from "@/entities/CodeEntity";
import { AppDataSource } from "@/services/database/datasource";

const CodeRepository = AppDataSource.getRepository(CodeEntity);

// export const CodeRepository = AppDataSource.getRepository(Code).extend({
//     findByTitle(title: string) {
//         return this.createQueryBuilder("code")
//             .where("code.title = :title", { title })
//             .getMany()
//     },
// })

export default CodeRepository;
