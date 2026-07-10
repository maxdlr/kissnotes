import { Request, Response } from "express";
import findDashboardData from "../services/findDashboardData";

const getDashboard = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  const dashboard = await findDashboardData();
  return res.status(200).send(dashboard);
};

export default getDashboard;
