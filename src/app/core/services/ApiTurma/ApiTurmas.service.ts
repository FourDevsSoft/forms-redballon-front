import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turma, ApiResponseTurma, ApiResponseTurmaPublica, TurmaDTO } from '../../../shared/models/turma.model';
import { GlobalService } from '../../services/global.service';
import { ApiAlunosComResponsaveisResponse } from '../../../shared/models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {
  private apiUrl: string;

  constructor(private globalService: GlobalService, private http: HttpClient) {
    this.apiUrl = `${this.globalService.apiUrl}/turmas`;
  }

  listar(pagina: number = 1, itensPorPagina: number = 10): Observable<ApiResponseTurma> {
    return this.http.get<ApiResponseTurma>(`${this.apiUrl}?page=${pagina}&limit=${itensPorPagina}`, {
      withCredentials: true
    });
  }

  listagemPublica(
    pagina = 1,
    itensPorPagina = 10,
    recaptchaToken: string
  ) {
    return this.http.get<ApiResponseTurmaPublica>(
      `${this.apiUrl}?page=${pagina}&limit=${itensPorPagina}&recaptchaToken=${recaptchaToken}`
    );
  }

  listagemSimples(pagina: number = 1, itensPorPagina: number = 10): Observable<ApiResponseTurma> {
    return this.http.get<ApiResponseTurma>(`${this.globalService.apiUrl}/turmas-simples?page=${pagina}&limit=${itensPorPagina}`, {
      withCredentials: true
    });
  }

  listarTurmasProfessor(pagina: number = 1, itensPorPagina: number = 10): Observable<ApiResponseTurma> {
    return this.http.get<ApiResponseTurma>(`${this.globalService.apiUrl}/professor/turmas?page=${pagina}&limit=${itensPorPagina}`, {
      withCredentials: true
    });
  }

  buscarPorId(id: number): Observable<Turma> {
    return this.http.get<Turma>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  criar(turma: TurmaDTO): Observable<Turma> {
    return this.http.post<Turma>(`${this.globalService.apiUrl}/turma/create`, turma, { withCredentials: true });
  }

  atualizar(id: number, turma: TurmaDTO): Observable<Turma> {
    return this.http.put<Turma>(`${this.globalService.apiUrl}/turma/${id}`, turma, { withCredentials: true });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.globalService.apiUrl}/turma/${id}`, { withCredentials: true });
  }

  buscarPorTermo(termo: string): Observable<ApiResponseTurma> {
    return this.http.get<ApiResponseTurma>(`${this.apiUrl}?search=${encodeURIComponent(termo)}`, {
      withCredentials: true
    });
  }

  buscarAlunosResponsaveisPorTurma(idTurma: string): Observable<ApiAlunosComResponsaveisResponse> {
    return this.http.get<ApiAlunosComResponsaveisResponse>(`${this.globalService.apiUrl}/turma/alunos/${idTurma}`, {
      withCredentials: true
    });
  }

  baixarPlanilha(search: string = '') {
    return this.http.get(`${this.apiUrl}/download`, {
      params: { search },
      responseType: 'blob',
      withCredentials: true
    });
  }
}
