const privateUriPatterns: readonly string[] = ["^/@[^/]+/settings$"];

const privateUris: readonly RegExp[] = privateUriPatterns.map(
  (pattern) => new RegExp(pattern),
);

export default privateUris;
