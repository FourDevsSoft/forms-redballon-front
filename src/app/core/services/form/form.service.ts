import { Injectable } from '@angular/core';
import { GlobalService } from '../global.service';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { CheckPrincipalResponse } from '../../../shared/models/responsavel.model';
import { AlunoParaEnvio } from '../../../shared/models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl: string;
  
  // Armazena dados do check-principal
  private checkPrincipalData = new BehaviorSubject<CheckPrincipalResponse | null>(null);
  public checkPrincipalData$ = this.checkPrincipalData.asObservable();

  constructor(private globalService: GlobalService, private http: HttpClient) {
    this.apiUrl = `${this.globalService.apiUrl}/aluno`;
  }

  checkPrincipal(params: { cpf: string; recaptchaToken: string }): Observable<any> {
    const url = `${this.globalService.apiUrl}/check-principal`;
    return this.http.post<any>(url, params, { withCredentials: false });
  }

  // Armazena a resposta do check-principal
  setCheckPrincipalData(data: CheckPrincipalResponse): void {
    this.checkPrincipalData.next(data);
  }

  // Obtém a resposta armazenada
  getCheckPrincipalData(): CheckPrincipalResponse | null {
    return this.checkPrincipalData.value;
  }

  // Limpa os dados
  clearCheckPrincipalData(): void {
    this.checkPrincipalData.next(null);
  }

  // Envia o formulário final com os novos responsáveis
  enviarNovosResponsaveis(formData: FormData): Observable<any> {
    const url = `${this.globalService.apiUrl}/atualizar-alunos`;
    return this.http.post<any>(url, formData, { withCredentials: false });
  }

}