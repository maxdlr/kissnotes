import CodeEntity from "@/entities/CodeEntity";
import ExpressionEntity from "@/entities/ExpressionEntity";
import LayerEntity from "@/entities/LayerEntity";
import LineEntity from "@/entities/LineEntity";
import PropertyEntity from "@/entities/PropertyEntity";
import UserEntity from "@/entities/UserEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { faker } from "@faker-js/faker";

export const loadFixtures = async () => {
  return await ExpressionRepository.manager.transaction(async (manager) => {
    const layer = await manager.save(LayerEntity, {
      name: "my solid",
      type: "solid",
    });
    const property = await manager.save(PropertyEntity, {
      name: "position",
      group: "transform",
    });
    const user = await manager.save(UserEntity, {
      firstname: "max",
      lastname: "dlr",
      username: "maxdlr",
    });

    const codes: CodeEntity[] = await Promise.all(
      Array.from({ length: 10 }).map(() =>
        manager
          .save(
            LineEntity,
            Array.from({ length: 4 }).map((_v, i) => ({
              number: i + 1,
              content: faker.lorem.lines(1),
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
        user,
        layer,
        property,
        code: codes[i],
      })),
    );

    console.log("Fixtures loaded");
  });
};
