import { HttpParams } from "@angular/common/http";

export function toParams(obj: object): HttpParams {
  let params = new HttpParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
  }
  return params;
}
