import { describe, it, expect } from "vitest";
import { parseAeExpression } from "./parseAeExpressions";
import nativeExpressions from "@/ressources/native-expressions";
import jsBuiltins from "@/ressources/js-builtins";
import { CodeModel, ExpressionToken } from "@kissnotes/types";

const allNative = [...nativeExpressions, ...jsBuiltins] as any[];

function parse(code: string) {
  const codeModel: CodeModel = {
    lines: code.split("\n").map((content, i) => ({ number: i + 1, content })),
  };
  return parseAeExpression(codeModel, allNative);
}

function titles(tokens: ExpressionToken[]) {
  return tokens.map((t) => t.title);
}

// ─── Native expression matching (loop over all entries) ───────────────────────

/**
 * Each entry provides a sample AE expression snippet that should trigger
 * a match for that native expression title.
 */
const nativeSamples: Record<string, string> = {
  // Standalone functions
  wiggle: "wiggle(2, 30)",
  posterizeTime: "posterizeTime(12)",
  comp: 'comp("Main Comp")',
  footage: 'footage("data.json")',
  random: "random(0, 100)",
  gaussRandom: "gaussRandom(0, 1)",
  seedRandom: "seedRandom(index, true)",
  noise: "noise(time)",
  linear: "linear(time, 0, 3, 0, 100)",
  ease: "ease(time, 0, 1, 0, 100)",
  easeIn: "easeIn(time, 0, 1, 0, 100)",
  easeOut: "easeOut(time, 0, 1, 0, 100)",
  add: "add(a, b)",
  sub: "sub(a, b)",
  mul: "mul(v, 2)",
  div: "div(v, 2)",
  clamp: "clamp(x, 0, 100)",
  dot: "dot(v1, v2)",
  cross: "cross(v1, v2)",
  normalize: "normalize(v)",
  length: "length(a, b)",
  lookAt: "lookAt(fromPt, atPt)",
  timeToFrames: "timeToFrames(time, 30)",
  framesToTime: "framesToTime(10)",
  timeToTimecode: "timeToTimecode(time)",
  timeToNTSCTimecode: "timeToNTSCTimecode(time)",
  timeToFeetAndFrames: "timeToFeetAndFrames(time)",
  timeToCurrentFormat: "timeToCurrentFormat(time)",
  rgbToHsl: "rgbToHsl(color)",
  hslToRgb: "hslToRgb(hsl)",
  hexToRgb: 'hexToRgb("#FF0000")',
  degreesToRadians: "degreesToRadians(90)",
  radiansToDegrees: "radiansToDegrees(Math.PI)",
  createPath: "createPath(pts, inT, outT, true)",
  loopOut: 'loopOut("cycle")',
  loopIn: 'loopIn("pingpong")',
  loopOutDuration: 'loopOutDuration("cycle", 2)',
  loopInDuration: 'loopInDuration("cycle", 1)',
  valueAtTime: "valueAtTime(time - 0.5)",
  velocityAtTime: "velocityAtTime(time)",
  speedAtTime: "speedAtTime(time)",
  smooth: "smooth(0.2, 5)",
  temporalWiggle: "temporalWiggle(3, 10)",
  nearestKey: "nearestKey(time)",
  key: "key(1)",
  effect: 'effect("Slider Control")',
  content: 'content("Shape 1")',
  mask: 'mask("Mask 1")',
  sourceRectAtTime: "sourceRectAtTime(time, true)",

  // Method calls (dot-prefixed)
  ".valueAtTime": "prop.valueAtTime(time)",
  ".velocityAtTime": "prop.velocityAtTime(time)",
  ".speedAtTime": "prop.speedAtTime(time)",
  ".smooth": "prop.smooth(0.1, 3)",
  ".temporalWiggle": "prop.temporalWiggle(2, 5)",
  ".loopIn": 'prop.loopIn("cycle")',
  ".loopOut": 'prop.loopOut("cycle")',
  ".loopInDuration": 'prop.loopInDuration("cycle", 1)',
  ".loopOutDuration": 'prop.loopOutDuration("cycle", 2)',
  ".key": "prop.key(2)",
  ".nearestKey": "prop.nearestKey(time)",
  ".previousKey": "prop.previousKey(time)",
  ".nextKey": "prop.nextKey(time)",
  ".sourceRectAtTime": "layer.sourceRectAtTime(time)",
  ".sourceTime": "layer.sourceTime(time)",
  ".sampleImage": "layer.sampleImage([100,100], [5,5])",
  ".effect": 'layer.effect("Blur")',
  ".mask": 'layer.mask("Mask 1")',
  ".content": 'layer.content("Group 1")',
  ".layer": 'thisComp.layer("Text")',
  ".toComp": "layer.toComp([0,0])",
  ".fromComp": "layer.fromComp([960,540])",
  ".toWorld": "layer.toWorld([0,0,0])",
  ".fromWorld": "layer.fromWorld([0,0,0])",
  ".toCompVec": "layer.toCompVec([1,0])",
  ".fromCompVec": "layer.fromCompVec([1,0])",
  ".toWorldVec": "layer.toWorldVec([0,1,0])",
  ".fromWorldVec": "layer.fromWorldVec([0,1,0])",
  ".fromCompToSurface": "layer.fromCompToSurface([500,500])",
  ".propertyGroup": "thisProperty.propertyGroup(1)",
  ".points": "path.points()",
  ".inTangents": "path.inTangents()",
  ".outTangents": "path.outTangents()",
  ".isClosed": "path.isClosed()",
  ".pointOnPath": "path.pointOnPath(0.5)",
  ".tangentOnPath": "path.tangentOnPath(0.5)",
  ".normalOnPath": "path.normalOnPath(0.5)",

  // Dot-accessed properties
  ".transform": "thisLayer.transform",
  ".position": "thisLayer.transform.position",
  ".anchorPoint": "thisLayer.transform.anchorPoint",
  ".scale": "thisLayer.transform.scale",
  ".rotation": "thisLayer.transform.rotation",
  ".opacity": "thisLayer.transform.opacity",
  ".xRotation": "thisLayer.transform.xRotation",
  ".yRotation": "thisLayer.transform.yRotation",
  ".zRotation": "thisLayer.transform.zRotation",
  ".orientation": "camera.transform.orientation",
  ".pointOfInterest": "camera.pointOfInterest",
  ".text.sourceText": "thisLayer.text.sourceText",
  ".zoom": "camera.zoom",
  ".depthOfField": "camera.depthOfField",
  ".focusDistance": "camera.focusDistance",
  ".aperture": "camera.aperture",
  ".blurLevel": "camera.blurLevel",
  ".intensity": "light.intensity",
  ".color": "light.color",
  ".coneAngle": "light.coneAngle",
  ".coneFeather": "light.coneFeather",
  ".shadowDarkness": "light.shadowDarkness",
  ".shadowDiffusion": "light.shadowDiffusion",
  ".maskPath": "m.maskPath",
  ".maskFeather": "m.maskFeather",
  ".maskOpacity": "m.maskOpacity",
  ".maskExpansion": "m.maskExpansion",
  ".path": "shape.path",
  ".sourceData": "footage.sourceData",
  ".source": "layer.source",
  ".propertyIndex": "thisProperty.propertyIndex",
  ".activeCamera": "thisComp.activeCamera",
  ".marker": "thisComp.marker",
  ".name": "thisLayer.name",
  ".width": "thisComp.width",
  ".height": "thisComp.height",
  ".duration": "thisComp.duration",
  ".active": "layer.active",
  ".enabled": "layer.enabled",

  // Global standalone properties
  time: "time * 360",
  value: "value + 10",
  thisComp: "thisComp",
  thisLayer: "thisLayer",
  thisProperty: "thisProperty",
  index: "index * 5",
  numKeys: "numKeys > 0",
  numLayers: "numLayers",
  inPoint: "time - inPoint",
  outPoint: "outPoint - time",
  startTime: "startTime",
  hasParent: "hasParent",
  parent: "parent",
  frameDuration: "frameDuration",
  colorDepth: "colorDepth",
  textIndex: "textIndex",
  textTotal: "textTotal",
  selectorValue: "selectorValue",
};

describe("parseAeExpression — native expression matching", () => {
  const entries = Object.entries(nativeSamples);

  it.each(entries)(
    'matches native "%s"',
    (key, snippet) => {
      const expectedTitle = key.startsWith(".") ? key.slice(1) : key;
      const result = parse(snippet);
      const nativeTokens = result.tokens.filter(
        (t) => (t as ExpressionToken).isNative,
      ) as ExpressionToken[];
      const matched = nativeTokens.find((t) => t.title === expectedTitle);
      expect(
        matched,
        `Expected native token "${expectedTitle}" in: ${snippet}\nGot: ${titles(nativeTokens).join(", ")}`,
      ).toBeDefined();
    },
  );
});

// ─── Keyword handling ─────────────────────────────────────────────────────────

describe("parseAeExpression — keywords", () => {
  it("classifies JS keywords as 'keyword' kind", () => {
    const result = parse("const x = 1;\nlet y = 2;\nfunction foo() {}");
    const kw = titles(result.groups.keywords);
    expect(kw).toContain("const");
    expect(kw).toContain("let");
    expect(kw).toContain("function");
  });

  it("does not put keywords in variables", () => {
    const result = parse("const myVar = wiggle(2, 30);");
    const vars = titles(result.groups.variables);
    expect(vars).not.toContain("const");
    expect(vars).toContain("myVar");
  });

  it("puts variable names in variables, not keywords", () => {
    const result = parse("var speed = 10;\nlet offset = speed * 2;");
    const vars = titles(result.groups.variables);
    expect(vars).toContain("speed");
    expect(vars).toContain("offset");
    expect(vars).not.toContain("var");
    expect(vars).not.toContain("let");
  });
});

// ─── Comment handling ─────────────────────────────────────────────────────────

describe("parseAeExpression — comments", () => {
  it("ignores single-line comments", () => {
    const result = parse("// wiggle(2, 30)\nvalue + 10");
    const funcs = titles(result.groups.functions);
    expect(funcs).not.toContain("wiggle");
    expect(titles(result.groups.properties)).toContain("value");
  });

  it("ignores multi-line comments", () => {
    const result = parse("/* loopOut('cycle') */\ntime * 360");
    const funcs = titles(result.groups.functions);
    expect(funcs).not.toContain("loopOut");
    expect(titles(result.groups.properties)).toContain("time");
  });

  it("ignores inline comments after code", () => {
    const result = parse("wiggle(2, 30) // neat effect");
    const vars = titles(result.groups.variables);
    expect(vars).not.toContain("neat");
    expect(vars).not.toContain("effect");
    expect(titles(result.groups.functions)).toContain("wiggle");
  });
});

// ─── Real-world expressions ───────────────────────────────────────────────────

describe("parseAeExpression — real-world AE expressions", () => {
  it("parses bounce expression correctly", () => {
    const result = parse(`amp = 5.0; freq = 2.0; decay = 4.0;
n = 0;
if (numKeys > 0) {
  n = nearestKey(time).index;
  if (key(n).time > time) { n--; }
}
if (n > 0 && t < 1) {
  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);
  value + v*(amp/100)*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);
}
else { value; }`);

    expect(titles(result.groups.functions)).toContain("nearestKey");
    expect(titles(result.groups.functions)).toContain("key");
    expect(titles(result.groups.functions)).toContain("velocityAtTime");
    expect(titles(result.groups.variables)).toContain("amp");
    expect(titles(result.groups.variables)).toContain("freq");
    expect(titles(result.groups.variables)).toContain("decay");
    expect(titles(result.groups.keywords)).toContain("if");
  });

  it("parses effect/layer chain correctly", () => {
    const result = parse(
      'thisComp.layer("Null 1").transform.position',
    );
    expect(titles(result.groups.properties)).toContain("thisComp");
    expect(titles(result.groups.functions)).toContain("layer");
    expect(titles(result.groups.properties)).toContain("transform");
    expect(titles(result.groups.properties)).toContain("position");
  });

  it("parses slider expression", () => {
    const result = parse('effect("Slider Control")("Slider")');
    expect(titles(result.groups.functions)).toContain("effect");
  });

  it("handles standalone loopOut", () => {
    const result = parse('loopOut("cycle")');
    const funcs = titles(result.groups.functions);
    expect(funcs).toContain("loopOut");
    expect(titles(result.groups.variables)).toHaveLength(0);
  });

  it("handles seedRandom + wiggle combo", () => {
    const result = parse("seedRandom(index, true); wiggle(2, 30)");
    const funcs = titles(result.groups.functions);
    expect(funcs).toContain("seedRandom");
    expect(funcs).toContain("wiggle");
  });
});
