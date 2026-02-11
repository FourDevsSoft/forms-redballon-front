import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from '../global.service';
import { Notificacao,ApiResponse } from '../../../shared/models/notificacao.model';

@Injectable({
  providedIn: 'root'
})
export class ApiNotificacaoService {
  private apiUrl: string;

  constructor(private globalService: GlobalService, private http: HttpClient) {
    this.apiUrl = `${this.globalService.apiUrl}/notificacao`;
  }

  listarNotificacoes(pagina: number = 1, limit: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?page=${pagina}&limit=${limit}`, {
      withCredentials: true
    });
  }

  criarNotificacao(dados: Notificacao): Observable<Notificacao> {
    return this.http.post<Notificacao>(`${this.apiUrl}`, dados, {
      withCredentials: true
    });
  }
}
