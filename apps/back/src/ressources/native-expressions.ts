import { NativeExpressionModel } from "@kissnotes/types";

/**
 * After Effects Native Expressions Dictionary
 * Source: Adobe After Effects Expression Language Reference
 * https://helpx.adobe.com/after-effects/using/expression-language-reference.html
 * https://ae-expressions.docsforadobe.dev/
 *
 * Regex conventions:
 *  - All argument captures use lazy quantifiers (+?) to prevent greedy
 *    over-consumption into adjacent arguments.
 *  - \s* is placed after '(' and before ')' to tolerate whitespace.
 *  - Optional argument groups use (?:,\s*(?<name>[^,)]+?))? so they
 *    participate only when actually present in the call site.
 *  - Named capture groups match paramNames exactly so the parser can
 *    zip by name rather than by insertion order.
 */

const nativeExpressions: Omit<NativeExpressionModel, "id">[] = [
  // ─────────────────────────────────────────────
  // GLOBAL ATTRIBUTES
  // ─────────────────────────────────────────────
  {
    title: "time",
    description:
      "A global read-only attribute that returns the current composition time in seconds as a Number. It is the most fundamental time reference in AE expressions, used to drive any time-based animation, offset, or calculation. Every expression is evaluated at a specific 'time', making this the backbone of dynamic expressions.",
    // Word-boundary guards prevent matching inside identifiers like "timeToFrames".
    // The negative lookahead excludes '(' so "time(" is not matched here —
    // that would be a custom user function, not the global attribute.
    regex: "(?<![\\w.])(?<time>\\btime\\b)(?![\\w.(])",
    arguments: "",
  },
  {
    title: "value",
    description:
      "Returns the current value of the property the expression is applied to at the current time. This is especially useful when you want to modify an existing keyframed value rather than replace it entirely — for example adding an offset on top of an animated position, or multiplying the current opacity by a factor.",
    regex: "(?<![\\w.])(?<value>\\bvalue\\b)(?![\\w.(])",
    arguments: "",
  },

  // ─────────────────────────────────────────────
  // GLOBAL FUNCTIONS
  // ─────────────────────────────────────────────
  {
    title: "wiggle",
    description:
      "The wiggle expression is the bread and butter of AE automation. It creates random movement or value changes based on a Perlin noise algorithm. It calculates a random value within the range of the amplitude, changing at the specified frequency per second. Unlike a truly random function, wiggle provides a smooth, organic interpolation between values, making it perfect for camera shake, flickering lights, or organic UI movements.",
    // Up to 5 args; first two (freq, amp) are required, rest optional.
    regex:
      "wiggle\\(\\s*(?<frequency>[^,]+?),\\s*(?<amplitude>[^,)]+?)(?:,\\s*(?<octaves>[^,)]+?))?(?:,\\s*(?<amp_mult>[^,)]+?))?(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "frequency,amplitude,octaves,amp_mult,t",
  },
  {
    title: "posterizeTime",
    description:
      "Sets the frame rate at which the rest of the expression is evaluated, effectively reducing the frame rate of the property it controls. Useful for creating stop-motion or stroboscopic effects. Any expression code after posterizeTime() will only update at the specified frames-per-second rate rather than the composition frame rate.",
    regex: "posterizeTime\\(\\s*(?<framesPerSecond>[^)]+?)\\s*\\)",
    arguments: "framesPerSecond",
  },
  {
    title: "comp",
    description:
      "A global method that retrieves a composition object by name from the project. Returns a Comp object, giving full access to that composition's attributes and methods such as its layers, width, height, and duration. Useful for cross-composition linking and driving values from one comp into another.",
    regex: "comp\\(\\s*(?<name>['\"][^'\"]+['\"])\\s*\\)",
    arguments: "name",
  },
  {
    title: "footage",
    description:
      "A global method that retrieves a footage item from the Project panel by its filename. Returns a Footage object, exposing attributes like width, height, duration, and data values from JSON footage. Useful for driving expressions from external data sources imported as JSON files.",
    regex: "footage\\(\\s*(?<name>['\"][^'\"]+['\"])\\s*\\)",
    arguments: "name",
  },

  // ─────────────────────────────────────────────
  // RANDOM NUMBERS
  // ─────────────────────────────────────────────
  {
    title: "random",
    description:
      "Returns a pseudo-random number. With no arguments it returns a float between 0 and 1. Providing a single maxValOrArray argument returns a value between 0 and that max. Providing both minValOrArray and maxValOrArray returns a value in that range. Array arguments return an Array of matching dimension. The seed is derived from the layer, property, and current time — use seedRandom() to change it.",
    regex:
      "random\\(\\s*(?:(?<minValOrArray>[^,)]+?)(?:,\\s*(?<maxValOrArray>[^)]+?))?)?\\s*\\)",
    arguments: "minValOrArray,maxValOrArray",
  },
  {
    title: "gaussRandom",
    description:
      "Similar to random() but the result has a Gaussian (bell-curve) distribution rather than a uniform one. Approximately 90% of the values fall between 0 and 1 (or within the specified range), with the remaining 10% outside. This produces more 'natural' randomness — most values cluster in the middle, with occasional outliers — ideal for organic effects like particle variance.",
    regex:
      "gaussRandom\\(\\s*(?:(?<minValOrArray>[^,)]+?)(?:,\\s*(?<maxValOrArray>[^)]+?))?)?\\s*\\)",
    arguments: "minValOrArray,maxValOrArray",
  },
  {
    title: "seedRandom",
    description:
      "Controls the seed used by the random() and gaussRandom() functions, allowing you to produce a specific repeatable random sequence. Setting timeless to true generates a random number that does not vary with time — useful for giving each layer a unique but constant random offset. The offset value also influences the initial state of the wiggle() function.",
    regex:
      "seedRandom\\(\\s*(?<offset>[^,)]+?)(?:,\\s*(?<timeless>[^)]+?))?\\s*\\)",
    arguments: "offset,timeless",
  },
  {
    title: "noise",
    description:
      "Returns a Perlin noise value between -1 and 1 for a given input number or 2D/3D array. Unlike random(), noise is smooth and continuous — nearby input values produce nearby output values. This makes it ideal for organic, flowing motion like turbulent wind, gentle audio-reactive effects, or procedural texture-driving expressions.",
    regex: "noise\\(\\s*(?<valOrArray>[^)]+?)\\s*\\)",
    arguments: "valOrArray",
  },

  // ─────────────────────────────────────────────
  // INTERPOLATION
  // ─────────────────────────────────────────────
  {
    title: "linear",
    description:
      "Performs a linear (straight-line) interpolation or value remapping. With three arguments it remaps t from the range [tMin, tMax] to [0, 1]. With five arguments it maps t between tMin and tMax to a value between value1 and value2. Values of t outside the [tMin, tMax] range are clamped. This is the go-to function for mapping sliders, audio amplitude, or time to any range of output values.",
    regex:
      "linear\\(\\s*(?<t>[^,]+?),\\s*(?<tMin>[^,]+?),\\s*(?<tMax>[^,)]+?)(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]+?))?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
  },
  {
    title: "ease",
    description:
      "Like linear() but applies a smooth ease-in and ease-out (cubic Hermite) curve at both the start and end of the transition, matching After Effects' default Easy Ease keyframe interpolation. The result is a value that accelerates from value1 and decelerates into value2. With three arguments it returns a normalized 0–1 ease value. Use it to create polished, professional-looking automated animations without any keyframes.",
    regex:
      "ease\\(\\s*(?<t>[^,]+?),\\s*(?<tMin>[^,]+?),\\s*(?<tMax>[^,)]+?)(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]+?))?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
  },
  {
    title: "easeIn",
    description:
      "Identical to ease() but applies a smooth easing curve only at the start of the transition (ease-in), with a linear exit. The interpolation begins slowly and reaches value2 at a constant rate. Useful when you want a property to ramp up gently from a starting state before moving at a steady pace.",
    regex:
      "easeIn\\(\\s*(?<t>[^,]+?),\\s*(?<tMin>[^,]+?),\\s*(?<tMax>[^,)]+?)(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]+?))?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
  },
  {
    title: "easeOut",
    description:
      "Identical to ease() but applies a smooth easing curve only at the end of the transition (ease-out), with a linear entry. The interpolation starts at a constant rate and decelerates into value2. Useful for landing animations or gradually settling elements into a final position.",
    regex:
      "easeOut\\(\\s*(?<t>[^,]+?),\\s*(?<tMin>[^,]+?),\\s*(?<tMax>[^,)]+?)(?:,\\s*(?<value1>[^,)]+?))?(?:,\\s*(?<value2>[^)]+?))?\\s*\\)",
    arguments: "t,tMin,tMax,value1,value2",
  },

  // ─────────────────────────────────────────────
  // VECTOR MATH
  // ─────────────────────────────────────────────
  {
    title: "add",
    description:
      "Adds two vector arrays component-by-component and returns the resulting array. If the input arrays have different dimensions, the shorter one is padded with zeros. This is the native AE alternative to simply writing [a[0]+b[0], a[1]+b[1]] and is more readable when working with 2D or 3D position values.",
    regex: "add\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]+?)\\s*\\)",
    arguments: "vec1,vec2",
  },
  {
    title: "sub",
    description:
      "Subtracts vec2 from vec1 component-by-component and returns the resulting array. Like add(), it handles dimension mismatches by padding with zeros. Useful for computing the difference vector between two positions, e.g. to find direction or distance between layers.",
    regex: "sub\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]+?)\\s*\\)",
    arguments: "vec1,vec2",
  },
  {
    title: "mul",
    description:
      "Multiplies every component of a vector array by a scalar amount. Returns an array of the same dimension. A concise way to scale a vector — for example, to halve a velocity vector or amplify a direction by a factor — without writing out each component manually.",
    regex: "mul\\(\\s*(?<vec>[^,]+?),\\s*(?<amount>[^)]+?)\\s*\\)",
    arguments: "vec,amount",
  },
  {
    title: "div",
    description:
      "Divides every component of a vector array by a scalar amount. Returns an array of the same dimension. Useful for normalizing vectors by a known magnitude, or scaling down a value range for a mapping operation.",
    regex: "div\\(\\s*(?<vec>[^,]+?),\\s*(?<amount>[^)]+?)\\s*\\)",
    arguments: "vec,amount",
  },
  {
    title: "clamp",
    description:
      "Constrains a value (or each component of an array) to fall within the range defined by limit1 and limit2. The order of limit1 and limit2 doesn't matter. Indispensable for capping slider values, keeping positions within composition bounds, or preventing expression results from going out of a usable range.",
    regex:
      "clamp\\(\\s*(?<value>[^,]+?),\\s*(?<limit1>[^,]+?),\\s*(?<limit2>[^)]+?)\\s*\\)",
    arguments: "value,limit1,limit2",
  },
  {
    title: "dot",
    description:
      "Returns the dot (inner) product of two vector arrays as a single Number. The dot product is used in many geometric calculations — for instance, to determine how aligned two direction vectors are, or to project one vector onto another. Outputs a positive value when vectors point in the same direction, zero when perpendicular, and negative when opposite.",
    regex: "dot\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]+?)\\s*\\)",
    arguments: "vec1,vec2",
  },
  {
    title: "cross",
    description:
      "Returns the cross product of two 2D or 3D vector arrays. The resulting vector is perpendicular to both inputs. In 2D it returns a single number representing the signed area of the parallelogram formed by the two vectors. In 3D it returns a 3-element array. Useful in advanced 3D rigging and orientation calculations.",
    regex: "cross\\(\\s*(?<vec1>[^,]+?),\\s*(?<vec2>[^)]+?)\\s*\\)",
    arguments: "vec1,vec2",
  },
  {
    title: "normalize",
    description:
      "Returns the input vector scaled to have a length of exactly 1.0, preserving its direction. Equivalent to div(vec, length(vec)). Critical in directional calculations where you need a pure unit vector — for example, computing which way a layer is pointing, or building look-at rigs without magnitude contamination.",
    regex: "normalize\\(\\s*(?<vec>[^)]+?)\\s*\\)",
    arguments: "vec",
  },
  {
    title: "length",
    description:
      "With one argument, returns the magnitude (Euclidean length) of a vector array. With two point arguments, returns the distance between the two points in world-space — equivalent to length(sub(point1, point2)). Commonly used to drive opacity or scale based on how far a layer is from another layer or from the camera.",
    regex:
      "length\\(\\s*(?<vec_or_point1>[^,)]+?)(?:,\\s*(?<point2>[^)]+?))?\\s*\\)",
    arguments: "vec_or_point1,point2",
  },
  {
    title: "lookAt",
    description:
      "Given a fromPoint and an atPoint (both in 3D world space), returns a 3-element orientation array that points the layer's Z-axis toward atPoint. Designed to be used directly on the Orientation property of a camera or light to make it track another layer. Requires auto-orientation to be disabled on the camera if used there.",
    regex: "lookAt\\(\\s*(?<fromPoint>[^,]+?),\\s*(?<atPoint>[^)]+?)\\s*\\)",
    arguments: "fromPoint,atPoint",
  },

  // ─────────────────────────────────────────────
  // TIME CONVERSION
  // ─────────────────────────────────────────────
  {
    title: "timeToFrames",
    description:
      "Converts a time value in seconds to an integer frame number. Defaults to the current composition time and frame rate if no arguments are provided. The isDuration flag changes rounding behavior for time spans vs absolute times. Essential for any expression that needs to operate in frame units rather than seconds.",
    regex:
      "timeToFrames\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<fps>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]+?))?)?\\s*\\)",
    arguments: "t,fps,isDuration",
  },
  {
    title: "framesToTime",
    description:
      "The inverse of timeToFrames(). Converts a frame number to a time value in seconds. The fps argument defaults to the current composition frame rate. Useful when building expressions that think in frames (e.g., a loop every N frames) but need to output seconds for other time-based operations.",
    regex:
      "framesToTime\\(\\s*(?<frames>[^,)]+?)(?:,\\s*(?<fps>[^)]+?))?\\s*\\)",
    arguments: "frames,fps",
  },
  {
    title: "timeToTimecode",
    description:
      "Converts a time in seconds to a formatted timecode String (HH:MM:SS:FF). The timecodeBase argument sets how many frames per second to display (defaults to 30). Useful for building timecode overlays or labeling expressions that display the current time as human-readable text.",
    regex:
      "timeToTimecode\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<timecodeBase>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]+?))?)?\\s*\\)",
    arguments: "t,timecodeBase,isDuration",
  },
  {
    title: "timeToNTSCTimecode",
    description:
      "Converts a time in seconds to an NTSC timecode String. The ntscDropFrame flag controls whether drop-frame (;) or non-drop-frame (:) separators are used. This is important for broadcast workflows where NTSC drop-frame timecode is required for accurate sync.",
    regex:
      "timeToNTSCTimecode\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<ntscDropFrame>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]+?))?)?\\s*\\)",
    arguments: "t,ntscDropFrame,isDuration",
  },
  {
    title: "timeToFeetAndFrames",
    description:
      "Converts a time in seconds to a film feet-and-frames String, used in film production workflows. The framesPerFoot argument defaults to 16 (standard for 35mm film). Returns a String like '0+00' representing feet and leftover frames.",
    regex:
      "timeToFeetAndFrames\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<fps>[^,)]+?))?(?:,\\s*(?<framesPerFoot>[^,)]+?))?(?:,\\s*(?<isDuration>[^)]+?))?)?\\s*\\)",
    arguments: "t,fps,framesPerFoot,isDuration",
  },
  {
    title: "timeToCurrentFormat",
    description:
      "Converts a time in seconds to a String in whatever display format is currently set in the project settings (frames, timecode, feet+frames, etc.). The most flexible timecode display method — it automatically adapts to whatever the project is configured to use, making templates more portable across different project setups.",
    regex:
      "timeToCurrentFormat\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<fps>[^,)]+?))?(?:,\\s*(?<isDuration>[^,)]+?))?(?:,\\s*(?<ntscDropFrame>[^)]+?))?)?\\s*\\)",
    arguments: "t,fps,isDuration,ntscDropFrame",
  },

  // ─────────────────────────────────────────────
  // COLOR CONVERSION
  // ─────────────────────────────────────────────
  {
    title: "rgbToHsl",
    description:
      "Converts a color from RGB (or RGBA) color space to HSL (Hue, Saturation, Lightness) color space. Accepts an [R, G, B, A] array with values in the 0–1 range and returns an [H, S, L, A] array also in the 0–1 range. Useful when you need to animate hue rotation, saturation control, or lightness adjustments independently.",
    regex: "rgbToHsl\\(\\s*(?<rgbaArray>[^)]+?)\\s*\\)",
    arguments: "rgbaArray",
  },
  {
    title: "hslToRgb",
    description:
      "Converts a color from HSL (Hue, Saturation, Lightness) space back to RGB space. Accepts an [H, S, L, A] array with values in the 0–1 range and returns an [R, G, B, A] array. Used in conjunction with rgbToHsl() to perform HSL-space operations (like hue cycling) on colors that are specified in RGB.",
    regex: "hslToRgb\\(\\s*(?<hslaArray>[^)]+?)\\s*\\)",
    arguments: "hslaArray",
  },
  {
    title: "hexToRgb",
    description:
      "Converts a hexadecimal color string (e.g. '#FF8800' or 'FF8800') to an [R, G, B, A] array with values in the 0–1 range. Added in After Effects CC 2019 (v16.0) with the JavaScript engine. Makes it easy to use web-standard hex color codes directly in expressions without manual conversion.",
    regex: "hexToRgb\\(\\s*(?<hexString>['\"][^'\"]+['\"])\\s*\\)",
    arguments: "hexString",
  },

  // ─────────────────────────────────────────────
  // OTHER MATH
  // ─────────────────────────────────────────────
  {
    title: "degreesToRadians",
    description:
      "Converts an angle from degrees to radians. Returns the input value multiplied by π/180. Essential when using JavaScript's Math trigonometry functions (Math.sin, Math.cos, Math.atan2), which all operate in radians, while After Effects rotation properties are always expressed in degrees.",
    regex: "degreesToRadians\\(\\s*(?<degrees>[^)]+?)\\s*\\)",
    arguments: "degrees",
  },
  {
    title: "radiansToDegrees",
    description:
      "Converts an angle from radians to degrees. Returns the input value multiplied by 180/π. Use this to convert the output of Math.atan2() or other radian-producing operations back into degrees suitable for After Effects' Rotation property.",
    regex: "radiansToDegrees\\(\\s*(?<radians>[^)]+?)\\s*\\)",
    arguments: "radians",
  },

  // ─────────────────────────────────────────────
  // PROPERTY METHODS
  // ─────────────────────────────────────────────
  {
    title: "valueAtTime",
    description:
      "Returns the value of the property at any arbitrary time in seconds, regardless of the current evaluation time. This is one of the most powerful property methods — it enables delay effects, echo trails, comparative animations, and any expression that needs to look forward or backward in time on the same property's keyframe data.",
    regex: "valueAtTime\\(\\s*(?<t>[^)]+?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "velocityAtTime",
    description:
      "Returns the temporal derivative (rate of change) of the property value at the specified time. For a 1D property it returns a Number; for a multidimensional property it returns an Array. Useful for velocity-based effects like motion blur amounts driven by expression speed, or triggering events when a layer is moving fast.",
    regex: "velocityAtTime\\(\\s*(?<t>[^)]+?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "loopIn",
    description:
      "Loops the keyframes before the first keyframe on the property. The type argument controls the loop mode: 'cycle' (default) repeats the keyframe range, 'pingpong' alternates direction, 'offset' repeats and offsets values, 'continue' extrapolates the first segment. The numKeyframes argument limits the loop to the last N keyframes. This is the standard way to create seamless in-point loops.",
    regex:
      "loopIn\\(\\s*(?:(?<type>['\"][^'\"]*['\"])(?:,\\s*(?<numKeyframes>[^)]+?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
  },
  {
    title: "loopOut",
    description:
      "Loops the keyframes after the last keyframe on the property. The type argument accepts 'cycle', 'pingpong', 'offset', or 'continue'. The numKeyframes argument restricts which keyframes are looped. This is the most common loop expression, used to repeat animations indefinitely after the last keyframe without additional keyframe work.",
    regex:
      "loopOut\\(\\s*(?:(?<type>['\"][^'\"]*['\"])(?:,\\s*(?<numKeyframes>[^)]+?))?)?\\s*\\)",
    arguments: "type,numKeyframes",
  },
  {
    title: "loopInDuration",
    description:
      "Like loopIn() but instead of specifying a number of keyframes, you specify a duration in seconds to loop. Loops the segment of the property's timeline that is duration seconds long, ending at the first keyframe. Gives precise time-based control over which portion of the animation is repeated.",
    regex:
      "loopInDuration\\(\\s*(?:(?<type>['\"][^'\"]*['\"])(?:,\\s*(?<duration>[^)]+?))?)?\\s*\\)",
    arguments: "type,duration",
  },
  {
    title: "loopOutDuration",
    description:
      "Like loopOut() but uses a time duration in seconds rather than a keyframe count to determine the loop segment. Loops the segment of the timeline that is duration seconds long, starting at the last keyframe. Useful when the loop duration must be tied to a specific time length rather than keyframe count.",
    regex:
      "loopOutDuration\\(\\s*(?:(?<type>['\"][^'\"]*['\"])(?:,\\s*(?<duration>[^)]+?))?)?\\s*\\)",
    arguments: "type,duration",
  },
  {
    title: "key",
    description:
      "Returns a Key object for the keyframe at the given index (1-based) on the property. The Key object exposes the keyframe's time, value, and interpolation type. Use it to access specific keyframe data for building expressions that react to keyframe positions, e.g. triggering an effect at the exact time of a keyframe.",
    regex: "key\\(\\s*(?<indexOrName>[^)]+?)\\s*\\)",
    arguments: "indexOrName",
  },
  {
    title: "nearestKey",
    description:
      "Returns the Key object for the keyframe closest in time to the specified t value. The returned Key object exposes .time and .value. Useful for building expressions that react to whichever keyframe is nearest — for example, snapping a display to the nearest cue point or creating region-of-influence effects around keyframe times.",
    regex: "nearestKey\\(\\s*(?<t>[^)]+?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "previousKey",
    description:
      "Returns the Key object for the keyframe immediately before the given time t. Added in After Effects 26.0. Returns null if no keyframe exists before t. Useful for accessing the most recent past keyframe's value or time to compute how long it has been since the last cue, or to drive transitions from the previous state.",
    regex: "previousKey\\(\\s*(?<t>[^)]+?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "nextKey",
    description:
      "Returns the Key object for the keyframe immediately after the given time t. Added in After Effects 26.0. Returns null if no keyframe exists after t. Useful for look-ahead expressions — for example, anticipating an upcoming event or fade by checking when the next keyframe will occur and ramping a property toward it in advance.",
    regex: "nextKey\\(\\s*(?<t>[^)]+?)\\s*\\)",
    arguments: "t",
  },
  {
    title: "sampleImage",
    description:
      "Samples the color of a layer at the specified point in the layer's own coordinate space at a given time. Returns an [R, G, B, A] color array with values in the 0–1 range. The radius argument controls the area of averaging (antialiasing). Used to build color-reactive expressions — driving opacity, position, or hue from pixel color data of another layer.",
    regex:
      "sampleImage\\(\\s*(?<point>[^,]+?),\\s*(?<radius>[^,)]+?)(?:,\\s*(?<postEffect>[^,)]+?))?(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "point,radius,postEffect,t",
  },

  // ─────────────────────────────────────────────
  // LAYER SPACE TRANSFORMS
  // ─────────────────────────────────────────────
  {
    title: "toComp",
    description:
      "Transforms a point from the layer's local coordinate space to the composition's coordinate space. Essential for cross-layer positioning — for example, finding where a layer's anchor point is in composition space so another layer can follow it, even when the layer is rotated, scaled, or parented.",
    regex: "toComp\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "point,t",
  },
  {
    title: "fromComp",
    description:
      "Transforms a point from the composition's coordinate space into the layer's local coordinate space. The inverse of toComp(). Useful when you have a position in comp space (e.g. from another layer's position) and need to convert it to be used on a property of the current layer that operates in local space.",
    regex: "fromComp\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "point,t",
  },
  {
    title: "toWorld",
    description:
      "Transforms a point from the layer's local coordinate space to the world (3D) coordinate space. In 2D compositions this is equivalent to toComp(). In 3D it properly accounts for the layer's 3D position, orientation, and any parent transformations to give the true world-space location of a point.",
    regex: "toWorld\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "point,t",
  },
  {
    title: "fromWorld",
    description:
      "Transforms a point from the 3D world coordinate space into the layer's local coordinate space. The inverse of toWorld(). Used when you want to express a world-space position as a local coordinate of the current layer — for example, synchronizing an effect's center point with a world-space position regardless of the layer's own transform.",
    regex: "fromWorld\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "point,t",
  },
  {
    title: "toCompVec",
    description:
      "Transforms a vector (direction) from the layer's local coordinate space to the composition's coordinate space. Unlike toComp() which handles points (affected by position/translation), toCompVec handles directional vectors (not affected by translation). Used for transforming rotation axes, velocity vectors, or normal directions.",
    regex: "toCompVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "vec,t",
  },
  {
    title: "fromCompVec",
    description:
      "Transforms a vector (direction) from the composition's coordinate space to the layer's local coordinate space. The inverse of toCompVec(). Used when a direction vector defined in comp space needs to be expressed in the local coordinate system of a rotated or parented layer.",
    regex: "fromCompVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "vec,t",
  },
  {
    title: "toWorldVec",
    description:
      "Transforms a directional vector from the layer's local space to 3D world space. Like toWorld() for directions: not affected by translation, only by rotation and scale. Useful in 3D rigging when you need to express a local axis direction in world coordinates.",
    regex: "toWorldVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "vec,t",
  },
  {
    title: "fromWorldVec",
    description:
      "Transforms a directional vector from 3D world space to the layer's local coordinate space. The inverse of toWorldVec(). Used in 3D expressions that receive a direction in world space and need to apply it in the local frame of a rotated or parented layer.",
    regex: "fromWorldVec\\(\\s*(?<vec>[^,)]+?)(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "vec,t",
  },
  {
    title: "fromCompToSurface",
    description:
      "Projects a point from composition space onto the surface of a 3D layer (in the plane of the layer). Returns the point in the layer's local 2D coordinate system. Useful for mapping comp-space positions onto a 3D layer's local UV space — for example, synchronizing the center of an effect on a 3D layer with an object tracked in comp space.",
    regex:
      "fromCompToSurface\\(\\s*(?<point>[^,)]+?)(?:,\\s*(?<t>[^)]+?))?\\s*\\)",
    arguments: "point,t",
  },

  // ─────────────────────────────────────────────
  // LAYER METHODS
  // ─────────────────────────────────────────────
  {
    title: "sourceRectAtTime",
    description:
      "Returns an object with top, left, width, and height properties describing the bounding box of the layer's source (content) at the given time, in the layer's own coordinate space. Optionally ignores expressions if the second argument is true. Invaluable for building dynamic auto-resizing background boxes behind text layers, and any expression that needs to know content dimensions.",
    regex:
      "sourceRectAtTime\\(\\s*(?:(?<t>[^,)]+?)(?:,\\s*(?<includeExtents>[^)]+?))?)?\\s*\\)",
    arguments: "t,includeExtents",
  },
  {
    title: "sourceTime",
    description:
      "Returns the source footage time corresponding to the current composition time for a time-remapped or time-stretched layer. Useful when building expressions that need to know the actual playback time within the source clip, especially on layers with time remapping applied.",
    regex: "sourceTime\\(\\s*(?<t>[^)]+?)?\\s*\\)",
    arguments: "t",
  },

  // ─────────────────────────────────────────────
  // COMP METHODS
  // ─────────────────────────────────────────────
  {
    title: "thisComp.layer",
    description:
      "Retrieves a layer from the current composition by name, index, or a combination. Returns a Layer object exposing all of that layer's properties and methods. This is the primary way to create cross-layer references in expressions — for example, to parent a property to another layer's position, opacity, or effect value.",
    regex: "thisComp\\.layer\\(\\s*(?<nameOrIndex>[^)]+?)\\s*\\)",
    arguments: "nameOrIndex",
  },
  {
    title: "thisComp.activeCamera",
    description:
      "Returns the Camera object for the camera through which the composition is rendered at the current frame. Note this may differ from the camera you are viewing through in the Composition panel. Use it to build depth-of-field expressions, camera-relative positioning, or effects that react to the active render camera.",
    // No lookahead — chained access like .activeCamera.position is valid.
    regex: "(?<activeCamera>thisComp\\.activeCamera)",
    arguments: "",
  },
  {
    title: "thisComp.marker",
    description:
      "Returns the Marker Property object for the composition's markers. Use .key(name) or .key(index) to retrieve individual MarkerKey objects, which expose the marker's time, duration, comment, chapter, URL, and frame target. Useful for event-driven expressions that trigger at named composition markers.",
    regex: "thisComp\\.marker\\.key\\(\\s*(?<nameOrIndex>[^)]+?)\\s*\\)",
    arguments: "nameOrIndex",
  },
];

export default nativeExpressions;
