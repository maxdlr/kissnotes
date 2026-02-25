export interface Test {
  message: string;
}

export interface KissResponseData<T> {
  data: T;
  status: number;
}

export type KResData<T> = KissResponseData<T> | undefined;

export interface KissResponseError {
  message: string;
}
