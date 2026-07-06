// scripts/nukeAndRebuild.ts
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import jsBuiltins from "@/ressources/js-builtins";
import nativeExpressionContent from "@/ressources/native-expressions";
import { AppDataSource } from "@/services/database/datasource";
import { EntityManager } from "typeorm";

const loadNativeExpressions = async (manager: EntityManager): Promise<void> => {
  await manager
    .createQueryBuilder()
    .delete()
    .from(NativeExpressionEntity)
    .execute();

  await manager.save(NativeExpressionEntity, [
    ...nativeExpressionContent,
    ...jsBuiltins,
  ]);
};

async function nuke() {
  await AppDataSource.initialize();

  console.log("Deleting all native expressions...");
  await AppDataSource.manager.deleteAll(NativeExpressionEntity);

  console.log("Sourcing native expressions...");
  await loadNativeExpressions(AppDataSource.manager);

  console.log("Done.");
}

nuke().catch((err) => {
  console.error(err);
  process.exit(1);
});
