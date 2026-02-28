import LineEntity from "@/entities/LineEntity";
import { AppDataSource } from "@/services/database/datasource";

const LineRepository = AppDataSource.getRepository(LineEntity);

// export const LineRepository = AppDataSource.getRepository(Line).extend({
//     findByTitle(title: string) {
//         return this.createQueryBuilder("line")
//             .where("line.title = :title", { title })
//             .getMany()
//     },
// })

export default LineRepository;
