import { NativeExpressionModel } from "@kissnotes/types";

/**
 * After Effects JS Builtins Dictionary
 * JavaScript/ECMAScript primitives and built-ins available in
 * After Effects' JavaScript expression engine (V8-based).
 * Category: jsBuiltins
 */

const jsBuiltins: Omit<NativeExpressionModel, "id">[] = [
  // ─────────────────────────────────────────────
  // MATH
  // ─────────────────────────────────────────────
  {
    title: "Math.sin",
    description:
      "Returns the sine of an angle given in radians. One of the most used Math functions in AE expressions — typically combined with time or an animated value to produce a smooth oscillating wave. For example, Math.sin(time * 2) cycles through -1 to 1 roughly once per second, perfect for pendulum swings, breathing animations, or rhythmic looping motion.",
    regex: "Math\\.sin\\((?<angle>[^)]+)\\)",
    arguments: ["angle"].join(","),
  },
  {
    title: "Math.cos",
    description:
      "Returns the cosine of an angle given in radians. Behaves identically to Math.sin() but is phase-shifted by 90°. Commonly paired with Math.sin() to produce circular or elliptical motion — for example, x: Math.cos(time) and y: Math.sin(time) traces a perfect circle over time. Also useful for easing and wave-based animations.",
    regex: "Math\\.cos\\((?<angle>[^)]+)\\)",
    arguments: ["angle"].join(","),
  },
  {
    title: "Math.tan",
    description:
      "Returns the tangent of an angle in radians. Less common than sin/cos but useful for perspective-based calculations, slope ratios, or when building custom easing curves. Be careful near ±π/2 (90°) where the tangent approaches infinity.",
    regex: "Math\\.tan\\((?<angle>[^)]+)\\)",
    arguments: ["angle"].join(","),
  },
  {
    title: "Math.asin",
    description:
      "Returns the arcsine (inverse sine) of a value, producing an angle in radians in the range [-π/2, π/2]. Input must be in the range [-1, 1]. Used in geometric expressions where you know a ratio and need to recover the angle — for example, computing the tilt angle of a layer from the ratio of its projected height to its actual height.",
    regex: "Math\\.asin\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.acos",
    description:
      "Returns the arccosine (inverse cosine) of a value, producing an angle in radians in the range [0, π]. Input must be in the range [-1, 1]. Useful for computing angles between two vectors by combining with the dot product — the angle between two normalized vectors equals Math.acos(dot(v1, v2)).",
    regex: "Math\\.acos\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.atan",
    description:
      "Returns the arctangent of a value in radians, in the range [-π/2, π/2]. Converts a slope (rise/run) back to an angle. For computing the angle from one point to another, prefer Math.atan2() which handles all four quadrants correctly and avoids division-by-zero issues.",
    regex: "Math\\.atan\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.atan2",
    description:
      "Returns the angle in radians between the positive X-axis and the point (x, y), correctly handling all four quadrants. The most useful trigonometric function in AE for pointing one layer at another — compute Math.atan2(dy, dx) from the difference in positions, then convert with radiansToDegrees() and apply to the Rotation property. Note the argument order is (y, x), not (x, y).",
    regex: "Math\\.atan2\\((?<y>[^,]+),\\s*(?<x>[^)]+)\\)",
    arguments: ["y", "x"].join(","),
  },
  {
    title: "Math.abs",
    description:
      "Returns the absolute (non-negative) value of a number. Strips the sign from any value, turning negatives into positives while leaving positives unchanged. Widely used in AE expressions to compute distances, fold oscillating waves into always-positive bounces (e.g. Math.abs(Math.sin(time)) for a bouncing ball), or prevent expressions from producing negative scale/opacity values.",
    regex: "Math\\.abs\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.round",
    description:
      "Rounds a number to the nearest integer (0.5 rounds up). Useful for snapping expression values to whole numbers — for example, rounding a time-driven counter to display clean frame counts, or quantizing a position to a grid. Combine with a multiplier to round to any step size: Math.round(x / step) * step.",
    regex: "Math\\.round\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.floor",
    description:
      "Rounds a number down to the nearest integer (toward negative infinity). Essential for index-based expressions — for example Math.floor(time * fps) gives the current frame number as an integer, suitable for use as an array index. Also used to create staircase / step animations by discretizing a continuous value.",
    regex: "Math\\.floor\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.ceil",
    description:
      "Rounds a number up to the nearest integer (toward positive infinity). Use when you need the next whole number above a fractional value — for example, computing how many rows are needed to fill a grid from a fractional count, or ensuring a minimum value of 1 on a count that could be less.",
    regex: "Math\\.ceil\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.pow",
    description:
      "Returns base raised to the power of exponent (base^exponent). Useful for exponential growth/decay curves, custom easing functions (e.g. Math.pow(t, 3) for a cubic ease-in), gamma correction on color values, or computing geometric progressions. Note: Math.pow(x, 0.5) is equivalent to Math.sqrt(x).",
    regex: "Math\\.pow\\((?<base>[^,]+),\\s*(?<exponent>[^)]+)\\)",
    arguments: ["base", "exponent"].join(","),
  },
  {
    title: "Math.sqrt",
    description:
      "Returns the square root of a value. Commonly used when computing Euclidean distances manually — Math.sqrt(dx*dx + dy*dy) — or when building physically-based expressions like spring simulations where acceleration is proportional to the square root of displacement. Equivalent to Math.pow(x, 0.5) but more readable.",
    regex: "Math\\.sqrt\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.log",
    description:
      "Returns the natural logarithm (base e) of a value. Useful for compressing large value ranges into manageable scales, building logarithmic easing curves, or mapping exponential audio amplitude values to a perceptually linear display. Use Math.log(x) / Math.log(base) to compute a logarithm in any base.",
    regex: "Math\\.log\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.log2",
    description:
      "Returns the base-2 logarithm of a value. Useful for octave-based calculations, bit-depth expressions, or computing how many doublings fit in a given ratio. More direct than Math.log(x) / Math.log(2) and available in AE's V8 JS engine.",
    regex: "Math\\.log2\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.log10",
    description:
      "Returns the base-10 logarithm of a value. Used in decibel calculations (audio level expressions), order-of-magnitude scaling, or any expression that needs to work in decades rather than natural units.",
    regex: "Math\\.log10\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.exp",
    description:
      "Returns e raised to the power of the given value (e^x). Used to build exponential growth and decay curves — for example, a damped spring's amplitude decays as Math.exp(-damping * time). The inverse of Math.log().",
    regex: "Math\\.exp\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.min",
    description:
      "Returns the smallest of two or more numbers. Useful for capping a value at a maximum ceiling — e.g. Math.min(someValue, 100) ensures the result never exceeds 100. Often combined with Math.max() to clamp a value within a range: Math.min(Math.max(x, lo), hi).",
    regex: "Math\\.min\\((?<values>[^)]+)\\)",
    arguments: ["value1", "value2", "...rest"].join(","),
  },
  {
    title: "Math.max",
    description:
      "Returns the largest of two or more numbers. Used to enforce a minimum floor on a value — e.g. Math.max(someValue, 0) prevents negative results. Paired with Math.min() it forms the standard clamping pattern used throughout AE expressions.",
    regex: "Math\\.max\\((?<values>[^)]+)\\)",
    arguments: ["value1", "value2", "...rest"].join(","),
  },
  {
    title: "Math.PI",
    description:
      "The mathematical constant π (≈ 3.14159265358979). Used constantly in AE expressions whenever angular math is involved — converting degrees to radians (degrees * Math.PI / 180), defining full-rotation periods (2 * Math.PI), or computing arc lengths. Using Math.PI instead of a hard-coded number makes expressions self-documenting and precise.",
    regex: "Math\\.PI(?![\\w(])",
    arguments: [].join(","),
  },
  {
    title: "Math.E",
    description:
      "Euler's number e (≈ 2.71828). The base of the natural logarithm. Used in exponential decay and growth expressions, spring physics simulations, and anywhere that Math.exp() or Math.log() appear and the base constant is needed explicitly.",
    regex: "Math\\.E(?![\\w(])",
    arguments: [].join(","),
  },
  {
    title: "Math.hypot",
    description:
      "Returns the square root of the sum of squares of its arguments — the hypotenuse length. Math.hypot(dx, dy) is equivalent to Math.sqrt(dx*dx + dy*dy) but avoids potential overflow issues and is more readable. Ideal for computing distances between two 2D points in AE expressions.",
    regex: "Math\\.hypot\\((?<values>[^)]+)\\)",
    arguments: ["value1", "value2", "...rest"].join(","),
  },
  {
    title: "Math.sign",
    description:
      "Returns -1, 0, or 1 depending on the sign of the input number. Useful for directional expressions — e.g. determining which way a layer is moving and applying an effect only in that direction, or flipping the sign of an offset based on which side of center a layer sits.",
    regex: "Math\\.sign\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.trunc",
    description:
      "Removes the fractional part of a number, returning only the integer portion toward zero (unlike Math.floor which goes toward negative infinity). Math.trunc(-3.7) returns -3, whereas Math.floor(-3.7) returns -4. Use when you want to chop off decimals without changing the sign.",
    regex: "Math\\.trunc\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Math.random",
    description:
      "Returns a pseudo-random floating-point number between 0 (inclusive) and 1 (exclusive). Unlike AE's native random(), Math.random() is not seeded per-layer or per-property, meaning it will produce a different result on every render frame and every render pass — making it non-deterministic. Use AE's native random() for reproducible results; use Math.random() only when true unpredictability is desired.",
    regex: "Math\\.random\\(\\)",
    arguments: [].join(","),
  },

  // ─────────────────────────────────────────────
  // CONTROL FLOW
  // (Keywords are now handled by the parser's generic pass as "keyword" tokens.
  //  Only the arrow function and spread operator remain here as they have
  //  meaningful structural regex patterns.)
  // ─────────────────────────────────────────────

  // ─────────────────────────────────────────────
  // ARRAY METHODS
  // ─────────────────────────────────────────────
  {
    title: "Array.length",
    description:
      "A property (not a method) that returns the number of elements in an array. Used constantly in AE expressions when iterating over dynamically sized arrays — for example, looping through all keyframes collected into an array, or checking how many items a data JSON has returned before indexing into it.",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.length(?![\\w(])",
    arguments: ["array"].join(","),
  },
  {
    title: "Array.push",
    description:
      "Appends one or more elements to the end of an array and returns the new length. Used in AE expressions to build arrays incrementally inside a loop — for example, collecting layer positions into an array before computing their average. Remember that in AE expressions the array must be declared with let or var (not const if you intend to push).",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.push\\((?<elements>[^)]+)\\)",
    arguments: ["array", "element1", "...rest"].join(","),
  },
  {
    title: "Array.map",
    description:
      "Creates a new array by calling a function on every element of the source array and collecting the return values. Available in AE's V8 JS engine. Useful for transforming arrays of values — for example, mapping an array of layer indices to their positions, or converting an array of 0–255 RGB values to 0–1 range.",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.map\\((?<callback>[^)]+)\\)",
    arguments: ["array", "callback"].join(","),
  },
  {
    title: "Array.filter",
    description:
      "Returns a new array containing only the elements for which the callback returns true. In AE expressions, useful for filtering keyframe times, layer indices, or data values that meet a condition — for example, keeping only keyframes that occur after the current time.",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.filter\\((?<callback>[^)]+)\\)",
    arguments: ["array", "callback"].join(","),
  },
  {
    title: "Array.reduce",
    description:
      "Executes a reducer callback on each element of the array, accumulating a single output value. The optional initialValue sets the starting accumulator. Useful in AE for summing arrays of values, flattening nested arrays, or computing running statistics like the average of a set of layer positions.",
    regex:
      "(?<array>[\\w$.\\[\\]]+)\\.reduce\\((?<callback>[^,)]+)(?:,\\s*(?<initialValue>[^)]+))?\\)",
    arguments: ["array", "callback", "initialValue"].join(","),
  },
  {
    title: "Array.indexOf",
    description:
      "Returns the first index at which a given value appears in the array, or -1 if not found. Useful in AE expressions for checking membership — e.g. checking whether a layer name appears in a known list, or finding the position of a matched value in a lookup table array.",
    regex:
      "(?<array>[\\w$.\\[\\]]+)\\.indexOf\\((?<searchElement>[^,)]+)(?:,\\s*(?<fromIndex>[^)]+))?\\)",
    arguments: ["array", "searchElement", "fromIndex"].join(","),
  },
  {
    title: "Array.slice",
    description:
      "Returns a shallow copy of a portion of the array from startIndex up to (but not including) endIndex. Does not mutate the original. In AE expressions, used to extract a subset of an array — e.g. taking the last 3 keyframe values from a collected array, or trimming a data array to a usable range.",
    regex:
      "(?<array>[\\w$.\\[\\]]+)\\.slice\\((?<startIndex>[^,)]+)(?:,\\s*(?<endIndex>[^)]+))?\\)",
    arguments: ["array", "startIndex", "endIndex"].join(","),
  },
  {
    title: "Array.join",
    description:
      "Joins all elements of an array into a single string, separated by the specified separator (defaulting to a comma). In AE expressions, commonly used to build display strings from arrays of values — for example joining an array of text fragments into a single Source Text value.",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.join\\((?<separator>[^)]*)?\\)",
    arguments: ["array", "separator"].join(","),
  },
  {
    title: "Array.concat",
    description:
      "Returns a new array formed by merging the original array with one or more additional arrays or values. Does not mutate the original. Useful in AE for combining multiple collected data arrays before processing them together.",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.concat\\((?<values>[^)]+)\\)",
    arguments: ["array", "value1", "...rest"].join(","),
  },
  {
    title: "Array.find",
    description:
      "Returns the first element in the array for which the callback returns true, or undefined if none match. A cleaner alternative to a manual for-loop search. Useful in AE expressions for locating a specific keyframe object, layer reference, or data entry by a property value.",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.find\\((?<callback>[^)]+)\\)",
    arguments: ["array", "callback"].join(","),
  },
  {
    title: "Array.every",
    description:
      "Returns true if the callback returns true for every element in the array, false otherwise. Short-circuits on the first false result. Useful in AE for validating that all layers in a set meet a condition, or confirming all values in a data array are within an expected range before using them.",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.every\\((?<callback>[^)]+)\\)",
    arguments: ["array", "callback"].join(","),
  },
  {
    title: "Array.some",
    description:
      "Returns true if the callback returns true for at least one element in the array. Short-circuits on the first true result. Useful in AE for checking whether any layer in a group is visible, or whether any keyframe in a range satisfies a condition.",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.some\\((?<callback>[^)]+)\\)",
    arguments: ["array", "callback"].join(","),
  },
  {
    title: "Array.flat",
    description:
      "Returns a new array with all sub-array elements concatenated to the specified depth (default 1). Available in AE's V8 engine. Useful when collecting arrays of arrays — for example, gathering each layer's position components into a nested array and then flattening for processing.",
    regex: "(?<array>[\\w$.\\[\\]]+)\\.flat\\((?<depth>[^)]*)?\\)",
    arguments: ["array", "depth"].join(","),
  },
  {
    title: "Array literal",
    description:
      "Creates a new array inline using square bracket notation. In AE expressions, arrays are the primary way to represent multi-dimensional property values like Position [x, y], Scale [x, y], Color [r, g, b, a], and Rotation [x, y, z]. The JS engine allows any mix of literal values, variables, and expressions inside the brackets.",
    regex: "\\[(?<elements>[^\\]\\[]*)\\]",
    arguments: ["element1", "...rest"].join(","),
  },

  // ─────────────────────────────────────────────
  // STRING METHODS
  // ─────────────────────────────────────────────
  {
    title: "String.split",
    description:
      "Splits a string into an array of substrings at each occurrence of the separator. Returns an array. In AE expressions, commonly used to parse data strings from JSON footage or Source Text layers — for example, splitting a comma-separated list of values into an array for processing.",
    regex: "(?<string>[\\w$.\\[\\]'\"]+)\\.split\\((?<separator>[^)]+)\\)",
    arguments: ["string", "separator"].join(","),
  },
  {
    title: "String.replace",
    description:
      "Returns a new string with the first occurrence of searchValue replaced by replaceValue. searchValue can be a string or a RegExp. In AE expressions, useful for formatting display strings — removing unwanted characters, substituting placeholders, or cleaning up values from data sources before displaying them in Source Text.",
    regex:
      "(?<string>[\\w$.\\[\\]'\"]+)\\.replace\\((?<searchValue>[^,]+),\\s*(?<replaceValue>[^)]+)\\)",
    arguments: ["string", "searchValue", "replaceValue"].join(","),
  },
  {
    title: "String.indexOf",
    description:
      "Returns the index of the first occurrence of a substring within the string, or -1 if not found. Case-sensitive. Used in AE expressions to detect whether a layer name contains a keyword, or to check if a data string contains a particular token before processing it.",
    regex:
      "(?<string>[\\w$.\\[\\]'\"]+)\\.indexOf\\((?<searchValue>[^,)]+)(?:,\\s*(?<fromIndex>[^)]+))?\\)",
    arguments: ["string", "searchValue", "fromIndex"].join(","),
  },
  {
    title: "String.substring",
    description:
      "Returns a portion of the string between startIndex and endIndex (exclusive). Unlike slice(), it does not support negative indices. Used in AE expressions to extract specific portions of text — for example, taking the first N characters of a layer name, or extracting a numeric portion from a formatted string.",
    regex:
      "(?<string>[\\w$.\\[\\]'\"]+)\\.substring\\((?<startIndex>[^,)]+)(?:,\\s*(?<endIndex>[^)]+))?\\)",
    arguments: ["string", "startIndex", "endIndex"].join(","),
  },
  {
    title: "String.slice",
    description:
      "Returns a portion of the string between startIndex and endIndex (exclusive). Supports negative indices (counting from the end). More flexible than substring(). Used in AE expressions to trim or extract text portions from formatted strings, layer names, or data values.",
    regex:
      "(?<string>[\\w$.\\[\\]'\"]+)\\.slice\\((?<startIndex>[^,)]+)(?:,\\s*(?<endIndex>[^)]+))?\\)",
    arguments: ["string", "startIndex", "endIndex"].join(","),
  },
  {
    title: "String.toString",
    description:
      "Returns the string representation of a value. When called on a Number, it optionally accepts a radix argument (2–36) to convert to binary, hex, etc. In AE expressions, most commonly used to convert numeric expression results into strings for display in Source Text, or to format numbers in a specific base.",
    regex: "(?<value>[\\w$.\\[\\]]+)\\.toString\\((?<radix>[^)]*)?\\)",
    arguments: ["value", "radix"].join(","),
  },
  {
    title: "String.toUpperCase",
    description:
      "Returns the string converted to all uppercase characters. Used in AE expressions for text formatting — for example, capitalizing a layer name, forcing a display label to uppercase, or normalizing strings before comparison.",
    regex: "(?<string>[\\w$.\\[\\]'\"]+)\\.toUpperCase\\(\\)",
    arguments: ["string"].join(","),
  },
  {
    title: "String.toLowerCase",
    description:
      "Returns the string converted to all lowercase characters. Used in AE expressions for case-insensitive comparisons or text formatting — for example, normalizing a layer name before matching it against a known string regardless of how it was typed.",
    regex: "(?<string>[\\w$.\\[\\]'\"]+)\\.toLowerCase\\(\\)",
    arguments: ["string"].join(","),
  },
  {
    title: "String.trim",
    description:
      "Returns the string with leading and trailing whitespace removed. Useful in AE expressions when parsing text from Source Text layers or JSON data where the source may contain accidental spaces, ensuring clean string comparisons and display values.",
    regex: "(?<string>[\\w$.\\[\\]'\"]+)\\.trim\\(\\)",
    arguments: ["string"].join(","),
  },
  {
    title: "String.includes",
    description:
      "Returns true if the string contains the specified searchString, false otherwise. A cleaner alternative to checking indexOf() !== -1. Used in AE expressions to conditionally apply logic based on whether a layer name, Source Text, or data string contains a keyword.",
    regex:
      "(?<string>[\\w$.\\[\\]'\"]+)\\.includes\\((?<searchString>[^,)]+)(?:,\\s*(?<position>[^)]+))?\\)",
    arguments: ["string", "searchString", "position"].join(","),
  },
  {
    title: "String.startsWith",
    description:
      "Returns true if the string begins with the specified prefix. Available in AE's V8 JS engine. Useful for categorizing layers by a naming convention — for example, checking if a layer name starts with 'BG_' or 'FG_' to apply group-specific logic.",
    regex:
      "(?<string>[\\w$.\\[\\]'\"]+)\\.startsWith\\((?<prefix>[^,)]+)(?:,\\s*(?<position>[^)]+))?\\)",
    arguments: ["string", "prefix", "position"].join(","),
  },
  {
    title: "String.endsWith",
    description:
      "Returns true if the string ends with the specified suffix. Available in AE's V8 JS engine. Useful for detecting file extensions in footage names, or matching layer naming conventions that use suffixes like '_left', '_right', '_mask'.",
    regex:
      "(?<string>[\\w$.\\[\\]'\"]+)\\.endsWith\\((?<suffix>[^,)]+)(?:,\\s*(?<length>[^)]+))?\\)",
    arguments: ["string", "suffix", "length"].join(","),
  },
  {
    title: "String.padStart",
    description:
      "Pads the beginning of the string with a fill character until it reaches the target length. Defaults to padding with spaces. In AE expressions, commonly used to zero-pad frame counters or timecodes — e.g. String(frameNum).padStart(4, '0') produces '0042' from 42, useful for building custom timecode displays.",
    regex:
      "(?<string>[\\w$.\\[\\]'\"]+)\\.padStart\\((?<targetLength>[^,)]+)(?:,\\s*(?<padString>[^)]+))?\\)",
    arguments: ["string", "targetLength", "padString"].join(","),
  },
  {
    title: "String.padEnd",
    description:
      "Pads the end of the string with a fill character until it reaches the target length. Less common than padStart() in AE but useful when building fixed-width text displays or aligning columns of text in a Source Text expression.",
    regex:
      "(?<string>[\\w$.\\[\\]'\"]+)\\.padEnd\\((?<targetLength>[^,)]+)(?:,\\s*(?<padString>[^)]+))?\\)",
    arguments: ["string", "targetLength", "padString"].join(","),
  },
  {
    title: "String.repeat",
    description:
      "Returns a new string consisting of the original string repeated count times. Useful in AE expressions for building repeated text patterns, creating progress bars made of characters, or generating separator lines in Source Text displays.",
    regex: "(?<string>[\\w$.\\[\\]'\"]+)\\.repeat\\((?<count>[^)]+)\\)",
    arguments: ["string", "count"].join(","),
  },
  {
    title: "template literal",
    description:
      "A string delimited by backticks (`) that supports embedded expressions via ${...} syntax and multi-line strings without escape characters. Available in AE's V8 JS engine. The cleanest way to build display strings in AE Source Text expressions — e.g. `Frame: ${timeToFrames(time)}` — replacing messy string concatenation with + operators.",
    regex: "`(?<template>[^`]*)`",
    arguments: ["template"].join(","),
  },

  // ─────────────────────────────────────────────
  // JS OBJECTS & GLOBALS
  // ─────────────────────────────────────────────
  {
    title: "parseInt",
    description:
      "Parses a string and returns an integer in the specified radix (base). If no radix is given it defaults to base 10 (always specify it explicitly to avoid surprises). Used in AE expressions to convert string values from JSON data or Source Text layers into usable integers for calculations or indexing.",
    regex: "parseInt\\((?<string>[^,)]+)(?:,\\s*(?<radix>[^)]+))?\\)",
    arguments: ["string", "radix"].join(","),
  },
  {
    title: "parseFloat",
    description:
      "Parses a string and returns a floating-point number. Returns NaN if the string cannot be parsed. Used in AE expressions to extract numeric values from text-based data sources — for example, reading a formatted number string from a JSON data layer or a Source Text property on another layer.",
    regex: "parseFloat\\((?<string>[^)]+)\\)",
    arguments: ["string"].join(","),
  },
  {
    title: "isNaN",
    description:
      "Returns true if the value is NaN (Not a Number), false otherwise. Used defensively in AE expressions to validate parsed values before using them in calculations — for example, checking that a parseFloat() call succeeded before using the result, to avoid NaN propagating through the entire expression.",
    regex: "isNaN\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "isFinite",
    description:
      "Returns true if the value is a finite number (not Infinity, -Infinity, or NaN). Useful as a guard in AE expressions that involve division, logarithms, or other operations that could produce infinite values — ensuring the expression returns a usable number rather than Infinity.",
    regex: "isFinite\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "JSON.parse",
    description:
      "Parses a JSON-formatted string and returns the corresponding JavaScript object or array. In AE expressions, used to decode data loaded from a JSON footage item's sourceText or sourceData attribute into a structured object that can be accessed by property name or index.",
    regex: "JSON\\.parse\\((?<jsonString>[^)]+)\\)",
    arguments: ["jsonString"].join(","),
  },
  {
    title: "JSON.stringify",
    description:
      "Converts a JavaScript object or array to a JSON-formatted string. In AE expressions, less common than JSON.parse() but useful for debugging — outputting a complex object as a Source Text string to inspect its structure, or serializing computed state for display.",
    regex:
      "JSON\\.stringify\\((?<value>[^,)]+)(?:,\\s*(?<replacer>[^,)]+))?(?:,\\s*(?<space>[^)]+))?\\)",
    arguments: ["value", "replacer", "space"].join(","),
  },
  {
    title: "Object.keys",
    description:
      "Returns an array of the enumerable property names (keys) of an object. Available in AE's V8 JS engine. Used when working with JSON data footage — iterating over the keys of a parsed data object to dynamically access all its fields without knowing their names in advance.",
    regex: "Object\\.keys\\((?<object>[^)]+)\\)",
    arguments: ["object"].join(","),
  },
  {
    title: "Object.values",
    description:
      "Returns an array of the enumerable property values of an object. Pairs naturally with Object.keys() when you need just the values of a parsed JSON object — for example, summing all numeric values in a data record, or building a display string from all fields.",
    regex: "Object\\.values\\((?<object>[^)]+)\\)",
    arguments: ["object"].join(","),
  },
  {
    title: "Object.assign",
    description:
      "Copies all enumerable own properties from one or more source objects into a target object and returns the target. In AE expressions, used to merge configuration objects or extend a default settings object with specific overrides — a clean pattern for parameterizing complex expression logic.",
    regex: "Object\\.assign\\((?<target>[^,)]+)(?:,\\s*(?<sources>[^)]+))?\\)",
    arguments: ["target", "...sources"].join(","),
  },
  {
    title: "Date",
    description:
      "The JavaScript Date object, available in AE's V8 JS engine. new Date() returns the current date and time at the moment the expression is evaluated. Useful for time-of-day based expressions — for example, displaying the real current time in a clock, or driving different animation states based on the day of week. Note: Date reflects the machine's clock at render time, not composition time.",
    regex: "new\\s+Date\\((?<args>[^)]*)\\)",
    arguments: ["args"].join(","),
  },
  {
    title: "Number",
    description:
      "The Number constructor/conversion function. Number(value) explicitly converts a value to a number type — useful for ensuring a string or boolean is treated as numeric. Also provides static constants like Number.MAX_VALUE, Number.MIN_VALUE, Number.POSITIVE_INFINITY, and Number.isInteger() for type checking.",
    regex: "\\bNumber\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "String",
    description:
      "The String constructor/conversion function. String(value) converts any value to its string representation. In AE expressions, used to explicitly cast numbers to strings before string methods — for example, String(Math.floor(time)).padStart(2, '0') to build a zero-padded seconds counter for a custom timecode display.",
    regex: "\\bString\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "Boolean",
    description:
      "The Boolean constructor/conversion function. Boolean(value) converts any value to true or false according to JavaScript's truthiness rules. Rarely needed in AE expressions since most conditionals evaluate truthiness implicitly, but useful when you want to explicitly coerce a value to a boolean for clarity or storage.",
    regex: "\\bBoolean\\((?<value>[^)]+)\\)",
    arguments: ["value"].join(","),
  },
  {
    title: "arrow function",
    description:
      "A concise function syntax using => notation, available in AE's V8 JS engine. Arrow functions are most commonly used as inline callbacks for array methods like .map(), .filter(), and .reduce(). They are lexically scoped (no own 'this'), which avoids common scoping pitfalls. Example: [1,2,3].map(x => x * 2) returns [2, 4, 6].",
    regex:
      "(?<params>\\([^)]*\\)|[a-zA-Z_$][\\w$]*)\\s*=>\\s*(?<body>[^\\n;,]+|\\{[^}]+\\})",
    arguments: ["params", "body"].join(","),
  },
  {
    title: "spread operator",
    description:
      "Expands an iterable (array or string) into individual elements using the ... prefix. Available in AE's V8 JS engine. Useful for passing array elements as individual arguments — for example, Math.max(...myArray) to find the maximum in an array, or [...arr1, ...arr2] to concatenate arrays without .concat().",
    regex: "\\.\\.\\.(?<iterable>[\\w$.\\[\\]]+)",
    arguments: ["iterable"].join(","),
  },
];

export default jsBuiltins;
