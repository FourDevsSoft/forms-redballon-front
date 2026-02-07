import { Injectable } from '@angular/core';
import { GlobalService } from '../global.service';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
    private apiUrl: string;

  constructor(private globalService: GlobalService, private http: HttpClient) {
    this.apiUrl = `${this.globalService.apiUrl}/aluno`;
  }

  checkPrincipal(params: { nome: string; cpf: string; recaptchaToken: string }): Observable<any> {
    const url = `${this.globalService.apiUrl}/check-principal`;
    return this.http.post<any>(url, params, { withCredentials: false });
  }

}