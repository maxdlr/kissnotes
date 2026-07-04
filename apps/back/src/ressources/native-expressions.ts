import { NativeExpressionModel } from "@kissnotes/types";

/**
 * After Effects Native Expressions Dictionary
 * Source: Adobe After Effects Expression Language Reference
 * https://helpx.adobe.com/after-effects/using/expression-language-reference.html
 * https://ae-expressions.docsforadobe.dev/
 *
 * ORDERING IS CRITICAL: The parser matches expressions in array order.
 * Function/method expressions (which consume arguments) MUST come before
 * standalone property/attribute expressions. Otherwise a standalone `time`
 * regex would claim `time` inside `nearestKey(time)` before the function
 * regex gets a chance to match the full call.
 *
 * Order: functions > methods > standalone properties/attributes
 *
 * Regex conventions:
 *  - Named capture groups match paramNames exactly.
 *  - Lazy quantifiers (+?) prevent greedy over-consumption.
 *  - \s* tolerates whitespace around parentheses and commas.
 *  - Optional arguments use (?:,\s*(?<name>...))?
 *  - Method calls use lookbehind for '.' to avoid false positives.
 *  - Standalone functions use (?<![\\w.]) lookbehind.
 */

const nativeExpressions: Omit<NativeExpressionModel, "id">[] = [
  // ═══════════════════════════════════════════════
  // STANDALONE FUNCTION CALLS (no dot prefix)
  // These must come first to claim their full range including arguments.
  // ═══════════════════════════════════════════════
  {
    title: "wiggle",
    description:
      "Creates smooth random movement using Perlin noise. Generates organic randomness at a specified frequency (oscillations/sec) and amplitude (max deviation).",
    regex:
      "(?<![\\w.])wiggle\\(\\s*(?:(?<frequency>[^,]+?)(?:,\\s*(?<amplitude>[^,)]+?))?(?:,\\s*(?<octaves>[^,)]+?))?(?:,\\s*(?<amp_mult>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?)?\\s*\\)",
    arguments: "frequency,amplitude,octaves,amp_mult,t",
    code: {
      lines: [
        { number: 1, content: "const frequency = 3;" },
        { number: 2, content: "const amplitude = 50;" },
        { number: 3, content: "wiggle(frequency, amplitude);" },
      ],
    },
  },
  {
    title: "posterizeTime",
    description:
      "Sets the frame rate at which the rest of the expression evaluates, creating a step/hold effect.",
    regex: "(?<![\\w.])posterizeTime\\(\\s*(?<framesPerSecond>[^)]*?)\\s*\\)",
    arguments: "framesPerSecond",
    code: {
      lines: [
        { number: 1, content: "const framesPerSecond = 12;" },
        { number: 2, content: "posterizeTime(framesPerSecond);" },
        { number: 3, content: "wiggle(3, 50);" },
      ],
    },
  },
  {
    title: "comp",
    description:
      "Retrieves a composition from the project by name. Returns a Comp object.",
    regex: "(?<![\\w.])comp\\(\\s*(?<name>[^)]*?)\\s*\\)",
    arguments: "name",
    code: {
      lines: [
        { number: 1, content: "const name = \"Precomp 1\";" },
        { number: 2, content: "comp(name).layer(1).transform.position;" },
      ],
    },
  },
  {
    title: "footage",
    description:
      "Retrieves a footage item from the Project panel by filename.",
    regex: "(?<![\\w.])footage\\(\\s*(?<name>[^)]*?)\\s*\\)",
    arguments: "name",
    code: {
      lines: [
        { number: 1, content: "const name = \"data.json\";" },
        { number: 2, content: "footage(name).sourceData;" },
      ],
    },
  },
  {
    title: "random",
    description:
      "Returns a pseudo-random number. No args: 0–1. One arg: 0 to max. Two args: min to max.",
    regex:
      "(?<![\\w.])random\\(\\s*(?:(?<minValOrArray>[^,)]+?)(?:,\\s*(?<maxValOrArray>[^)]*?))?)?\\s*\\)",
    arguments: "minValOrArray,maxValOrArray",
    code: {
      lines: [
        { number: 1, content: "const minVal = 20;" },
        { number: 2, content: "const maxVal = 80;" },
        { number: 3, content: "random(minVal, maxVal);" },
      ],
    },
  },
  {
    title: "gaussRandom",
    description:
      "Like random() but with Gaussian (bell-curve) distribution.",
    regex:
      "(?<![\\w.])gaussRandom\\(\\s*(?:(?<minValOrArray>[^,)]+?)(?:,\\s*(?<maxValOrArray>[^)]*?))?)?\\s*\\)",
    arguments: "minValOrArray,maxValOrArray",
    code: {
      lines: [
        { number: 1, content: "const minVal = 0;" },
        { number: 2, content: "const maxVal = 100;" },
        { number: 3, content: "gaussRandom(minVal, maxVal);" },
      ],
    },
  },
  {
    title: "seedRandom",
    description:
      "Controls the random seed. Setting timeless=true produces a random value constant over time.",
    regex:
      "(?<![\\w.])seedRandom\\(\\s*(?<offset>[^,)]+?)(?:,\\s*(?<timeless>[^)]*?))?\\s*\\)",
    arguments: "offset,timeless",
    code: {
      lines: [
        { number: 1, content: "// Random changes every frame (default)" },
        { number: 2, content: "seedRandom(index, false);" },
        { number: 3, content: "" },
        { number: 4, content: "// Random stays constant over time" },
        { number: 5, content: "seedRandom(index, true);" },
        { number: 6, content: "random(0, 100);" },
      ],
    },
  },
  {
    title: "noise",
    description:
      "Returns a Perlin noise value between -1 and 1. Smooth and continuous.",
    regex: "(?<![\\w.])noise\\(\\s*(?<valOrArray>[^)]*?)\\s*\\)",
    arguments: "valOrArray",
    code: {
      lines: [
        { number: 1, content: "const valOrArray = time * 2;" },
        { number: 2, content: "noise(valOrArray) * 50;" },
      ],
    },
  },
  {
    title: "linear",
    description:
      "Linear interpolation. Maps t from [tMin, tMax] to [value1, value2]. Clamped.",
    regex:
      "(?<![\\w.])linear\\(\\s*(?:(?<t>[^,]+?)(?:,\\s*(?<tMin>[^,]+?))?(?:,\\s*(?<tMax>[^,)]+?))?(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]*?))?)?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
    code: {
      lines: [
        { number: 1, content: "const startTime = 0;" },
        { number: 2, content: "const endTime = 2;" },
        { number: 3, content: "const startVal = 0;" },
        { number: 4, content: "const endVal = 100;" },
        { number: 5, content: "linear(time, startTime, endTime, startVal, endVal);" },
      ],
    },
  },
  {
    title: "ease",
    description:
      "Like linear() but with smooth cubic ease-in and ease-out at both ends.",
    regex:
      "(?<![\\w.])ease\\(\\s*(?:(?<t>[^,]+?)(?:,\\s*(?<tMin>[^,]+?))?(?:,\\s*(?<tMax>[^,)]+?))?(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]*?))?)?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
    code: {
      lines: [
        { number: 1, content: "const startTime = 0;" },
        { number: 2, content: "const endTime = 1;" },
        { number: 3, content: "const startVal = 0;" },
        { number: 4, content: "const endVal = 100;" },
        { number: 5, content: "ease(time, startTime, endTime, startVal, endVal);" },
      ],
    },
  },
  {
    title: "easeIn",
    description:
      "Smooth ease-in only (slow start, linear exit).",
    regex:
      "(?<![\\w.])easeIn\\(\\s*(?:(?<t>[^,]+?)(?:,\\s*(?<tMin>[^,]+?))?(?:,\\s*(?<tMax>[^,)]+?))?(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]*?))?)?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
    code: {
      lines: [
        { number: 1, content: "const startTime = 0;" },
        { number: 2, content: "const endTime = 1;" },
        { number: 3, content: "const startVal = 0;" },
        { number: 4, content: "const endVal = 100;" },
        { number: 5, content: "easeIn(time, startTime, endTime, startVal, endVal);" },
      ],
    },
  },
  {
    title: "easeOut",
    description:
      "Smooth ease-out only (linear start, slow finish).",
    regex:
      "(?<![\\w.])easeOut\\(\\s*(?:(?<t>[^,]+?)(?:,\\s*(?<tMin>[^,]+?))?(?:,\\s*(?<tMax>[^,)]+?))?(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]*?))?)?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
    code: {
      lines: [
        { number: 1, content: "const startTime = 0;" },
        { number: 2, content: "const endTime = 1;" },
        { number: 3, content: "const startVal = 0;" },
        { number: 4, content: "const endVal = 100;" },
        { number: 5, content: "easeOut(time, startTime, endTime, startVal, endVal);" },
      ],
    },
  },
  {
    title: "add",
    description:
      "Adds two vectors component-by-component.",
    regex: "(?<![\\w.])add\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]*?)\\s*\\)",
    arguments: "vec1,vec2",
    code: {
      lines: [
        { number: 1, content: "const vec1 = [100, 200];" },
        { number: 2, content: "const vec2 = [50, -30];" },
        { number: 3, content: "add(vec1, vec2);" },
      ],
    },
  },
  {
    title: "sub",
    description:
      "Subtracts vec2 from vec1 component-by-component.",
    regex: "(?<![\\w.])sub\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]*?)\\s*\\)",
    arguments: "vec1,vec2",
    code: {
      lines: [
        { number: 1, content: "const vec1 = [500, 400];" },
        { number: 2, content: "const vec2 = [100, 100];" },
        { number: 3, content: "sub(vec1, vec2);" },
      ],
    },
  },
  {
    title: "mul",
    description:
      "Multiplies every component of a vector by a scalar.",
    regex: "(?<![\\w.])mul\\(\\s*(?<vec>[^,]+?),\\s*(?<amount>[^)]*?)\\s*\\)",
    arguments: "vec,amount",
    code: {
      lines: [
        { number: 1, content: "const vec = [100, 200];" },
        { number: 2, content: "const amount = 2;" },
        { number: 3, content: "mul(vec, amount);" },
      ],
    },
  },
  {
    title: "div",
    description:
      "Divides every component of a vector by a scalar.",
    regex: "(?<![\\w.])div\\(\\s*(?<vec>[^,]+?),\\s*(?<amount>[^)]*?)\\s*\\)",
    arguments: "vec,amount",
    code: {
      lines: [
        { number: 1, content: "const vec = [200, 400];" },
        { number: 2, content: "const amount = 2;" },
        { number: 3, content: "div(vec, amount);" },
      ],
    },
  },
  {
    title: "clamp",
    description:
      "Constrains a value within [limit1, limit2].",
    regex:
      "(?<![\\w.])clamp\\(\\s*(?<value>[^,]+?),\\s*(?<limit1>[^,]+?),\\s*(?<limit2>[^)]*?)\\s*\\)",
    arguments: "value,limit1,limit2",
    code: {
      lines: [
        { number: 1, content: "const val = wiggle(2, 100);" },
        { number: 2, content: "const limit1 = 0;" },
        { number: 3, content: "const limit2 = 50;" },
        { number: 4, content: "clamp(val, limit1, limit2);" },
      ],
    },
  },
  {
    title: "dot",
    description:
      "Returns the dot product of two vectors.",
    regex: "(?<![\\w.])dot\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]*?)\\s*\\)",
    arguments: "vec1,vec2",
    code: {
      lines: [
        { number: 1, content: "const vec1 = [1, 0];" },
        { number: 2, content: "const vec2 = [0, 1];" },
        { number: 3, content: "dot(vec1, vec2);" },
      ],
    },
  },
  {
    title: "cross",
    description:
      "Returns the cross product of two 3D vectors.",
    regex: "(?<![\\w.])cross\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]*?)\\s*\\)",
    arguments: "vec1,vec2",
    code: {
      lines: [
        { number: 1, content: "const vec1 = [1, 0, 0];" },
        { number: 2, content: "const vec2 = [0, 1, 0];" },
        { number: 3, content: "cross(vec1, vec2);" },
      ],
    },
  },
  {
    title: "normalize",
    description:
      "Scales a vector to unit length (magnitude 1).",
    regex: "(?<![\\w.])normalize\\(\\s*(?<vec>[^)]*?)\\s*\\)",
    arguments: "vec",
    code: {
      lines: [
        { number: 1, content: "const vec = [3, 4];" },
        { number: 2, content: "normalize(vec);" },
      ],
    },
  },
  {
    title: "length",
    description:
      "Returns the magnitude of a vector, or distance between two points.",
    regex:
      "(?<![\\w.])length\\(\\s*(?<vec_or_point1>[^,)]+?)(?:,\\s*(?<point2>[^)]*?))?\\s*\\)",
    arguments: "vec_or_point1,point2",
    code: {
      lines: [
        { number: 1, content: "const point1 = thisLayer.transform.position;" },
        { number: 2, content: "const point2 = thisComp.layer(\"Target\").transform.position;" },
        { number: 3, content: "length(point1, point2);" },
      ],
    },
  },
  {
    title: "lookAt",
    description:
      "Returns a 3D orientation array pointing from fromPoint toward atPoint.",
    regex:
      "(?<![\\w.])lookAt\\(\\s*(?<fromPoint>[^,]+?),\\s*(?<atPoint>[^)]*?)\\s*\\)",
    arguments: "fromPoint,atPoint",
    code: {
      lines: [
        { number: 1, content: "const fromPoint = thisLayer.transform.position;" },
        { number: 2, content: "const atPoint = thisComp.layer(\"Target\").transform.position;" },
        { number: 3, content: "lookAt(fromPoint, atPoint);" },
      ],
    },
  },
  {
    title: "timeToFrames",
    description:
      "Converts seconds to frame number.",
    regex:
      "(?<![\\w.])timeToFrames\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<fps>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]*?))?)?\\s*\\)",
    arguments: "t,fps,isDuration",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "const fps = 24;" },
        { number: 3, content: "timeToFrames(t, fps);" },
      ],
    },
  },
  {
    title: "framesToTime",
    description:
      "Converts a frame number to seconds.",
    regex:
      "(?<![\\w.])framesToTime\\(\\s*(?<frames>[^,)]+?)(?:,\\s*(?<fps>[^)]*?))?\\s*\\)",
    arguments: "frames,fps",
    code: {
      lines: [
        { number: 1, content: "const frames = 48;" },
        { number: 2, content: "const fps = 24;" },
        { number: 3, content: "framesToTime(frames, fps);" },
      ],
    },
  },
  {
    title: "timeToTimecode",
    description:
      "Converts seconds to a timecode string (HH:MM:SS:FF).",
    regex:
      "(?<![\\w.])timeToTimecode\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<timecodeBase>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]*?))?)?\\s*\\)",
    arguments: "t,timecodeBase,isDuration",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "const timecodeBase = 30;" },
        { number: 3, content: "timeToTimecode(t, timecodeBase);" },
      ],
    },
  },
  {
    title: "timeToNTSCTimecode",
    description:
      "Converts seconds to NTSC timecode string.",
    regex:
      "(?<![\\w.])timeToNTSCTimecode\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<ntscDropFrame>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]*?))?)?\\s*\\)",
    arguments: "t,ntscDropFrame,isDuration",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "const ntscDropFrame = true;" },
        { number: 3, content: "timeToNTSCTimecode(t, ntscDropFrame);" },
      ],
    },
  },
  {
    title: "timeToFeetAndFrames",
    description:
      "Converts seconds to film feet-and-frames string.",
    regex:
      "(?<![\\w.])timeToFeetAndFrames\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<fps>[^,)]+?))?(?:,\\s*(?<framesPerFoot>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]*?))?)?\\s*\\)",
    arguments: "t,fps,framesPerFoot,isDuration",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "const fps = 24;" },
        { number: 3, content: "const framesPerFoot = 16;" },
        { number: 4, content: "timeToFeetAndFrames(t, fps, framesPerFoot);" },
      ],
    },
  },
  {
    title: "timeToCurrentFormat",
    description:
      "Converts seconds to the project's current display format.",
    regex:
      "(?<![\\w.])timeToCurrentFormat\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<fps>[^,)]+?))?(?:,\\s*(?<isDuration>[^,)]+?))?(?:,\\s*(?<ntscDropFrame>[^)]*?))?)?\\s*\\)",
    arguments: "t,fps,isDuration,ntscDropFrame",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "timeToCurrentFormat(t);" },
      ],
    },
  },
  {
    title: "rgbToHsl",
    description:
      "Converts [R,G,B,A] (0–1) to [H,S,L,A].",
    regex: "(?<![\\w.])rgbToHsl\\(\\s*(?<rgbaArray>[^)]*?)\\s*\\)",
    arguments: "rgbaArray",
    code: {
      lines: [
        { number: 1, content: "const rgbaArray = [1, 0, 0, 1];" },
        { number: 2, content: "rgbToHsl(rgbaArray);" },
      ],
    },
  },
  {
    title: "hslToRgb",
    description:
      "Converts [H,S,L,A] (0–1) back to [R,G,B,A].",
    regex: "(?<![\\w.])hslToRgb\\(\\s*(?<hslaArray>[^)]*?)\\s*\\)",
    arguments: "hslaArray",
    code: {
      lines: [
        { number: 1, content: "const hslaArray = [0, 1, 0.5, 1];" },
        { number: 2, content: "hslToRgb(hslaArray);" },
      ],
    },
  },
  {
    title: "hexToRgb",
    description:
      "Converts a hex color string to [R,G,B,A] (0–1).",
    regex: "(?<![\\w.])hexToRgb\\(\\s*(?<hexString>[^)]*?)\\s*\\)",
    arguments: "hexString",
    code: {
      lines: [
        { number: 1, content: "const hexString = \"#FF5733\";" },
        { number: 2, content: "hexToRgb(hexString);" },
      ],
    },
  },
  {
    title: "degreesToRadians",
    description:
      "Converts degrees to radians (×π/180).",
    regex: "(?<![\\w.])degreesToRadians\\(\\s*(?<degrees>[^)]*?)\\s*\\)",
    arguments: "degrees",
    code: {
      lines: [
        { number: 1, content: "const degrees = 90;" },
        { number: 2, content: "degreesToRadians(degrees);" },
      ],
    },
  },
  {
    title: "radiansToDegrees",
    description:
      "Converts radians to degrees (×180/π).",
    regex: "(?<![\\w.])radiansToDegrees\\(\\s*(?<radians>[^)]*?)\\s*\\)",
    arguments: "radians",
    code: {
      lines: [
        { number: 1, content: "const radians = Math.PI;" },
        { number: 2, content: "radiansToDegrees(radians);" },
      ],
    },
  },
  {
    title: "createPath",
    description:
      "Creates a new path Shape from arrays of points, tangents, and isClosed.",
    regex:
      "(?<![\\w.])createPath\\(\\s*(?<points>[^,]+?),\\s*(?<inTangents>[^,]+?),\\s*(?<outTangents>[^,]+?),\\s*(?<isClosed>[^)]*?)\\s*\\)",
    arguments: "points,inTangents,outTangents,isClosed",
    code: {
      lines: [
        { number: 1, content: "const points = [[0, 0], [100, 0], [100, 100]];" },
        { number: 2, content: "const inTangents = [];" },
        { number: 3, content: "const outTangents = [];" },
        { number: 4, content: "const isClosed = true;" },
        { number: 5, content: "createPath(points, inTangents, outTangents, isClosed);" },
      ],
    },
  },

  // Standalone calls that AE allows without a dot prefix
  {
    title: "loopOut",
    description:
      "Loops keyframes after the last keyframe. The most common loop expression.",
    regex: "(?<![\\w.])loopOut\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<numKeyframes>[^)]*?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
    code: {
      lines: [
        { number: 1, content: "// Repeats the keyframe sequence" },
        { number: 2, content: "loopOut(\"cycle\");" },
        { number: 3, content: "" },
        { number: 4, content: "// Continues the last keyframe's velocity" },
        { number: 5, content: "loopOut(\"continue\");" },
        { number: 6, content: "" },
        { number: 7, content: "// Bounces back and forth between keyframes" },
        { number: 8, content: "loopOut(\"pingpong\");" },
      ],
    },
  },
  {
    title: "loopIn",
    description:
      "Loops keyframes before the first keyframe.",
    regex: "(?<![\\w.])loopIn\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<numKeyframes>[^)]*?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
    code: {
      lines: [
        { number: 1, content: "// Repeats the keyframe sequence before first key" },
        { number: 2, content: "loopIn(\"cycle\");" },
        { number: 3, content: "" },
        { number: 4, content: "// Continues the first keyframe's velocity" },
        { number: 5, content: "loopIn(\"continue\");" },
        { number: 6, content: "" },
        { number: 7, content: "// Bounces back and forth" },
        { number: 8, content: "loopIn(\"pingpong\");" },
      ],
    },
  },
  {
    title: "loopOutDuration",
    description:
      "Like loopOut() but uses time duration instead of keyframe count.",
    regex: "(?<![\\w.])loopOutDuration\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<duration>[^)]*?))?)?\\s*\\)",
    arguments: "type,duration",
    code: {
      lines: [
        { number: 1, content: "const type = \"cycle\";" },
        { number: 2, content: "const duration = 2;" },
        { number: 3, content: "loopOutDuration(type, duration);" },
      ],
    },
  },
  {
    title: "loopInDuration",
    description:
      "Like loopIn() but uses time duration instead of keyframe count.",
    regex: "(?<![\\w.])loopInDuration\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<duration>[^)]*?))?)?\\s*\\)",
    arguments: "type,duration",
    code: {
      lines: [
        { number: 1, content: "const type = \"cycle\";" },
        { number: 2, content: "const duration = 2;" },
        { number: 3, content: "loopInDuration(type, duration);" },
      ],
    },
  },
  {
    title: "valueAtTime",
    description:
      "Returns the current property's value at an arbitrary time (standalone call).",
    regex: "(?<![\\w.])valueAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time - 0.5;" },
        { number: 2, content: "valueAtTime(t);" },
      ],
    },
  },
  {
    title: "velocityAtTime",
    description:
      "Returns the rate of change of the current property at time t (standalone call).",
    regex: "(?<![\\w.])velocityAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "velocityAtTime(t);" },
      ],
    },
  },
  {
    title: "speedAtTime",
    description:
      "Returns the scalar speed of the current property at time t (standalone call).",
    regex: "(?<![\\w.])speedAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "speedAtTime(t);" },
      ],
    },
  },
  {
    title: "smooth",
    description:
      "Smooths the current property value over time (standalone call).",
    regex:
      "(?<![\\w.])smooth\\(\\s*(?:(?<width>[^,)]+?)(?:,\\s*(?<samples>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?)?\\s*\\)",
    arguments: "width,samples,t",
    code: {
      lines: [
        { number: 1, content: "const width = 0.2;" },
        { number: 2, content: "const samples = 5;" },
        { number: 3, content: "smooth(width, samples);" },
      ],
    },
  },
  {
    title: "temporalWiggle",
    description:
      "Applies temporal noise to the current property's keyframe data (standalone call).",
    regex:
      "(?<![\\w.])temporalWiggle\\(\\s*(?<frequency>[^,]+?),\\s*(?<amplitude>[^,)]+?)(?:,\\s*(?<octaves>[^,)]+?))?(?:,\\s*(?<amp_mult>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "frequency,amplitude,octaves,amp_mult,t",
    code: {
      lines: [
        { number: 1, content: "const frequency = 2;" },
        { number: 2, content: "const amplitude = 30;" },
        { number: 3, content: "temporalWiggle(frequency, amplitude);" },
      ],
    },
  },
  {
    title: "nearestKey",
    description:
      "Returns the nearest keyframe to time t (standalone call).",
    regex: "(?<![\\w.])nearestKey\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "nearestKey(t).time;" },
      ],
    },
  },
  {
    title: "key",
    description:
      "Returns the Key object at the given index (standalone call).",
    regex: "(?<![\\w.])key\\(\\s*(?<indexOrName>[^)]*?)\\s*\\)",
    arguments: "indexOrName",
    code: {
      lines: [
        { number: 1, content: "const indexOrName = 1;" },
        { number: 2, content: "key(indexOrName).value;" },
      ],
    },
  },
  {
    title: "effect",
    description:
      "Accesses an effect on the current layer by name or index (standalone call).",
    regex: "(?<![\\w.])effect\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
    code: {
      lines: [
        { number: 1, content: "const nameOrIndex = \"Gaussian Blur\";" },
        { number: 2, content: "effect(nameOrIndex)(\"Blurriness\");" },
      ],
    },
  },
  {
    title: "content",
    description:
      "Accesses a shape group/property (standalone call on shape layers).",
    regex: "(?<![\\w.])content\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
    code: {
      lines: [
        { number: 1, content: "const nameOrIndex = \"Rectangle 1\";" },
        { number: 2, content: "content(nameOrIndex).transform.position;" },
      ],
    },
  },
  {
    title: "mask",
    description:
      "Accesses a mask on the current layer (standalone call).",
    regex: "(?<![\\w.])mask\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
    code: {
      lines: [
        { number: 1, content: "const nameOrIndex = \"Mask 1\";" },
        { number: 2, content: "mask(nameOrIndex).maskPath;" },
      ],
    },
  },
  {
    title: "sourceRectAtTime",
    description:
      "Returns {top, left, width, height} of the current layer's content (standalone call).",
    regex:
      "(?<![\\w.])sourceRectAtTime\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<includeExtents>[^)]*?))?)?\\s*\\)",
    arguments: "t,includeExtents",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "const includeExtents = true;" },
        { number: 3, content: "const rect = sourceRectAtTime(t, includeExtents);" },
        { number: 4, content: "[rect.width, rect.height];" },
      ],
    },
  },

  // ═══════════════════════════════════════════════
  // METHOD CALLS (preceded by a dot)
  // ═══════════════════════════════════════════════
  {
    title: "valueAtTime",
    description:
      "Returns the property's value at any arbitrary time.",
    regex: "\\.valueAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time - 1;" },
        { number: 2, content: "thisProperty.valueAtTime(t);" },
      ],
    },
  },
  {
    title: "velocityAtTime",
    description:
      "Returns the rate of change of the property at time t.",
    regex: "\\.velocityAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "thisProperty.velocityAtTime(t);" },
      ],
    },
  },
  {
    title: "speedAtTime",
    description:
      "Returns the scalar speed of the property at time t.",
    regex: "\\.speedAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "thisProperty.speedAtTime(t);" },
      ],
    },
  },
  {
    title: "smooth",
    description:
      "Smooths the property's value over time.",
    regex:
      "\\.smooth\\(\\s*(?:(?<width>[^,)]+?)(?:,\\s*(?<samples>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?)?\\s*\\)",
    arguments: "width,samples,t",
    code: {
      lines: [
        { number: 1, content: "const width = 0.1;" },
        { number: 2, content: "const samples = 5;" },
        { number: 3, content: "thisProperty.smooth(width, samples);" },
      ],
    },
  },
  {
    title: "temporalWiggle",
    description:
      "Applies temporal noise to the property's keyframe data.",
    regex:
      "\\.temporalWiggle\\(\\s*(?<frequency>[^,]+?),\\s*(?<amplitude>[^,)]+?)(?:,\\s*(?<octaves>[^,)]+?))?(?:,\\s*(?<amp_mult>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "frequency,amplitude,octaves,amp_mult,t",
    code: {
      lines: [
        { number: 1, content: "const frequency = 3;" },
        { number: 2, content: "const amplitude = 20;" },
        { number: 3, content: "thisProperty.temporalWiggle(frequency, amplitude);" },
      ],
    },
  },
  {
    title: "loopIn",
    description:
      "Loops keyframes before the first keyframe (method call).",
    regex:
      "\\.loopIn\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<numKeyframes>[^)]*?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
    code: {
      lines: [
        { number: 1, content: "// Repeats keyframes before first key" },
        { number: 2, content: "thisProperty.loopIn(\"cycle\");" },
        { number: 3, content: "" },
        { number: 4, content: "// Bounces back and forth" },
        { number: 5, content: "thisProperty.loopIn(\"pingpong\");" },
      ],
    },
  },
  {
    title: "loopOut",
    description:
      "Loops keyframes after the last keyframe (method call).",
    regex:
      "\\.loopOut\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<numKeyframes>[^)]*?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
    code: {
      lines: [
        { number: 1, content: "// Repeats keyframes after last key" },
        { number: 2, content: "thisProperty.loopOut(\"cycle\");" },
        { number: 3, content: "" },
        { number: 4, content: "// Continues the last keyframe's velocity" },
        { number: 5, content: "thisProperty.loopOut(\"continue\");" },
      ],
    },
  },
  {
    title: "loopInDuration",
    description:
      "Like loopIn() but uses time duration (method call).",
    regex:
      "\\.loopInDuration\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<duration>[^)]*?))?)?\\s*\\)",
    arguments: "type,duration",
    code: {
      lines: [
        { number: 1, content: "const type = \"cycle\";" },
        { number: 2, content: "const duration = 1.5;" },
        { number: 3, content: "thisProperty.loopInDuration(type, duration);" },
      ],
    },
  },
  {
    title: "loopOutDuration",
    description:
      "Like loopOut() but uses time duration (method call).",
    regex:
      "\\.loopOutDuration\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<duration>[^)]*?))?)?\\s*\\)",
    arguments: "type,duration",
    code: {
      lines: [
        { number: 1, content: "const type = \"cycle\";" },
        { number: 2, content: "const duration = 3;" },
        { number: 3, content: "thisProperty.loopOutDuration(type, duration);" },
      ],
    },
  },
  {
    title: "key",
    description:
      "Returns a Key object for the keyframe at the given index.",
    regex: "\\.key\\(\\s*(?<indexOrName>[^)]*?)\\s*\\)",
    arguments: "indexOrName",
    code: {
      lines: [
        { number: 1, content: "const indexOrName = 1;" },
        { number: 2, content: "thisProperty.key(indexOrName).time;" },
      ],
    },
  },
  {
    title: "nearestKey",
    description:
      "Returns the Key object closest in time to t.",
    regex: "\\.nearestKey\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "thisProperty.nearestKey(t).index;" },
      ],
    },
  },
  {
    title: "previousKey",
    description:
      "Returns the Key object immediately before time t. (AE 26.0+)",
    regex: "\\.previousKey\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "thisProperty.previousKey(t).value;" },
      ],
    },
  },
  {
    title: "nextKey",
    description:
      "Returns the Key object immediately after time t. (AE 26.0+)",
    regex: "\\.nextKey\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "thisProperty.nextKey(t).value;" },
      ],
    },
  },
  {
    title: "sourceRectAtTime",
    description:
      "Returns {top, left, width, height} of the layer's content bounding box.",
    regex:
      "\\.sourceRectAtTime\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<includeExtents>[^)]*?))?)?\\s*\\)",
    arguments: "t,includeExtents",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "const rect = thisLayer.sourceRectAtTime(t, true);" },
        { number: 3, content: "[rect.width, rect.height];" },
      ],
    },
  },
  {
    title: "sourceTime",
    description:
      "Returns the source footage time for time-remapped layers.",
    regex: "\\.sourceTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "thisLayer.sourceTime(t);" },
      ],
    },
  },
  {
    title: "sampleImage",
    description:
      "Samples RGBA color at a point in the layer's coordinate space.",
    regex:
      "\\.sampleImage\\(\\s*(?<point>[^,]+?),\\s*(?<radius>[^,)]+?)(?:,\\s*(?<postEffect>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,radius,postEffect,t",
    code: {
      lines: [
        { number: 1, content: "const point = [960, 540];" },
        { number: 2, content: "const radius = [5, 5];" },
        { number: 3, content: "thisLayer.sampleImage(point, radius);" },
      ],
    },
  },
  {
    title: "effect",
    description:
      "Accesses an effect on a layer by name or index.",
    regex: "\\.effect\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
    code: {
      lines: [
        { number: 1, content: "const nameOrIndex = \"Fill\";" },
        { number: 2, content: "thisLayer.effect(nameOrIndex)(\"Color\");" },
      ],
    },
  },
  {
    title: "mask",
    description:
      "Accesses a mask on a layer by name or index.",
    regex: "\\.mask\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
    code: {
      lines: [
        { number: 1, content: "const nameOrIndex = \"Mask 1\";" },
        { number: 2, content: "thisLayer.mask(nameOrIndex).maskPath;" },
      ],
    },
  },
  {
    title: "content",
    description:
      "Accesses a shape group/property within a shape layer.",
    regex: "\\.content\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
    code: {
      lines: [
        { number: 1, content: "const nameOrIndex = \"Ellipse 1\";" },
        { number: 2, content: "thisLayer.content(nameOrIndex).transform.scale;" },
      ],
    },
  },
  {
    title: "layer",
    description:
      "Retrieves a layer from the composition by name or index.",
    regex: "\\.layer\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
    code: {
      lines: [
        { number: 1, content: "const nameOrIndex = \"Controller\";" },
        { number: 2, content: "thisComp.layer(nameOrIndex).transform.position;" },
      ],
    },
  },
  {
    title: "toComp",
    description:
      "Transforms a point from layer-local to comp space.",
    regex: "\\.toComp\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
    code: {
      lines: [
        { number: 1, content: "const point = [0, 0];" },
        { number: 2, content: "thisLayer.toComp(point);" },
      ],
    },
  },
  {
    title: "fromComp",
    description:
      "Transforms a point from comp to layer-local space.",
    regex: "\\.fromComp\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
    code: {
      lines: [
        { number: 1, content: "const point = [960, 540];" },
        { number: 2, content: "thisLayer.fromComp(point);" },
      ],
    },
  },
  {
    title: "toWorld",
    description:
      "Transforms a point from layer-local to 3D world space.",
    regex: "\\.toWorld\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
    code: {
      lines: [
        { number: 1, content: "const point = [0, 0, 0];" },
        { number: 2, content: "thisLayer.toWorld(point);" },
      ],
    },
  },
  {
    title: "fromWorld",
    description:
      "Transforms a point from 3D world space to layer-local.",
    regex: "\\.fromWorld\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
    code: {
      lines: [
        { number: 1, content: "const point = [500, 300, 0];" },
        { number: 2, content: "thisLayer.fromWorld(point);" },
      ],
    },
  },
  {
    title: "toCompVec",
    description:
      "Transforms a direction vector from layer-local to comp space.",
    regex: "\\.toCompVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "vec,t",
    code: {
      lines: [
        { number: 1, content: "const vec = [1, 0];" },
        { number: 2, content: "thisLayer.toCompVec(vec);" },
      ],
    },
  },
  {
    title: "fromCompVec",
    description:
      "Transforms a direction vector from comp to layer-local space.",
    regex: "\\.fromCompVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "vec,t",
    code: {
      lines: [
        { number: 1, content: "const vec = [0, 1];" },
        { number: 2, content: "thisLayer.fromCompVec(vec);" },
      ],
    },
  },
  {
    title: "toWorldVec",
    description:
      "Transforms a direction vector from layer-local to world space.",
    regex: "\\.toWorldVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "vec,t",
    code: {
      lines: [
        { number: 1, content: "const vec = [0, 0, 1];" },
        { number: 2, content: "thisLayer.toWorldVec(vec);" },
      ],
    },
  },
  {
    title: "fromWorldVec",
    description:
      "Transforms a direction vector from world to layer-local space.",
    regex: "\\.fromWorldVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "vec,t",
    code: {
      lines: [
        { number: 1, content: "const vec = [1, 0, 0];" },
        { number: 2, content: "thisLayer.fromWorldVec(vec);" },
      ],
    },
  },
  {
    title: "fromCompToSurface",
    description:
      "Projects a comp-space point onto the surface of a 3D layer.",
    regex:
      "\\.fromCompToSurface\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
    code: {
      lines: [
        { number: 1, content: "const point = [960, 540];" },
        { number: 2, content: "thisLayer.fromCompToSurface(point);" },
      ],
    },
  },
  {
    title: "propertyGroup",
    description:
      "Navigates up the property hierarchy by countUp levels.",
    regex: "\\.propertyGroup\\(\\s*(?<countUp>[^)]*?)\\s*\\)",
    arguments: "countUp",
    code: {
      lines: [
        { number: 1, content: "const countUp = 1;" },
        { number: 2, content: "thisProperty.propertyGroup(countUp).name;" },
      ],
    },
  },
  {
    title: "points",
    description:
      "Returns an array of vertex points from a path.",
    regex: "\\.points\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "thisProperty.points(t);" },
      ],
    },
  },
  {
    title: "inTangents",
    description:
      "Returns incoming tangent vectors for each path vertex.",
    regex: "\\.inTangents\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "thisProperty.inTangents(t);" },
      ],
    },
  },
  {
    title: "outTangents",
    description:
      "Returns outgoing tangent vectors for each path vertex.",
    regex: "\\.outTangents\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
    code: {
      lines: [
        { number: 1, content: "const t = time;" },
        { number: 2, content: "thisProperty.outTangents(t);" },
      ],
    },
  },
  {
    title: "isClosed",
    description:
      "Returns true if the path is closed.",
    regex: "\\.isClosed\\(\\s*\\)",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisProperty.isClosed();" },
      ],
    },
  },
  {
    title: "pointOnPath",
    description:
      "Returns the [x,y] point at a percentage (0–1) along a path.",
    regex:
      "\\.pointOnPath\\(\\s*(?<percentage>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "percentage,t",
    code: {
      lines: [
        { number: 1, content: "const percentage = 0.5;" },
        { number: 2, content: "thisProperty.pointOnPath(percentage);" },
      ],
    },
  },
  {
    title: "tangentOnPath",
    description:
      "Returns the tangent direction at a percentage along a path.",
    regex:
      "\\.tangentOnPath\\(\\s*(?<percentage>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "percentage,t",
    code: {
      lines: [
        { number: 1, content: "const percentage = 0.5;" },
        { number: 2, content: "thisProperty.tangentOnPath(percentage);" },
      ],
    },
  },
  {
    title: "normalOnPath",
    description:
      "Returns the normal direction at a percentage along a path.",
    regex:
      "\\.normalOnPath\\(\\s*(?<percentage>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "percentage,t",
    code: {
      lines: [
        { number: 1, content: "const percentage = 0.75;" },
        { number: 2, content: "thisProperty.normalOnPath(percentage);" },
      ],
    },
  },

  // ═══════════════════════════════════════════════
  // DOT-ACCESSED PROPERTIES (no parens)
  // These come LAST so they don't steal content from function calls above.
  // ═══════════════════════════════════════════════
  {
    title: "transform",
    description:
      "The Transform property group (position, scale, rotation, opacity, anchorPoint).",
    regex: "\\.transform(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Shape\").transform.position;" },
      ],
    },
  },
  {
    title: "position",
    description:
      "The layer's position [x, y] or [x, y, z].",
    regex: "\\.position(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Follow another layer's X, keep own Y" },
        { number: 2, content: "const target = thisComp.layer(\"Controller\");" },
        { number: 3, content: "[target.transform.position[0], value[1]];" },
      ],
    },
  },
  {
    title: "anchorPoint",
    description:
      "The layer's anchor point (pivot).",
    regex: "\\.anchorPoint(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.transform.anchorPoint;" },
      ],
    },
  },
  {
    title: "scale",
    description:
      "The layer's scale [x%, y%] or [x%, y%, z%].",
    regex: "\\.scale(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Target\").transform.scale;" },
      ],
    },
  },
  {
    title: "rotation",
    description:
      "The layer's rotation in degrees.",
    regex: "\\.rotation(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.transform.rotation + time * 45;" },
      ],
    },
  },
  {
    title: "opacity",
    description:
      "The layer's opacity (0–100).",
    regex: "\\.opacity(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.transform.opacity / 100;" },
      ],
    },
  },
  {
    title: "xRotation",
    description: "X-axis rotation in degrees (3D layers).",
    regex: "\\.xRotation(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.transform.xRotation;" },
      ],
    },
  },
  {
    title: "yRotation",
    description: "Y-axis rotation in degrees (3D layers).",
    regex: "\\.yRotation(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.transform.yRotation;" },
      ],
    },
  },
  {
    title: "zRotation",
    description: "Z-axis rotation in degrees (3D layers).",
    regex: "\\.zRotation(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.transform.zRotation;" },
      ],
    },
  },
  {
    title: "orientation",
    description:
      "3D orientation [x, y, z] degrees.",
    regex: "\\.orientation(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.transform.orientation;" },
      ],
    },
  },
  {
    title: "pointOfInterest",
    description:
      "Camera/light point of interest in 3D space.",
    regex: "\\.pointOfInterest(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.activeCamera.pointOfInterest;" },
      ],
    },
  },
  {
    title: "text.sourceText",
    description:
      "The source text content of a text layer.",
    regex: "\\.text\\.sourceText(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Title\").text.sourceText;" },
      ],
    },
  },
  {
    title: "zoom",
    description: "Camera zoom (focal length) in pixels.",
    regex: "\\.zoom(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.activeCamera.zoom;" },
      ],
    },
  },
  {
    title: "depthOfField",
    description: "Whether DOF is enabled on the camera.",
    regex: "\\.depthOfField(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.activeCamera.depthOfField;" },
      ],
    },
  },
  {
    title: "focusDistance",
    description: "Camera focus distance in pixels.",
    regex: "\\.focusDistance(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.activeCamera.focusDistance;" },
      ],
    },
  },
  {
    title: "aperture",
    description: "Camera aperture in pixels.",
    regex: "\\.aperture(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.activeCamera.aperture;" },
      ],
    },
  },
  {
    title: "blurLevel",
    description: "Camera blur level percentage.",
    regex: "\\.blurLevel(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.activeCamera.blurLevel;" },
      ],
    },
  },
  {
    title: "intensity",
    description: "Light intensity (0–100+).",
    regex: "\\.intensity(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Spot Light\").intensity;" },
      ],
    },
  },
  {
    title: "color",
    description: "Light color [R, G, B, A] (0–1).",
    regex: "\\.color(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Point Light\").color;" },
      ],
    },
  },
  {
    title: "coneAngle",
    description: "Spot light cone angle in degrees.",
    regex: "\\.coneAngle(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Spot Light\").coneAngle;" },
      ],
    },
  },
  {
    title: "coneFeather",
    description: "Spot light cone feather percentage.",
    regex: "\\.coneFeather(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Spot Light\").coneFeather;" },
      ],
    },
  },
  {
    title: "shadowDarkness",
    description: "Shadow darkness (0–100%).",
    regex: "\\.shadowDarkness(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Spot Light\").shadowDarkness;" },
      ],
    },
  },
  {
    title: "shadowDiffusion",
    description: "Shadow diffusion/softness.",
    regex: "\\.shadowDiffusion(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Spot Light\").shadowDiffusion;" },
      ],
    },
  },
  {
    title: "maskPath",
    description: "The path shape of a mask.",
    regex: "\\.maskPath(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.mask(\"Mask 1\").maskPath;" },
      ],
    },
  },
  {
    title: "maskFeather",
    description: "Mask feather amount in pixels.",
    regex: "\\.maskFeather(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.mask(\"Mask 1\").maskFeather;" },
      ],
    },
  },
  {
    title: "maskOpacity",
    description: "Mask opacity (0–100%).",
    regex: "\\.maskOpacity(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.mask(\"Mask 1\").maskOpacity;" },
      ],
    },
  },
  {
    title: "maskExpansion",
    description: "Mask expansion/contraction in pixels.",
    regex: "\\.maskExpansion(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.mask(\"Mask 1\").maskExpansion;" },
      ],
    },
  },
  {
    title: "path",
    description: "Shape/mask path property.",
    regex: "\\.path(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.content(\"Shape 1\").content(\"Path 1\").path;" },
      ],
    },
  },
  {
    title: "sourceData",
    description: "Parsed JSON data from a JSON footage item.",
    regex: "\\.sourceData(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "footage(\"data.json\").sourceData;" },
      ],
    },
  },
  {
    title: "source",
    description: "The source Comp or Footage of a layer.",
    regex: "\\.source(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.source.name;" },
      ],
    },
  },
  {
    title: "propertyIndex",
    description: "1-based index of the property within its parent group.",
    regex: "\\.propertyIndex(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisProperty.propertyIndex;" },
      ],
    },
  },
  {
    title: "activeCamera",
    description:
      "The camera currently rendering the composition.",
    regex: "\\.activeCamera(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.activeCamera.zoom;" },
      ],
    },
  },
  {
    title: "marker",
    description:
      "Composition or layer marker property.",
    regex: "\\.marker(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.marker.key(1).time;" },
      ],
    },
  },
  {
    title: "name",
    description: "The name of the layer or property.",
    regex: "\\.name(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.name;" },
      ],
    },
  },
  {
    title: "width",
    description: "Width of the comp or layer in pixels.",
    regex: "\\.width(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.width / 2;" },
      ],
    },
  },
  {
    title: "height",
    description: "Height of the comp or layer in pixels.",
    regex: "\\.height(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.height / 2;" },
      ],
    },
  },
  {
    title: "duration",
    description: "Duration of the comp in seconds.",
    regex: "\\.duration(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.duration;" },
      ],
    },
  },
  {
    title: "active",
    description: "Whether the layer is active at the current time.",
    regex: "\\.active(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Target\").active;" },
      ],
    },
  },
  {
    title: "enabled",
    description: "Whether the layer's video switch is on.",
    regex: "\\.enabled(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Background\").enabled;" },
      ],
    },
  },

  // ═══════════════════════════════════════════════
  // GLOBAL STANDALONE PROPERTIES (no dot prefix)
  // These come LAST because they are short tokens that could match
  // inside function arguments if placed earlier.
  // ═══════════════════════════════════════════════
  {
    title: "time",
    description:
      "Current composition time in seconds.",
    regex: "(?<![\\w.])time(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Rotates 90 degrees per second" },
        { number: 2, content: "const speed = 90;" },
        { number: 3, content: "time * speed;" },
      ],
    },
  },
  {
    title: "value",
    description:
      "Current value of the property the expression is on.",
    regex: "(?<![\\w.])value(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Add wiggle on top of existing keyframes" },
        { number: 2, content: "value + wiggle(2, 25);" },
      ],
    },
  },
  {
    title: "thisComp",
    description:
      "Reference to the composition containing this expression.",
    regex: "(?<![\\w.])thisComp(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.layer(\"Controller\").transform.position;" },
      ],
    },
  },
  {
    title: "thisLayer",
    description:
      "Reference to the layer this expression is on.",
    regex: "(?<![\\w.])thisLayer(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisLayer.transform.scale;" },
      ],
    },
  },
  {
    title: "thisProperty",
    description:
      "Reference to the property this expression is on.",
    regex: "(?<![\\w.])thisProperty(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisProperty.numKeys;" },
      ],
    },
  },
  {
    title: "index",
    description:
      "1-based layer index in the comp stack.",
    regex: "(?<![\\w.])index(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Offset position based on layer stack order" },
        { number: 2, content: "value + [index * 50, 0];" },
      ],
    },
  },
  {
    title: "numKeys",
    description:
      "Number of keyframes on this property.",
    regex: "(?<![\\w.])numKeys(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Get the last keyframe value" },
        { number: 2, content: "key(numKeys).value;" },
      ],
    },
  },
  {
    title: "numLayers",
    description:
      "Total number of layers in the composition.",
    regex: "(?<![\\w.])numLayers(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "thisComp.numLayers;" },
      ],
    },
  },
  {
    title: "inPoint",
    description:
      "Time (seconds) when the layer becomes visible.",
    regex: "(?<![\\w.])inPoint(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Fade in over 0.5s from layer start" },
        { number: 2, content: "linear(time, inPoint, inPoint + 0.5, 0, 100);" },
      ],
    },
  },
  {
    title: "outPoint",
    description:
      "Time (seconds) when the layer becomes invisible.",
    regex: "(?<![\\w.])outPoint(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Fade out over 0.5s before layer end" },
        { number: 2, content: "linear(time, outPoint - 0.5, outPoint, 100, 0);" },
      ],
    },
  },
  {
    title: "startTime",
    description:
      "Time where the layer's first frame sits in the timeline.",
    regex: "(?<![\\w.])startTime(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Time since layer started" },
        { number: 2, content: "time - startTime;" },
      ],
    },
  },
  {
    title: "hasParent",
    description:
      "True if the layer has a parent assigned.",
    regex: "(?<![\\w.])hasParent(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Only use parent position if parented" },
        { number: 2, content: "hasParent ? parent.transform.position : [0, 0];" },
      ],
    },
  },
  {
    title: "parent",
    description:
      "The parent Layer object.",
    regex: "(?<![\\w.])parent(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "parent.transform.rotation;" },
      ],
    },
  },
  {
    title: "frameDuration",
    description:
      "Duration of one frame in seconds (1/fps).",
    regex: "(?<![\\w.])frameDuration(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Delay by 5 frames" },
        { number: 2, content: "const delay = frameDuration * 5;" },
        { number: 3, content: "valueAtTime(time - delay);" },
      ],
    },
  },
  {
    title: "colorDepth",
    description:
      "Project color depth: 8, 16, or 32 bits.",
    regex: "(?<![\\w.])colorDepth(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "colorDepth;" },
      ],
    },
  },
  {
    title: "textIndex",
    description:
      "1-based index of the current character in a text animator.",
    regex: "(?<![\\w.])textIndex(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Stagger animation per character" },
        { number: 2, content: "const delay = textIndex * 0.05;" },
        { number: 3, content: "time - delay;" },
      ],
    },
  },
  {
    title: "textTotal",
    description:
      "Total character count in a text animator.",
    regex: "(?<![\\w.])textTotal(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Normalize character index to 0–1 range" },
        { number: 2, content: "textIndex / textTotal;" },
      ],
    },
  },
  {
    title: "selectorValue",
    description:
      "Current selector value (0–100) in a text animator.",
    regex: "(?<![\\w.])selectorValue(?![\\w(])",
    arguments: "",
    code: {
      lines: [
        { number: 1, content: "// Use selector to drive opacity" },
        { number: 2, content: "selectorValue;" },
      ],
    },
  },
];

export default nativeExpressions;
