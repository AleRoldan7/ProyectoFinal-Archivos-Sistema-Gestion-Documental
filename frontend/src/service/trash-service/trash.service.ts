import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestConst } from '../../shared/rest-api-const';
import { TrashContent } from '../../models/trash/trash';

@Injectable({
  providedIn: 'root',
})
export class TrashService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = new RestConst().getApiUrl();

  list() { 
    return this.httpClient.get<TrashContent>(`${this.apiUrl}/trash`); 
  }

  sendFolder(id: string) { 
    return this.httpClient.delete(`${this.apiUrl}/folders/${id}`); 
  }

  sendFile(id: string) { 
    return this.httpClient.delete(`${this.apiUrl}/files/${id}`); 
  }
  
  restoreFolder(id: string) { 
    return this.httpClient.patch(`${this.apiUrl}/trash/folders/${id}/restore`, {}); 
  }

  restoreFile(id: string) { 
    return this.httpClient.patch(`${this.apiUrl}/trash/files/${id}/restore`, {}); 
  }

  purgeFolder(id: string) { 
    return this.httpClient.delete(`${this.apiUrl}/trash/folders/${id}`); 
  }

  purgeFile(id: string) { 
    return this.httpClient.delete(`${this.apiUrl}/trash/files/${id}`); 
  }
}
