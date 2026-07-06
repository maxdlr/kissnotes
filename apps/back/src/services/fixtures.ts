import ExpressionEntity from '@/entities/ExpressionEntity';
import NativeExpressionEntity from '@/entities/NativeExpressionEntity';
import SaveEntity from '@/entities/SaveEntity';
import UserEntity from '@/entities/UserEntity';
import ExpressionRepository from '@/repositories/ExpressionRepository';
import jsBuiltins from '@/ressources/js-builtins';
import nativeExpressionContent from '@/ressources/native-expressions';
import { parseAeExpression } from '@/api/expressions/services/parseAeExpressions';
import {
  CodeModel,
  LayerModel,
  LayerTypeEnum,
  PropertyModel,
} from '@kissnotes/types';
import { faker } from '@faker-js/faker';
import { EntityManager } from 'typeorm';

const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)] as T;
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
  `time * 360`,
  `loopOut("cycle")`,
  `value + [Math.sin(time * 3) * 20, 0]`,
  `effect("Opacity Control")("Slider") / 100`,
  `thisComp.layer("Null 1").transform.position`,
  `linear(time, 0, 3, 0, 100)`,
  `ease(time, inPoint, outPoint, 0, 100)`,
  `posterizeTime(12); value`,
  `seedRandom(index, true); wiggle(2, 30)`,
  `[value[0], thisComp.height / 2]`,
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

// --- Helpers ---

const ensureAdminUser = async (manager: EntityManager): Promise<UserEntity> => {
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD environment variable is not set');
  }

  const existing = await manager.findOneBy(UserEntity, { username: 'maxdlr' });
  if (existing) return existing;

  const user = new UserEntity();
  user.username = 'maxdlr';
  user.email = 'contact@maxdlr.com';
  user.password = process.env.ADMIN_PASSWORD;
  user.description = 'Creator of this platform';
  user.type = 'admin';
  return await manager.save(UserEntity, user);
};

const loadNativeExpressions = async (
  manager: EntityManager,
): Promise<NativeExpressionEntity[]> => {
  await manager
    .createQueryBuilder()
    .delete()
    .from(NativeExpressionEntity)
    .execute();
  return await manager.save(NativeExpressionEntity, [
    ...nativeExpressionContent,
    ...jsBuiltins,
  ]);
};

const makeUsers = async (
  manager: EntityManager,
  count: number,
): Promise<UserEntity[]> => {
  return await Promise.all(
    Array.from({ length: count }).map(async () => {
      const user = new UserEntity();
      user.username = faker.internet.username();
      user.email = faker.internet.email();
      user.password = 'password';
      user.description = faker.lorem.paragraph(2);
      return await manager.save(UserEntity, user);
    }),
  );
};

const seedExpressions = async (
  manager: EntityManager,
  users: UserEntity[],
  nativeExpressions: NativeExpressionEntity[],
  count: number,
): Promise<void> => {
  const layer: LayerModel = { name: 'my solid', type: LayerTypeEnum.Solid };
  const property: PropertyModel = { name: 'position', group: 'transform' };

  const codes: CodeModel[] = Array.from({ length: count }).map(() => {
    const raw = randomElement(expressionCodes);
    return {
      lines: raw
        .split('\n')
        .map((content, i) => ({ number: i + 1, content })),
    };
  });

  await manager.save(
    ExpressionEntity,
    Array.from({ length: count }).map((_, i) => {
      const code = codes[i] as CodeModel;
      const expression = new ExpressionEntity();
      expression.title = faker.lorem.sentence();
      expression.description = faker.lorem.paragraph(3);
      expression.author = randomElement(users);
      expression.layer = layer;
      expression.property = property;
      expression.code = code;
      expression.symbols = parseAeExpression(code, nativeExpressions);
      expression.published = faker.datatype.boolean();
      expression.views = faker.number.int({ min: 0, max: 1000 });
      expression.shares = faker.number.int({ min: 0, max: 1000 });
      return expression;
    }),
  );
};

// --- Public API ---

/**
 * Production: ensures admin user exists and refreshes native expressions.
 * Development: wipes all data and seeds users, expressions, and native expressions.
 */
export const loadFixtures = async (): Promise<void> => {
  const isDev = process.env.NODE_ENV === 'development';

  await ExpressionRepository.manager.transaction(async (manager) => {
    if (isDev) {
      await manager.createQueryBuilder().delete().from(SaveEntity).execute();
      await manager
        .createQueryBuilder()
        .delete()
        .from(ExpressionEntity)
        .execute();
      await manager.createQueryBuilder().delete().from(UserEntity).execute();
    }

    const nativeExpressions = await loadNativeExpressions(manager);
    const admin = await ensureAdminUser(manager);

    if (isDev) {
      const count = 50;
      const users = [...(await makeUsers(manager, 25)), admin];
      await seedExpressions(manager, users, nativeExpressions, count);
    }

    console.log(`Fixtures loaded (${isDev ? 'development' : 'production'})`);
  });
};
