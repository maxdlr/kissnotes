import UserEntity from "@/entities/UserEntity";
import { AppDataSource } from "@/services/database/datasource";

async function main() {
  await AppDataSource.initialize();
  await AppDataSource.synchronize();

  console.log("Checking if Maxdlr exists...");
  if (
    await AppDataSource.manager.exists(UserEntity, {
      where: { username: "maxdlr" },
    })
  ) {
    console.log("Maxdlr already exists.");
    return;
  }

  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }

  console.log("Doesnt exist, creating...");
  const user = new UserEntity();
  user.username = "maxdlr";
  user.email = "contact@maxdlr.com";
  user.password = process.env.ADMIN_PASSWORD;
  user.description = "Creator of this platform";
  user.type = "admin";

  await AppDataSource.manager.save(UserEntity, user);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
