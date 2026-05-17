import { SocialLinkModel } from "@kissnotes/types";
import { Request, Response } from "express";
import upsertSocialLinks from "../services/upsertSocialLinks";

const editSocials = async ({ user, body }: Request, res: Response) => {
  if (!user) {
    throw Unauthorized("user");
  }

  if (!body.socials) {
    throw ApiError("Socials missing: nothing to add");
  }

  const { socials } = body;

  const addedSocials = await upsertSocialLinks(
    user.id,
    socials as SocialLinkModel[],
  );

  return res.status(201).send(addedSocials);
};
export default editSocials;
