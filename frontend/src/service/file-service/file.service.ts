import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestConst } from '../../shared/rest-api-const';
import { FileQuery } from '../../models/file/file-query';
import { FilePage } from '../../models/file/file-page';
import { toParams } from '../../utils/params';
import { FileResponse } from '../../models/file/file-response';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = new RestConst();

  list(fileQuery: FileQuery) {
    return this.httpClient.get<FilePage>(`${this.apiUrl.getApiUrl()}/files/list-file`, {params: toParams(fileQuery)});
  }

  getOne(id: string) {
    return this.httpClient.get(`${this.apiUrl.getApiUrl()}/files/${id}/download`, {responseType: 'text'});
  }

   upload(file: File, folderId: string | null) {
    const body = new FormData();
    body.append('file', file, file.name);
    if (folderId) body.append('folderId', folderId);
    return this.httpClient.post<FileResponse>(`${this.apiUrl.getApiUrl()}/files/upload-file`, body);
  }

  replaceContent(id: string, text: string, name: string) {
    const body = new FormData();
    body.append('file', new Blob([text], { type: 'text/plain' }), name);
    return this.httpClient.put<FileResponse>(`${this.apiUrl.getApiUrl()}/files/${id}/content`, body);
  }

  rename(id: string, name: string) { 
    return this.httpClient.patch<FileResponse>(`${this.apiUrl.getApiUrl()}/files/${id}/rename`, { name }); 
  }

  move(id: string, folderId: string | null) {
    return this.httpClient.patch<FileResponse>(`${this.apiUrl.getApiUrl()}/files/${id}/move`, { folderId });
  }

  metadatos(id: string) {
    return this.httpClient.get<FileResponse>(`${this.apiUrl.getApiUrl()}/files/${id}`);
  }
}
