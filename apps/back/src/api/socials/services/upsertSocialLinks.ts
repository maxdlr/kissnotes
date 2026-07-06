import { Id, SocialLinkModel } from "@kissnotes/types";
import findSocialLink from "./findSocialLink";
import createSocialLink from "./createSocialLink";
import SocialLinkRepository from "@/repositories/SocialsRepository";

const upsertSocialLinks = async (
  userId: Id,
  socialLinks: SocialLinkModel[] | SocialLinkModel,
) => {
  if (!Array.isArray(socialLinks)) {
    socialLinks = [socialLinks];
  }

  // Remove socials that are no longer in the submitted list
  const existingLinks = await SocialLinkRepository.find({
    where: { user: { id: Number(userId) } },
  });

  const submittedNames = new Set(socialLinks.map((s) => s.name));
  const toDelete = existingLinks.filter((l) => !submittedNames.has(l.name));
  if (toDelete.length) {
    await SocialLinkRepository.remove(toDelete);
  }

  // Upsert submitted socials
  const updatedSocials = await Promise.all(
    socialLinks
      .map(async (socialLink) => {
        const existingLink = await findSocialLink({
          name: socialLink.name,
          user: { id: Number(userId) },
        });

        if (existingLink) {
          existingLink.url = socialLink.url;
          return await SocialLinkRepository.save(existingLink);
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
