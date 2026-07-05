import { TryCatch } from "@/decorators/TryCatch";
import { Request, Response } from "express";
import searchAll, { BrowseMode } from "../services/searchAll";

const VALID_MODES: BrowseMode[] = ["all", "mine", "saved", "native"];

const search = async (req: Request, res: Response): Promise<Response> => {
  const {
    mode = "all",
    search: query,
    tokens,
    authorId,
    userId,
    maxResults,
  } = req.query as {
    mode?: string;
    search?: string;
    tokens?: string;
    authorId?: string;
    userId?: string;
    maxResults?: string;
  };

  const browseMode: BrowseMode = VALID_MODES.includes(mode as BrowseMode)
    ? (mode as BrowseMode)
    : "all";

  const tokenList = tokens
    ? tokens.split(",").filter(Boolean)
    : [];

  const results = await searchAll({
    mode: browseMode,
    search: query,
    tokens: tokenList,
    authorId: authorId ? Number(authorId) : undefined,
    userId: userId ? Number(userId) : undefined,
    maxResults: maxResults ? Number(maxResults) : undefined,
  });

  return res.status(200).send(results);
};

export default TryCatch(search);
