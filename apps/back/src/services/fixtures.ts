import CodeEntity from "@/entities/CodeEntity";
import ExpressionEntity from "@/entities/ExpressionEntity";
import LayerEntity from "@/entities/LayerEntity";
import LineEntity from "@/entities/LineEntity";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import PropertyEntity from "@/entities/PropertyEntity";
import UserEntity from "@/entities/UserEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import jsBuiltins from "@/ressources/js-builtins";
import { faker } from "@faker-js/faker";
import nativeExpressionContent from "../ressources/native-expressions";
import { EntityManager } from "typeorm";
import { parseAeExpression } from "@/api/expressions/services/parseAeExpressions";
import { CodeModel } from "@kissnotes/types";

const randomElement = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const expressionCodes = [
  `const parent = content("fingers").content("thumb").content("joints").content("distal");

const parentPos = parent.transform.position;
const parentRot = degreesToRadians(parent.transform.rotation);
var rotatedX = value[0] * Math.cos(parentRot) - value[1] * Math.sin(parentRot);
var rotatedY = value[0] * Math.sin(parentRot) + value[1] * Math.cos(parentRot);

[rotatedX, rotatedY] + parentPos;
`,
  `
amp = 5.0; freq = 2.0; decay = 4.0;

n = 0;

if (numKeys > 0) {
  n = nearestKey(time).index;
  if (key(n).time > time) { n--; }
}

if (n == 0) { t = 0; }
else { t = time - key(n).time; }

if (n > 0 && t < 1) {
  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);
  value + v*(amp/100)*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);
}

else { value; }
`,
  `freq = 2;
amp = 10;

wiggle(freq,amp)`,
  `delayFrames = [number of frame delay];

delay = framesToTime(delayFrames);

[parent property].valueAtTime(time-delay);
`,
  `slider = effect("Slider Control")("Slider");
sec = slider%60;
min = Math.floor(slider/60);

function addZero(n){
  if (n < 10) return "0" + n else return n;
}

addZero(Math.floor(min)) + ":" + addZero(Math.floor(sec));`,
];

const makeUsers = async (
  manager: EntityManager,
  count?: number,
): Promise<UserEntity | UserEntity[]> => {
  if (count) {
    return await Promise.all(
      Array.from({ length: count }).map(async (_) => {
        const author = new UserEntity();
        author.username = faker.person.firstName();
        author.email = `${faker.person.firstName()}@${faker.commerce.productName()}.com`;
        author.password = "password";
        return await manager.save(UserEntity, author);
      }),
    );
  }

  const author = new UserEntity();
  author.username = "maxdlr";
  author.email = "contact@maxdlr.com";
  author.password = "password";
  return await manager.save(UserEntity, author);
};
export const loadFixtures = async () => {
  return await ExpressionRepository.manager.transaction(async (manager) => {
    const nativeExpressions = await manager.save(NativeExpressionEntity, [
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

    const codes: CodeEntity[] = await Promise.all(
      Array.from({ length: 30 }).map(() =>
        manager
          .save(
            LineEntity,
            Array.from({ length: 1 }).map((_v, i) => ({
              number: i + 1,
              content: randomElement(expressionCodes),
            })),
          )
          .then((lines) => manager.save(CodeEntity, { lines })),
      ),
    );

    const users = (await makeUsers(manager, 20)) as UserEntity[];

    await manager.save(
      ExpressionEntity,
      Array.from({ length: 30 }).map((_v, i) => ({
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(3),
        author: randomElement(users),
        layer,
        property,
        code: codes[i],
        symbols: parseAeExpression(codes[i] as CodeModel, nativeExpressions),
      })),
    );

    console.log("Fixtures loaded");
  });
};
