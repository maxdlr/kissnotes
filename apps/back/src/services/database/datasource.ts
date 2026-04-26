import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: Number(process.env.DB_PORT),
  username: "root",
  password: "root",
  database: process.env.APP_NAME,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../../entities/**/*.{ts,js}"],
  migrations: [],
  subscribers: [],
  timezone: "France/Paris",
});
