import SaveEntity from "@/entities/SaveEntity";
import { AppDataSource } from "@/services/database/datasource";

const SaveRepository = AppDataSource.getRepository(SaveEntity);

// export const SaveRepository = AppDataSource.getRepository(Save).extend({
//     findByTitle(title: string) {
//         return this.createQueryBuilder("save")
//             .where("save.title = :title", { title })
//             .getMany()
//     },
// })

export default SaveRepository;
