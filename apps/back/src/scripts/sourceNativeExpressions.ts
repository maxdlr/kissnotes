import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import jsBuiltins from "@/ressources/js-builtins";
import nativeExpressionContent from "@/ressources/native-expressions";
import { AppDataSource } from "@/services/database/datasource";

async function main() {
  await AppDataSource.initialize();
  await AppDataSource.synchronize();

  console.log("Deleting all native expressions...");
  if (AppDataSource.hasMetadata(NativeExpressionEntity)) {
    await AppDataSource.manager
      .createQueryBuilder()
      .delete()
      .from(NativeExpressionEntity)
      .execute();
  }

  console.log("Sourcing native expressions...");
  await AppDataSource.manager.save(NativeExpressionEntity, [
    ...nativeExpressionContent,
    ...jsBuiltins,
  ]);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
