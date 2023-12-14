export interface RequestData {
  id: any;
  action: string;
  payload: any;
}

export interface ResponseData {
  id: any;
  data?: any;
  error?: any;
}
