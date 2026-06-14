import UserEntity from "@/entities/UserEntity";
import { UserModel } from "@kissnotes/types";
import "express";

declare module "express" {
  interface Request {
    user?: UserModel | UserEntity;
  }
}
