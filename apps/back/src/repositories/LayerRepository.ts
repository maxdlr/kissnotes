import LayerEntity from "@/entities/LayerEntity";
import { AppDataSource } from "@/services/database/datasource";

const LayerRepository = AppDataSource.getRepository(LayerEntity);

// export const LayerRepository = AppDataSource.getRepository(Layer).extend({
//     findByTitle(title: string) {
//         return this.createQueryBuilder("layer")
//             .where("layer.title = :title", { title })
//             .getMany()
//     },
// })

export default LayerRepository;
