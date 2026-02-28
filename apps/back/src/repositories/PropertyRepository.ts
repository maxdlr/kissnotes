import PropertyEntity from "@/entities/PropertyEntity";
import { AppDataSource } from "@/services/database/datasource";

const PropertyRepository = AppDataSource.getRepository(PropertyEntity);

// export const PropertyRepository = AppDataSource.getRepository(Property).extend({
//     findByTitle(title: string) {
//         return this.createQueryBuilder("property")
//             .where("property.title = :title", { title })
//             .getMany()
//     },
// })

export default PropertyRepository;
