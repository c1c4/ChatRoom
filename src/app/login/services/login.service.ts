import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserOutput } from 'src/app/model/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(userName: string, password: string): Observable<UserOutput> {
    return this.http.get<UserOutput>(`${environment.LOGIN_ENDPOINT}?userName=${userName}&password=${password}`);
  }
}
