import ExpressionEntity from "@/entities/ExpressionEntity";
import { faker } from "@faker-js/faker";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import LayerRepository from "@/repositories/LayerRepository";
import PropertyRepository from "@/repositories/PropertyRepository";
import UserRepository from "@/repositories/UserRepository";

export const loadFixtures = async () => {
  const layer = await LayerRepository.save({
    name: "my solid",
    type: "solid",
  });
  const property = await PropertyRepository.save({
    name: "position",
    group: "transform",
  });
  const user = await UserRepository.save({
    firstname: "max",
    lastname: "dlr",
  });
  await ExpressionRepository.save(
    Array.from({ length: 10 }).map(() => ({
      title: faker.word.noun(),
      description: faker.lorem.paragraph(10),
      user,
      layer,
      property,
    })),
  );
  console.log("Fixtures loaded");
};
