import CodeEntity from "@/entities/CodeEntity";
import ExpressionEntity from "@/entities/ExpressionEntity";
import LayerEntity from "@/entities/LayerEntity";
import LineEntity from "@/entities/LineEntity";
import PropertyEntity from "@/entities/PropertyEntity";
import UserEntity from "@/entities/UserEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { faker } from "@faker-js/faker";
import nativeExpressionContent from "../ressources/native-expressions";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import jsBuiltins from "@/ressources/js-builtins";

export const loadFixtures = async () => {
  return await ExpressionRepository.manager.transaction(async (manager) => {
    await manager.save(NativeExpressionEntity, [
      ...nativeExpressionContent,
      ...jsBuiltins,
    ]);

    const layer = await manager.save(LayerEntity, {
      name: "my solid",
      type: "solid",
    });
    const property = await manager.save(PropertyEntity, {
      name: "position",
      group: "transform",
    });

    const author = new UserEntity();
    author.username = "maxdlr";
    author.email = "contact@maxdlr.com";
    author.password = "password"; // triggers set password() → bcrypt.hashSync
    await manager.save(UserEntity, author);

    const codes: CodeEntity[] = await Promise.all(
      Array.from({ length: 10 }).map(() =>
        manager
          .save(
            LineEntity,
            Array.from({ length: 1 }).map((_v, i) => ({
              number: i + 1,
              content: `const parent = content("fingers").content("thumb").content("joints").content("distal");

const parentPos = parent.transform.position;
const parentRot = degreesToRadians(parent.transform.rotation);
var rotatedX = value[0] * Math.cos(parentRot) - value[1] * Math.sin(parentRot);
var rotatedY = value[0] * Math.sin(parentRot) + value[1] * Math.cos(parentRot);

[rotatedX, rotatedY] + parentPos;
`,
            })),
          )
          .then((lines) => manager.save(CodeEntity, { lines })),
      ),
    );

    await manager.save(
      ExpressionEntity,
      Array.from({ length: 10 }).map((_v, i) => ({
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(10),
        author,
        layer,
        property,
        code: codes[i],
      })),
    );

    console.log("Fixtures loaded");
  });
};
