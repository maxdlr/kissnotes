import { TryCatch } from "@/decorators/TryCatch";
import { Request, Response } from "express";
import searchAll from "../services/searchAll";

const search = async (req: Request, res: Response): Promise<Response> => {
  const { search: query, maxResults } = req.query as {
    search?: string;
    maxResults?: string;
  };

  const results = await searchAll({ search: query || "", maxResults });

  return res.status(200).send(results);
};

export default TryCatch(search);
