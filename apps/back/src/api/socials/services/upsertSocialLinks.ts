import SocialLinkRepository from "@/repositories/SocialsRepository";
import { Id, SocialLinkModel } from "@kissnotes/types";
import findSocialLink from "./findSocialLink";
import createSocialLink from "./createSocialLink";

const upsertSocialLinks = async (
  userId: Id,
  socialLinks: SocialLinkModel[] | SocialLinkModel,
) => {
  if (!Array.isArray(socialLinks)) {
    socialLinks = [socialLinks];
  }

  const updatedSocials = await Promise.all(
    socialLinks
      .map(async (socialLink) => {
        const existingLink = await findSocialLink({
          name: socialLink.name,
          user: { id: Number(userId) },
        });

        if (existingLink) {
          existingLink.url = socialLink.url;
          return await createSocialLink({
            ...existingLink,
            user: { id: Number(userId) },
          });
        }
        return await createSocialLink({
          ...socialLink,
          user: { id: Number(userId) },
        });
      })
      .filter(Boolean),
  );

  return updatedSocials;
};
export default upsertSocialLinks;
