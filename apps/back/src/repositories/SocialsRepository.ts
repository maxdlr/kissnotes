import SocialLinkEntity from "@/entities/SocialEntity";
import { AppDataSource } from "@/services/database/datasource";

const SocialLinkRepository = AppDataSource.getRepository(SocialLinkEntity);
// .extend({
// add a prefind* so that it matches any find method and adds data to the response
// async find(...args: Parameters<typeof SocialsRepository["find"]>) {
//     const expressions = await super.find(...args);

//     for (const expression of expressions) {
//         expression.symbols = parseAeSocials(expression.code)
//     }

//     return expressions;
// },
// });

// export const SocialsRepository = AppDataSource.getRepository(Socials).extend({
//     findByTitle(title: string) {
//         return this.createQueryBuilder("expression")
//             .where("expression.title = :title", { title })
//             .getMany()
//     },
// })

export default SocialLinkRepository;
