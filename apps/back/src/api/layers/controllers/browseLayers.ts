import { NextFunction, Request, Response } from "express";
import findAllLayers from "../services/findAllLayers";
import LayerEntity from "@/entities/LayerEntity";
import { TryCatch } from "@/decorators/TryCatch";

const browseLayers = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response<LayerEntity[]>> => {
  const layers = await findAllLayers();
  return res.status(200).send(layers);
};

export default TryCatch(browseLayers);
