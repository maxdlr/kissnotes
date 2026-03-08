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
