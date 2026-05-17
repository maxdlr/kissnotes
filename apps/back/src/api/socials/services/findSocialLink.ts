import SocialLinkEntity from "@/entities/SocialEntity";
import SocialLinkRepository from "@/repositories/SocialsRepository";
import { FindOptionsWhere } from "typeorm";

const findSocialLink = async (
  where: FindOptionsWhere<Pick<SocialLinkEntity, "id" | "name" | "user">>,
) => {
  const socialLink = await SocialLinkRepository.findOne({ where }).catch(() => {
    throw Missing("Social link not found");
  });
  return socialLink;
};
export default findSocialLink;
