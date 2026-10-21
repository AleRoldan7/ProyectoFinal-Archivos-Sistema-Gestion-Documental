import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestConst } from '../../shared/rest-api-const';
import { CreateShareRequest, Permission, Share } from '../../models/sharing/share';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = new RestConst().getApiUrl() + '/shares';

  create(req: CreateShareRequest) {
    return this.httpClient.post<Share>(this.apiUrl, req);
  }

  withMe() { 
    return this.httpClient.get<Share[]>(`${this.apiUrl}/with-me`); 
  }

  byMe() { 
    return this.httpClient.get<Share[]>(`${this.apiUrl}/by-me`); 
  }

  changePermission(id: string, permission: Permission) {
    return this.httpClient.patch<Share>(`${this.apiUrl}/${id}`, { permission });
  }

  revoke(id: string) { 
    return this.httpClient.delete<{ ok: boolean }>(`${this.apiUrl}/${id}`); 
  }
}
