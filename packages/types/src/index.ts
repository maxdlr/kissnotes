export type Id = number;

export interface Model {
  id: Id;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CodeModel {
  lines: LineModel[];
}

export interface LineModel {
  number: number;
  content: string;
}

export interface ExpressionModel extends Model {
  title: string;
  description?: string;
  layer: LayerModel;
  property: PropertyModel;
  user: UserModel;
  code: CodeModel;
}

export interface UserModel extends Model {
  firstname: string;
  lastname: string;
  username: string;
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
