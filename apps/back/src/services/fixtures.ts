import CodeEntity from "@/entities/CodeEntity";
import LineEntity from "@/entities/LineEntity";
import CodeRepository from "@/repositories/CodeRepository";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import LayerRepository from "@/repositories/LayerRepository";
import LineRepository from "@/repositories/LineRepository";
import PropertyRepository from "@/repositories/PropertyRepository";
import UserRepository from "@/repositories/UserRepository";
import { faker } from "@faker-js/faker";

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

  // const lines = (number: number): CodeModel["lines"] => {
  //   const map = new Map<number, s>();
  //   for (let i = 0; i < number; i++) {
  //     map.set(i, faker.lorem.lines(1));
  //   }
  //   return map;
  // };

  const lines: LineEntity[] = await LineRepository.save(
    Array.from({ length: 40 }).map((_v, i) => ({
      number: i + 1,
      content: faker.lorem.lines(1),
    })),
  );

  console.log({ lines });

  const codes: CodeEntity[] = await CodeRepository.save(
    Array.from({ length: 10 }).map((_v, i: number) => ({
      lines: lines.slice(i * 4, (i + 1) * 4 || 10),
    })),
  );

  await ExpressionRepository.save(
    Array.from({ length: 10 }).map((_v, i: number) => ({
      title: faker.word.noun(),
      description: faker.lorem.paragraph(10),
      user,
      layer,
      property,
      code: codes[i],
    })),
  );
  console.log("Fixtures loaded");
};
