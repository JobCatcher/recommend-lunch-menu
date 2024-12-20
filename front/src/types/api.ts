export interface ApiResponse<T> extends Response {
  status: number;
  statusText: string;
  message: string;
  data: T | T[];
}
