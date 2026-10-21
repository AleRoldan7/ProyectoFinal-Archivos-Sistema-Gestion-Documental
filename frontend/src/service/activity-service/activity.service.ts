import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivityQuery } from '../../models/activity/activity-query';
import { ActivityPage } from '../../models/activity/activity-page';
import { RestConst } from '../../shared/rest-api-const';
import { toParams } from '../../utils/params';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = new RestConst();

  list(activityQuery: ActivityQuery) {
    return this.httpClient.get<ActivityPage>(`${this.apiUrl.getApiUrl()}/activity`, {params: toParams(activityQuery)});
  }
}
