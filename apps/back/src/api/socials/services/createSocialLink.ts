import findUser from "@/api/users/services/findUser";
import SocialLinkEntity from "@/entities/SocialEntity";
import SocialLinkRepository from "@/repositories/SocialsRepository";
import validateCrudPayload from "@/services/validateCrudPayload";
import { SocialLinkModel, SocialType } from "@kissnotes/types";
import { DeepPartial } from "typeorm";

const createSocialLink = async (socialLink: DeepPartial<SocialLinkModel>) => {
  const owner = await findUser({ id: socialLink.user?.id });

  if (!owner) {
    throw ApiError("User not found");
  }

  const newSocialLink = new SocialLinkEntity();
  newSocialLink.name = socialLink.name as SocialType;
  newSocialLink.url = socialLink.url as SocialType;
  newSocialLink.user = owner;

  await validateCrudPayload(newSocialLink);

  return await SocialLinkRepository.save(newSocialLink).catch(() => {
    throw ApiError("Cannot create new social link");
  });
};
export default createSocialLink;
