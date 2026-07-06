// scripts/nukeAndRebuild.ts
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import jsBuiltins from "@/ressources/js-builtins";
import nativeExpressionContent from "@/ressources/native-expressions";
import { AppDataSource } from "@/services/database/datasource";
import { EntityManager } from "typeorm";

const loadNativeExpressions = async (manager: EntityManager): Promise<void> => {
  console.log("Deleting all native expressions...");
  await manager
    .createQueryBuilder()
    .delete()
    .from(NativeExpressionEntity)
    .execute();

  console.log("Sourcing native expressions...");
  await manager.save(NativeExpressionEntity, [
    ...nativeExpressionContent,
    ...jsBuiltins,
  ]);
};

async function nuke() {
  await AppDataSource.initialize();
  await loadNativeExpressions(AppDataSource.manager);
  console.log("Done.");
}

nuke().catch((err) => {
  console.error(err);
  process.exit(1);
});
