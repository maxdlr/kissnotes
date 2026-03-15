export type TokenKind =
  | "function"
  | "method"
  | "property"
  | "variable"
  | "unknown";

export interface CallArgument {
  id: number;
  /** Parameter name, if declared in NativeExpressionModel.arguments */
  name?: string;
  /** Raw string value as it appears in the expression */
  value: string;
}

export interface ExpressionToken {
  id: number;
  /** Empty function signature e.g. "wiggle()" — or bare name for non-functions e.g. "position" */
  label: string;
  /** Full raw match as it appears in code e.g. "wiggle(2, 30)" */
  fullMatch: string;
  /** Base name without parentheses or arguments e.g. "wiggle" */
  title: string;
  /** Human-readable description (from NativeExpressionModel when available) */
  description?: string;
  /** Whether this token was matched by a NativeExpressionModel regex */
  isNative: boolean;
  /** Semantic category */
  kind: TokenKind;
  /** Argument values as they appear at this specific call site */
  callArguments?: CallArgument[];
  /** Declared parameter names from NativeExpressionModel.arguments */
  paramNames?: string[];
  /** ~40-char context window centred on the match — ready to use as a tooltip snippet */
  lookingGlass: string;
  /** 0-based character offset in the flattened expression text */
  index: number;
  /** 1-based line number */
  line: number;
  /** 0-based column number */
  column: number;
  /** Named capture groups from the native regex, if any */
  captureGroups?: Record<string, string>;
}

export interface ExpressionSymbol {
  id: number;
  /** Full expression text (lines joined with \n) */
  text: string;
  /** All tokens sorted by their occurrence in the source */
  tokens: ExpressionToken[];
  /** Tokens grouped by semantic kind for convenient frontend consumption */
  groups: {
    functions: ExpressionToken[];
    methods: ExpressionToken[];
    properties: ExpressionToken[];
    variables: ExpressionToken[];
    unknown: ExpressionToken[];
  };
}

export type Id = number | string;

export interface Model {
  id: Id;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RefreshTokenModel extends Model {
  token: string;
  expireOn: Date;
  revokedOn?: Date;
  revokedReason?: "user-logout" | "token-replaced" | "password-change";
  rotatedFrom?: Id;
  rotatedTo?: Id;
  userId: Id;
  isExpired?: boolean;
}

export interface CodeModel {
  lines: LineModel[];
}

export interface LineModel {
  number: number;
  content: string;
}

export interface NativeExpressionModel extends Model {
  title: string;
  regex: string;
  arguments: string;
  description: string;
}

export interface ExpressionModel extends Model {
  title: string;
  description?: string;
  layer: LayerModel;
  property: PropertyModel;
  author: UserModel;
  code: CodeModel;
  symbols?: ExpressionSymbol;
}

export interface AuthId {
  username: string;
  password: string;
  token: string;
}

export interface UserModel extends Model {
  email: string;
  username: string;
  password: string;
  expressions: ExpressionModel[];
}

export interface LayerModel {
  type: string;
  name: string;
}

export interface PropertyModel {
  group: string;
  name: string;
}

// --------------------------------------------------

export interface KissApiError extends Error {
  status: number;
}

export interface KissCrudError extends Error {
  status: number;
}

export interface KissApiResponse {
  status: number;
  message: string;
  count?: number;
  error?: any;
  body?: any;
}

export type KRes<T> = T | undefined;

export interface KissResponseError {
  message: string;
}

// --------------------------------------------------
