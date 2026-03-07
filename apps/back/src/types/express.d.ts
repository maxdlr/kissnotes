import { Id } from "@kissnotes/types";
import "express";

declare module "express" {
  interface Request {
    user?: {
      id: Id;
      username: string;
      email: string;
    };
  }
}
