export interface Model {
  id: number;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpressionModel extends Model {
  title: string;
  description?: string;
}

export interface KissResponseData<T> {
  data: T;
  status: number;
}

export type KResData<T> = KissResponseData<T> | undefined;

export interface KissResponseError {
  message: string;
}
