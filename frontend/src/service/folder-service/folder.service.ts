import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestConst } from '../../shared/rest-api-const';
import { Folder, FolderDetail } from '../../models/folder/folder';
import { toParams } from '../../utils/params';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = new RestConst().getApiUrl() + '/folders';

  list(parentId?: string | null) {
    const params: any = {};
    if (parentId) {
      params.parentId = parentId;
    }
    return this.httpClient.get<Folder[]>(`${this.apiUrl}`, { params });
  }

  detail(id: string) {
    return this.httpClient.get<FolderDetail>(`${this.apiUrl}/${id}`);
  }

  create(name: string, parentId?: string | null) {
    return this.httpClient.post<Folder>(this.apiUrl, parentId ? { name, parentId } : { name });
  }

  rename(id: string, name: string) {
    return this.httpClient.patch<Folder>(`${this.apiUrl}/${id}/rename`, { name });
  }

  move(id: string, parentId: string | null) {
    return this.httpClient.patch<Folder>(`${this.apiUrl}/${id}/move`, { parentId });
  }
}
