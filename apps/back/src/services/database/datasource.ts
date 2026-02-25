import "reflect-metadata";
import Entities from "@/entities/index";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 3307,
  username: "root",
  password: "root",
  database: process.env.APP_NAME,
  synchronize: true,
  logging: false,
  entities: Entities,
  migrations: [],
  subscribers: [],
});
