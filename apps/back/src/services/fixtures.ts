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

  // Very short
  `time * 360`,

  `loopOut("cycle")`,

  `value + [Math.sin(time * 3) * 20, 0]`,

  `effect("Opacity Control")("Slider") / 100`,

  `thisComp.layer("Null 1").transform.position`,

  // Short
  `linear(time, 0, 3, 0, 100)`,

  `ease(time, inPoint, outPoint, 0, 100)`,

  `posterizeTime(12); value`,

  `seedRandom(index, true); wiggle(2, 30)`,

  `[value[0], thisComp.height / 2]`,

  // Medium
  `var t = (time - inPoint) / (outPoint - inPoint);
Math.sin(t * Math.PI) * 100;`,

  `var n = index;
var total = thisComp.numLayers;
var angle = (n / total) * 2 * Math.PI;
var r = 200;
[Math.cos(angle) * r + thisComp.width/2, Math.sin(angle) * r + thisComp.height/2];`,

  `var src = thisComp.layer("Control").effect("Slider Control")("Slider");
var mapped = linear(src, 0, 100, -500, 500);
[mapped, value[1]];`,

  `var bounce = Math.abs(Math.sin(time * 4)) * 50;
[value[0], value[1] - bounce];`,

  `var key1 = key(1).time;
var key2 = key(numKeys).time;
ease(time, key1, key2, 0, 360);`,

  // Quite long
  `var maxDist = 400;
var mouse = thisComp.layer("Null 1").transform.position;
var d = length(mouse, transform.position);
var falloff = Math.max(0, 1 - d / maxDist);
var angle = Math.atan2(
  transform.position[1] - mouse[1],
  transform.position[0] - mouse[0]
);
var push = falloff * 80;
[value[0] + Math.cos(angle) * push, value[1] + Math.sin(angle) * push];`,

  `var inDur = 0.5;
var outDur = 0.5;
var fadeIn = linear(time, inPoint, inPoint + inDur, 0, 1);
var fadeOut = linear(time, outPoint - outDur, outPoint, 1, 0);
Math.min(fadeIn, fadeOut) * 100;`,

  `var layer = thisComp.layer(index - 1);
var offset = 3;
var t = time - offset * (index - 1) * thisComp.frameDuration;
if (t < layer.inPoint) { layer.transform.opacity.valueAtTime(layer.inPoint); }
else { layer.transform.opacity.valueAtTime(t); }`,

  // Very long
  `var ctrl = thisComp.layer("Master Control");
var bpm = ctrl.effect("BPM")("Slider");
var beatTime = 60 / bpm;
var phase = ctrl.effect("Phase")("Slider");
var beatPos = (time + phase) % beatTime;
var t = beatPos / beatTime;
var pulse;
if (t < 0.1) {
  pulse = ease(t, 0, 0.1, 0, 1);
} else if (t < 0.3) {
  pulse = ease(t, 0.1, 0.3, 1, 0);
} else {
  pulse = 0;
}
var minScale = 100;
var maxScale = 130;
linear(pulse, 0, 1, minScale, maxScale);`,

  `var numCopies = 8;
var radius = 300;
var speed = 45;
var i = index % numCopies;
var baseAngle = (i / numCopies) * 360;
var currentAngle = degreesToRadians(baseAngle + time * speed);
var cx = thisComp.width / 2;
var cy = thisComp.height / 2;
var wobble = Math.sin(time * 2 + i) * 20;
[
  cx + Math.cos(currentAngle) * (radius + wobble),
  cy + Math.sin(currentAngle) * (radius + wobble)
];`,
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
    await manager.deleteAll(NativeExpressionEntity);
    // await manager.deleteAll(LayerEntity);
    // await manager.deleteAll(PropertyEntity);
    // await manager.deleteAll(CodeEntity);
    // await manager.deleteAll(LineEntity);
    await manager.deleteAll(ExpressionEntity);
    await manager.deleteAll(UserEntity);

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
      Array.from({ length: 50 }).map(() =>
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

    const users = [
      ...((await makeUsers(manager, 10)) as UserEntity[]),
      await makeUsers(manager),
    ] as UserEntity[];
    // await makeUsers(manager);

    await manager.save(
      ExpressionEntity,
      Array.from({ length: 50 }).map((_v, i) => ({
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
