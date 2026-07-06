// scripts/nukeAndRebuild.ts
import { AppDataSource } from "@/services/database/datasource";

async function nuke() {
  await AppDataSource.initialize();

  console.log("Dropping all tables...");
  await AppDataSource.dropDatabase();

  console.log("Rebuilding from entities...");
  await AppDataSource.synchronize();

  console.log("Done.");
  await AppDataSource.destroy();
}

nuke().catch((err) => {
  console.error(err);
  process.exit(1);
});
