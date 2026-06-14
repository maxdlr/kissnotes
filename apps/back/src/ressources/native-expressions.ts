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
  },
  {
    title: "posterizeTime",
    description:
      "Sets the frame rate at which the rest of the expression evaluates, creating a step/hold effect.",
    regex: "(?<![\\w.])posterizeTime\\(\\s*(?<framesPerSecond>[^)]*?)\\s*\\)",
    arguments: "framesPerSecond",
  },
  {
    title: "comp",
    description:
      "Retrieves a composition from the project by name. Returns a Comp object.",
    regex: "(?<![\\w.])comp\\(\\s*(?<name>[^)]*?)\\s*\\)",
    arguments: "name",
  },
  {
    title: "footage",
    description:
      "Retrieves a footage item from the Project panel by filename.",
    regex: "(?<![\\w.])footage\\(\\s*(?<name>[^)]*?)\\s*\\)",
    arguments: "name",
  },
  {
    title: "random",
    description:
      "Returns a pseudo-random number. No args: 0–1. One arg: 0 to max. Two args: min to max.",
    regex:
      "(?<![\\w.])random\\(\\s*(?:(?<minValOrArray>[^,)]+?)(?:,\\s*(?<maxValOrArray>[^)]*?))?)?\\s*\\)",
    arguments: "minValOrArray,maxValOrArray",
  },
  {
    title: "gaussRandom",
    description:
      "Like random() but with Gaussian (bell-curve) distribution.",
    regex:
      "(?<![\\w.])gaussRandom\\(\\s*(?:(?<minValOrArray>[^,)]+?)(?:,\\s*(?<maxValOrArray>[^)]*?))?)?\\s*\\)",
    arguments: "minValOrArray,maxValOrArray",
  },
  {
    title: "seedRandom",
    description:
      "Controls the random seed. Setting timeless=true produces a random value constant over time.",
    regex:
      "(?<![\\w.])seedRandom\\(\\s*(?<offset>[^,)]+?)(?:,\\s*(?<timeless>[^)]*?))?\\s*\\)",
    arguments: "offset,timeless",
  },
  {
    title: "noise",
    description:
      "Returns a Perlin noise value between -1 and 1. Smooth and continuous.",
    regex: "(?<![\\w.])noise\\(\\s*(?<valOrArray>[^)]*?)\\s*\\)",
    arguments: "valOrArray",
  },
  {
    title: "linear",
    description:
      "Linear interpolation. Maps t from [tMin, tMax] to [value1, value2]. Clamped.",
    regex:
      "(?<![\\w.])linear\\(\\s*(?:(?<t>[^,]+?)(?:,\\s*(?<tMin>[^,]+?))?(?:,\\s*(?<tMax>[^,)]+?))?(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]*?))?)?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
  },
  {
    title: "ease",
    description:
      "Like linear() but with smooth cubic ease-in and ease-out at both ends.",
    regex:
      "(?<![\\w.])ease\\(\\s*(?:(?<t>[^,]+?)(?:,\\s*(?<tMin>[^,]+?))?(?:,\\s*(?<tMax>[^,)]+?))?(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]*?))?)?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
  },
  {
    title: "easeIn",
    description:
      "Smooth ease-in only (slow start, linear exit).",
    regex:
      "(?<![\\w.])easeIn\\(\\s*(?:(?<t>[^,]+?)(?:,\\s*(?<tMin>[^,]+?))?(?:,\\s*(?<tMax>[^,)]+?))?(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]*?))?)?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
  },
  {
    title: "easeOut",
    description:
      "Smooth ease-out only (linear start, slow finish).",
    regex:
      "(?<![\\w.])easeOut\\(\\s*(?:(?<t>[^,]+?)(?:,\\s*(?<tMin>[^,]+?))?(?:,\\s*(?<tMax>[^,)]+?))?(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]*?))?)?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
  },
  {
    title: "add",
    description:
      "Adds two vectors component-by-component.",
    regex: "(?<![\\w.])add\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]*?)\\s*\\)",
    arguments: "vec1,vec2",
  },
  {
    title: "sub",
    description:
      "Subtracts vec2 from vec1 component-by-component.",
    regex: "(?<![\\w.])sub\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]*?)\\s*\\)",
    arguments: "vec1,vec2",
  },
  {
    title: "mul",
    description:
      "Multiplies every component of a vector by a scalar.",
    regex: "(?<![\\w.])mul\\(\\s*(?<vec>[^,]+?),\\s*(?<amount>[^)]*?)\\s*\\)",
    arguments: "vec,amount",
  },
  {
    title: "div",
    description:
      "Divides every component of a vector by a scalar.",
    regex: "(?<![\\w.])div\\(\\s*(?<vec>[^,]+?),\\s*(?<amount>[^)]*?)\\s*\\)",
    arguments: "vec,amount",
  },
  {
    title: "clamp",
    description:
      "Constrains a value within [limit1, limit2].",
    regex:
      "(?<![\\w.])clamp\\(\\s*(?<value>[^,]+?),\\s*(?<limit1>[^,]+?),\\s*(?<limit2>[^)]*?)\\s*\\)",
    arguments: "value,limit1,limit2",
  },
  {
    title: "dot",
    description:
      "Returns the dot product of two vectors.",
    regex: "(?<![\\w.])dot\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]*?)\\s*\\)",
    arguments: "vec1,vec2",
  },
  {
    title: "cross",
    description:
      "Returns the cross product of two 3D vectors.",
    regex: "(?<![\\w.])cross\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]*?)\\s*\\)",
    arguments: "vec1,vec2",
  },
  {
    title: "normalize",
    description:
      "Scales a vector to unit length (magnitude 1).",
    regex: "(?<![\\w.])normalize\\(\\s*(?<vec>[^)]*?)\\s*\\)",
    arguments: "vec",
  },
  {
    title: "length",
    description:
      "Returns the magnitude of a vector, or distance between two points.",
    regex:
      "(?<![\\w.])length\\(\\s*(?<vec_or_point1>[^,)]+?)(?:,\\s*(?<point2>[^)]*?))?\\s*\\)",
    arguments: "vec_or_point1,point2",
  },
  {
    title: "lookAt",
    description:
      "Returns a 3D orientation array pointing from fromPoint toward atPoint.",
    regex:
      "(?<![\\w.])lookAt\\(\\s*(?<fromPoint>[^,]+?),\\s*(?<atPoint>[^)]*?)\\s*\\)",
    arguments: "fromPoint,atPoint",
  },
  {
    title: "timeToFrames",
    description:
      "Converts seconds to frame number.",
    regex:
      "(?<![\\w.])timeToFrames\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<fps>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]*?))?)?\\s*\\)",
    arguments: "t,fps,isDuration",
  },
  {
    title: "framesToTime",
    description:
      "Converts a frame number to seconds.",
    regex:
      "(?<![\\w.])framesToTime\\(\\s*(?<frames>[^,)]+?)(?:,\\s*(?<fps>[^)]*?))?\\s*\\)",
    arguments: "frames,fps",
  },
  {
    title: "timeToTimecode",
    description:
      "Converts seconds to a timecode string (HH:MM:SS:FF).",
    regex:
      "(?<![\\w.])timeToTimecode\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<timecodeBase>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]*?))?)?\\s*\\)",
    arguments: "t,timecodeBase,isDuration",
  },
  {
    title: "timeToNTSCTimecode",
    description:
      "Converts seconds to NTSC timecode string.",
    regex:
      "(?<![\\w.])timeToNTSCTimecode\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<ntscDropFrame>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]*?))?)?\\s*\\)",
    arguments: "t,ntscDropFrame,isDuration",
  },
  {
    title: "timeToFeetAndFrames",
    description:
      "Converts seconds to film feet-and-frames string.",
    regex:
      "(?<![\\w.])timeToFeetAndFrames\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<fps>[^,)]+?))?(?:,\\s*(?<framesPerFoot>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]*?))?)?\\s*\\)",
    arguments: "t,fps,framesPerFoot,isDuration",
  },
  {
    title: "timeToCurrentFormat",
    description:
      "Converts seconds to the project's current display format.",
    regex:
      "(?<![\\w.])timeToCurrentFormat\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<fps>[^,)]+?))?(?:,\\s*(?<isDuration>[^,)]+?))?(?:,\\s*(?<ntscDropFrame>[^)]*?))?)?\\s*\\)",
    arguments: "t,fps,isDuration,ntscDropFrame",
  },
  {
    title: "rgbToHsl",
    description:
      "Converts [R,G,B,A] (0–1) to [H,S,L,A].",
    regex: "(?<![\\w.])rgbToHsl\\(\\s*(?<rgbaArray>[^)]*?)\\s*\\)",
    arguments: "rgbaArray",
  },
  {
    title: "hslToRgb",
    description:
      "Converts [H,S,L,A] (0–1) back to [R,G,B,A].",
    regex: "(?<![\\w.])hslToRgb\\(\\s*(?<hslaArray>[^)]*?)\\s*\\)",
    arguments: "hslaArray",
  },
  {
    title: "hexToRgb",
    description:
      "Converts a hex color string to [R,G,B,A] (0–1).",
    regex: "(?<![\\w.])hexToRgb\\(\\s*(?<hexString>[^)]*?)\\s*\\)",
    arguments: "hexString",
  },
  {
    title: "degreesToRadians",
    description:
      "Converts degrees to radians (×π/180).",
    regex: "(?<![\\w.])degreesToRadians\\(\\s*(?<degrees>[^)]*?)\\s*\\)",
    arguments: "degrees",
  },
  {
    title: "radiansToDegrees",
    description:
      "Converts radians to degrees (×180/π).",
    regex: "(?<![\\w.])radiansToDegrees\\(\\s*(?<radians>[^)]*?)\\s*\\)",
    arguments: "radians",
  },
  {
    title: "createPath",
    description:
      "Creates a new path Shape from arrays of points, tangents, and isClosed.",
    regex:
      "(?<![\\w.])createPath\\(\\s*(?<points>[^,]+?),\\s*(?<inTangents>[^,]+?),\\s*(?<outTangents>[^,]+?),\\s*(?<isClosed>[^)]*?)\\s*\\)",
    arguments: "points,inTangents,outTangents,isClosed",
  },

  // Standalone calls that AE allows without a dot prefix
  {
    title: "loopOut",
    description:
      "Loops keyframes after the last keyframe. The most common loop expression.",
    regex: "(?<![\\w.])loopOut\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<numKeyframes>[^)]*?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
  },
  {
    title: "loopIn",
    description:
      "Loops keyframes before the first keyframe.",
    regex: "(?<![\\w.])loopIn\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<numKeyframes>[^)]*?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
  },
  {
    title: "loopOutDuration",
    description:
      "Like loopOut() but uses time duration instead of keyframe count.",
    regex: "(?<![\\w.])loopOutDuration\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<duration>[^)]*?))?)?\\s*\\)",
    arguments: "type,duration",
  },
  {
    title: "loopInDuration",
    description:
      "Like loopIn() but uses time duration instead of keyframe count.",
    regex: "(?<![\\w.])loopInDuration\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<duration>[^)]*?))?)?\\s*\\)",
    arguments: "type,duration",
  },
  {
    title: "valueAtTime",
    description:
      "Returns the current property's value at an arbitrary time (standalone call).",
    regex: "(?<![\\w.])valueAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "velocityAtTime",
    description:
      "Returns the rate of change of the current property at time t (standalone call).",
    regex: "(?<![\\w.])velocityAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "speedAtTime",
    description:
      "Returns the scalar speed of the current property at time t (standalone call).",
    regex: "(?<![\\w.])speedAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "smooth",
    description:
      "Smooths the current property value over time (standalone call).",
    regex:
      "(?<![\\w.])smooth\\(\\s*(?:(?<width>[^,)]+?)(?:,\\s*(?<samples>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?)?\\s*\\)",
    arguments: "width,samples,t",
  },
  {
    title: "temporalWiggle",
    description:
      "Applies temporal noise to the current property's keyframe data (standalone call).",
    regex:
      "(?<![\\w.])temporalWiggle\\(\\s*(?<frequency>[^,]+?),\\s*(?<amplitude>[^,)]+?)(?:,\\s*(?<octaves>[^,)]+?))?(?:,\\s*(?<amp_mult>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "frequency,amplitude,octaves,amp_mult,t",
  },
  {
    title: "nearestKey",
    description:
      "Returns the nearest keyframe to time t (standalone call).",
    regex: "(?<![\\w.])nearestKey\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "key",
    description:
      "Returns the Key object at the given index (standalone call).",
    regex: "(?<![\\w.])key\\(\\s*(?<indexOrName>[^)]*?)\\s*\\)",
    arguments: "indexOrName",
  },
  {
    title: "effect",
    description:
      "Accesses an effect on the current layer by name or index (standalone call).",
    regex: "(?<![\\w.])effect\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
  },
  {
    title: "content",
    description:
      "Accesses a shape group/property (standalone call on shape layers).",
    regex: "(?<![\\w.])content\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
  },
  {
    title: "mask",
    description:
      "Accesses a mask on the current layer (standalone call).",
    regex: "(?<![\\w.])mask\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
  },
  {
    title: "sourceRectAtTime",
    description:
      "Returns {top, left, width, height} of the current layer's content (standalone call).",
    regex:
      "(?<![\\w.])sourceRectAtTime\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<includeExtents>[^)]*?))?)?\\s*\\)",
    arguments: "t,includeExtents",
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
  },
  {
    title: "velocityAtTime",
    description:
      "Returns the rate of change of the property at time t.",
    regex: "\\.velocityAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "speedAtTime",
    description:
      "Returns the scalar speed of the property at time t.",
    regex: "\\.speedAtTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "smooth",
    description:
      "Smooths the property's value over time.",
    regex:
      "\\.smooth\\(\\s*(?:(?<width>[^,)]+?)(?:,\\s*(?<samples>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?)?\\s*\\)",
    arguments: "width,samples,t",
  },
  {
    title: "temporalWiggle",
    description:
      "Applies temporal noise to the property's keyframe data.",
    regex:
      "\\.temporalWiggle\\(\\s*(?<frequency>[^,]+?),\\s*(?<amplitude>[^,)]+?)(?:,\\s*(?<octaves>[^,)]+?))?(?:,\\s*(?<amp_mult>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "frequency,amplitude,octaves,amp_mult,t",
  },
  {
    title: "loopIn",
    description:
      "Loops keyframes before the first keyframe (method call).",
    regex:
      "\\.loopIn\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<numKeyframes>[^)]*?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
  },
  {
    title: "loopOut",
    description:
      "Loops keyframes after the last keyframe (method call).",
    regex:
      "\\.loopOut\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<numKeyframes>[^)]*?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
  },
  {
    title: "loopInDuration",
    description:
      "Like loopIn() but uses time duration (method call).",
    regex:
      "\\.loopInDuration\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<duration>[^)]*?))?)?\\s*\\)",
    arguments: "type,duration",
  },
  {
    title: "loopOutDuration",
    description:
      "Like loopOut() but uses time duration (method call).",
    regex:
      "\\.loopOutDuration\\(\\s*(?:(?<type>[^,)]+?)(?:,\\s*(?<duration>[^)]*?))?)?\\s*\\)",
    arguments: "type,duration",
  },
  {
    title: "key",
    description:
      "Returns a Key object for the keyframe at the given index.",
    regex: "\\.key\\(\\s*(?<indexOrName>[^)]*?)\\s*\\)",
    arguments: "indexOrName",
  },
  {
    title: "nearestKey",
    description:
      "Returns the Key object closest in time to t.",
    regex: "\\.nearestKey\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "previousKey",
    description:
      "Returns the Key object immediately before time t. (AE 26.0+)",
    regex: "\\.previousKey\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "nextKey",
    description:
      "Returns the Key object immediately after time t. (AE 26.0+)",
    regex: "\\.nextKey\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "sourceRectAtTime",
    description:
      "Returns {top, left, width, height} of the layer's content bounding box.",
    regex:
      "\\.sourceRectAtTime\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<includeExtents>[^)]*?))?)?\\s*\\)",
    arguments: "t,includeExtents",
  },
  {
    title: "sourceTime",
    description:
      "Returns the source footage time for time-remapped layers.",
    regex: "\\.sourceTime\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "sampleImage",
    description:
      "Samples RGBA color at a point in the layer's coordinate space.",
    regex:
      "\\.sampleImage\\(\\s*(?<point>[^,]+?),\\s*(?<radius>[^,)]+?)(?:,\\s*(?<postEffect>[^,)]+?))?(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,radius,postEffect,t",
  },
  {
    title: "effect",
    description:
      "Accesses an effect on a layer by name or index.",
    regex: "\\.effect\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
  },
  {
    title: "mask",
    description:
      "Accesses a mask on a layer by name or index.",
    regex: "\\.mask\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
  },
  {
    title: "content",
    description:
      "Accesses a shape group/property within a shape layer.",
    regex: "\\.content\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
  },
  {
    title: "layer",
    description:
      "Retrieves a layer from the composition by name or index.",
    regex: "\\.layer\\(\\s*(?<nameOrIndex>[^)]*?)\\s*\\)",
    arguments: "nameOrIndex",
  },
  {
    title: "toComp",
    description:
      "Transforms a point from layer-local to comp space.",
    regex: "\\.toComp\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
  },
  {
    title: "fromComp",
    description:
      "Transforms a point from comp to layer-local space.",
    regex: "\\.fromComp\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
  },
  {
    title: "toWorld",
    description:
      "Transforms a point from layer-local to 3D world space.",
    regex: "\\.toWorld\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
  },
  {
    title: "fromWorld",
    description:
      "Transforms a point from 3D world space to layer-local.",
    regex: "\\.fromWorld\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
  },
  {
    title: "toCompVec",
    description:
      "Transforms a direction vector from layer-local to comp space.",
    regex: "\\.toCompVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "vec,t",
  },
  {
    title: "fromCompVec",
    description:
      "Transforms a direction vector from comp to layer-local space.",
    regex: "\\.fromCompVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "vec,t",
  },
  {
    title: "toWorldVec",
    description:
      "Transforms a direction vector from layer-local to world space.",
    regex: "\\.toWorldVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "vec,t",
  },
  {
    title: "fromWorldVec",
    description:
      "Transforms a direction vector from world to layer-local space.",
    regex: "\\.fromWorldVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "vec,t",
  },
  {
    title: "fromCompToSurface",
    description:
      "Projects a comp-space point onto the surface of a 3D layer.",
    regex:
      "\\.fromCompToSurface\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "point,t",
  },
  {
    title: "propertyGroup",
    description:
      "Navigates up the property hierarchy by countUp levels.",
    regex: "\\.propertyGroup\\(\\s*(?<countUp>[^)]*?)\\s*\\)",
    arguments: "countUp",
  },
  {
    title: "points",
    description:
      "Returns an array of vertex points from a path.",
    regex: "\\.points\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "inTangents",
    description:
      "Returns incoming tangent vectors for each path vertex.",
    regex: "\\.inTangents\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "outTangents",
    description:
      "Returns outgoing tangent vectors for each path vertex.",
    regex: "\\.outTangents\\(\\s*(?<t>[^)]*?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "isClosed",
    description:
      "Returns true if the path is closed.",
    regex: "\\.isClosed\\(\\s*\\)",
    arguments: "",
  },
  {
    title: "pointOnPath",
    description:
      "Returns the [x,y] point at a percentage (0–1) along a path.",
    regex:
      "\\.pointOnPath\\(\\s*(?<percentage>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "percentage,t",
  },
  {
    title: "tangentOnPath",
    description:
      "Returns the tangent direction at a percentage along a path.",
    regex:
      "\\.tangentOnPath\\(\\s*(?<percentage>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "percentage,t",
  },
  {
    title: "normalOnPath",
    description:
      "Returns the normal direction at a percentage along a path.",
    regex:
      "\\.normalOnPath\\(\\s*(?<percentage>[^,)]+?)(?:,\\s*(?<t>[^)]*?))?\\s*\\)",
    arguments: "percentage,t",
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
  },
  {
    title: "position",
    description:
      "The layer's position [x, y] or [x, y, z].",
    regex: "\\.position(?![\\w(])",
    arguments: "",
  },
  {
    title: "anchorPoint",
    description:
      "The layer's anchor point (pivot).",
    regex: "\\.anchorPoint(?![\\w(])",
    arguments: "",
  },
  {
    title: "scale",
    description:
      "The layer's scale [x%, y%] or [x%, y%, z%].",
    regex: "\\.scale(?![\\w(])",
    arguments: "",
  },
  {
    title: "rotation",
    description:
      "The layer's rotation in degrees.",
    regex: "\\.rotation(?![\\w(])",
    arguments: "",
  },
  {
    title: "opacity",
    description:
      "The layer's opacity (0–100).",
    regex: "\\.opacity(?![\\w(])",
    arguments: "",
  },
  {
    title: "xRotation",
    description: "X-axis rotation in degrees (3D layers).",
    regex: "\\.xRotation(?![\\w(])",
    arguments: "",
  },
  {
    title: "yRotation",
    description: "Y-axis rotation in degrees (3D layers).",
    regex: "\\.yRotation(?![\\w(])",
    arguments: "",
  },
  {
    title: "zRotation",
    description: "Z-axis rotation in degrees (3D layers).",
    regex: "\\.zRotation(?![\\w(])",
    arguments: "",
  },
  {
    title: "orientation",
    description:
      "3D orientation [x, y, z] degrees.",
    regex: "\\.orientation(?![\\w(])",
    arguments: "",
  },
  {
    title: "pointOfInterest",
    description:
      "Camera/light point of interest in 3D space.",
    regex: "\\.pointOfInterest(?![\\w(])",
    arguments: "",
  },
  {
    title: "text.sourceText",
    description:
      "The source text content of a text layer.",
    regex: "\\.text\\.sourceText(?![\\w(])",
    arguments: "",
  },
  {
    title: "zoom",
    description: "Camera zoom (focal length) in pixels.",
    regex: "\\.zoom(?![\\w(])",
    arguments: "",
  },
  {
    title: "depthOfField",
    description: "Whether DOF is enabled on the camera.",
    regex: "\\.depthOfField(?![\\w(])",
    arguments: "",
  },
  {
    title: "focusDistance",
    description: "Camera focus distance in pixels.",
    regex: "\\.focusDistance(?![\\w(])",
    arguments: "",
  },
  {
    title: "aperture",
    description: "Camera aperture in pixels.",
    regex: "\\.aperture(?![\\w(])",
    arguments: "",
  },
  {
    title: "blurLevel",
    description: "Camera blur level percentage.",
    regex: "\\.blurLevel(?![\\w(])",
    arguments: "",
  },
  {
    title: "intensity",
    description: "Light intensity (0–100+).",
    regex: "\\.intensity(?![\\w(])",
    arguments: "",
  },
  {
    title: "color",
    description: "Light color [R, G, B, A] (0–1).",
    regex: "\\.color(?![\\w(])",
    arguments: "",
  },
  {
    title: "coneAngle",
    description: "Spot light cone angle in degrees.",
    regex: "\\.coneAngle(?![\\w(])",
    arguments: "",
  },
  {
    title: "coneFeather",
    description: "Spot light cone feather percentage.",
    regex: "\\.coneFeather(?![\\w(])",
    arguments: "",
  },
  {
    title: "shadowDarkness",
    description: "Shadow darkness (0–100%).",
    regex: "\\.shadowDarkness(?![\\w(])",
    arguments: "",
  },
  {
    title: "shadowDiffusion",
    description: "Shadow diffusion/softness.",
    regex: "\\.shadowDiffusion(?![\\w(])",
    arguments: "",
  },
  {
    title: "maskPath",
    description: "The path shape of a mask.",
    regex: "\\.maskPath(?![\\w(])",
    arguments: "",
  },
  {
    title: "maskFeather",
    description: "Mask feather amount in pixels.",
    regex: "\\.maskFeather(?![\\w(])",
    arguments: "",
  },
  {
    title: "maskOpacity",
    description: "Mask opacity (0–100%).",
    regex: "\\.maskOpacity(?![\\w(])",
    arguments: "",
  },
  {
    title: "maskExpansion",
    description: "Mask expansion/contraction in pixels.",
    regex: "\\.maskExpansion(?![\\w(])",
    arguments: "",
  },
  {
    title: "path",
    description: "Shape/mask path property.",
    regex: "\\.path(?![\\w(])",
    arguments: "",
  },
  {
    title: "sourceData",
    description: "Parsed JSON data from a JSON footage item.",
    regex: "\\.sourceData(?![\\w(])",
    arguments: "",
  },
  {
    title: "source",
    description: "The source Comp or Footage of a layer.",
    regex: "\\.source(?![\\w(])",
    arguments: "",
  },
  {
    title: "propertyIndex",
    description: "1-based index of the property within its parent group.",
    regex: "\\.propertyIndex(?![\\w(])",
    arguments: "",
  },
  {
    title: "activeCamera",
    description:
      "The camera currently rendering the composition.",
    regex: "\\.activeCamera(?![\\w(])",
    arguments: "",
  },
  {
    title: "marker",
    description:
      "Composition or layer marker property.",
    regex: "\\.marker(?![\\w(])",
    arguments: "",
  },
  {
    title: "name",
    description: "The name of the layer or property.",
    regex: "\\.name(?![\\w(])",
    arguments: "",
  },
  {
    title: "width",
    description: "Width of the comp or layer in pixels.",
    regex: "\\.width(?![\\w(])",
    arguments: "",
  },
  {
    title: "height",
    description: "Height of the comp or layer in pixels.",
    regex: "\\.height(?![\\w(])",
    arguments: "",
  },
  {
    title: "duration",
    description: "Duration of the comp in seconds.",
    regex: "\\.duration(?![\\w(])",
    arguments: "",
  },
  {
    title: "active",
    description: "Whether the layer is active at the current time.",
    regex: "\\.active(?![\\w(])",
    arguments: "",
  },
  {
    title: "enabled",
    description: "Whether the layer's video switch is on.",
    regex: "\\.enabled(?![\\w(])",
    arguments: "",
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
  },
  {
    title: "value",
    description:
      "Current value of the property the expression is on.",
    regex: "(?<![\\w.])value(?![\\w(])",
    arguments: "",
  },
  {
    title: "thisComp",
    description:
      "Reference to the composition containing this expression.",
    regex: "(?<![\\w.])thisComp(?![\\w(])",
    arguments: "",
  },
  {
    title: "thisLayer",
    description:
      "Reference to the layer this expression is on.",
    regex: "(?<![\\w.])thisLayer(?![\\w(])",
    arguments: "",
  },
  {
    title: "thisProperty",
    description:
      "Reference to the property this expression is on.",
    regex: "(?<![\\w.])thisProperty(?![\\w(])",
    arguments: "",
  },
  {
    title: "index",
    description:
      "1-based layer index in the comp stack.",
    regex: "(?<![\\w.])index(?![\\w(])",
    arguments: "",
  },
  {
    title: "numKeys",
    description:
      "Number of keyframes on this property.",
    regex: "(?<![\\w.])numKeys(?![\\w(])",
    arguments: "",
  },
  {
    title: "numLayers",
    description:
      "Total number of layers in the composition.",
    regex: "(?<![\\w.])numLayers(?![\\w(])",
    arguments: "",
  },
  {
    title: "inPoint",
    description:
      "Time (seconds) when the layer becomes visible.",
    regex: "(?<![\\w.])inPoint(?![\\w(])",
    arguments: "",
  },
  {
    title: "outPoint",
    description:
      "Time (seconds) when the layer becomes invisible.",
    regex: "(?<![\\w.])outPoint(?![\\w(])",
    arguments: "",
  },
  {
    title: "startTime",
    description:
      "Time where the layer's first frame sits in the timeline.",
    regex: "(?<![\\w.])startTime(?![\\w(])",
    arguments: "",
  },
  {
    title: "hasParent",
    description:
      "True if the layer has a parent assigned.",
    regex: "(?<![\\w.])hasParent(?![\\w(])",
    arguments: "",
  },
  {
    title: "parent",
    description:
      "The parent Layer object.",
    regex: "(?<![\\w.])parent(?![\\w(])",
    arguments: "",
  },
  {
    title: "frameDuration",
    description:
      "Duration of one frame in seconds (1/fps).",
    regex: "(?<![\\w.])frameDuration(?![\\w(])",
    arguments: "",
  },
  {
    title: "colorDepth",
    description:
      "Project color depth: 8, 16, or 32 bits.",
    regex: "(?<![\\w.])colorDepth(?![\\w(])",
    arguments: "",
  },
  {
    title: "textIndex",
    description:
      "1-based index of the current character in a text animator.",
    regex: "(?<![\\w.])textIndex(?![\\w(])",
    arguments: "",
  },
  {
    title: "textTotal",
    description:
      "Total character count in a text animator.",
    regex: "(?<![\\w.])textTotal(?![\\w(])",
    arguments: "",
  },
  {
    title: "selectorValue",
    description:
      "Current selector value (0–100) in a text animator.",
    regex: "(?<![\\w.])selectorValue(?![\\w(])",
    arguments: "",
  },
];

export default nativeExpressions;
