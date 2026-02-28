export type Id = number;

export interface Model {
  id: Id;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpressionModel extends Model {
  title: string;
  description?: string;
  layer: LayerModel;
  property: PropertyModel;
  user: UserModel;
}

export interface UserModel extends Model {
  firstname: string;
  lastname: string;
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

export interface KissResponseData<T> {
  data: T;
  status: number;
}

export type KResData<T> = KissResponseData<T> | undefined;

export interface KissResponseError {
  message: string;
}
