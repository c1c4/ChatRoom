import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageOutput } from '../model/Message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) { }

  getLastFifty(): Observable<MessageOutput[]> {
    return this.http.get<MessageOutput[]>(`${environment.MESSAGES_ENDPOINT}/last_fifty`);
  }
}
