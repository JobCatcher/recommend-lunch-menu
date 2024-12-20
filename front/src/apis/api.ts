import {API_RES_OK} from '../constant/constant';
import {ApiResponse} from '../types/api';

export const fetchHelper = async <T>(url: string, options?: any): Promise<T | T[]> => {
  const res = await fetch(url, options);
  const {data, statusText}: ApiResponse<T> = await res.json();

  if (statusText === API_RES_OK) {
    return data;
  } else {
    return Promise.reject(data);
  }
};
