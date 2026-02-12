import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno, ApiAlunoResponse } from '../../../shared/models/aluno.model';
import { GlobalService } from '../global.service';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  constructor(
    private globalService: GlobalService,
    private http: HttpClient
  ) {}

  private get apiBase(): string {
    return this.globalService.apiUrl;
  }

  private get apiUrl(): string {
    return `${this.apiBase}/aluno`;
  }

  /* ==============================
      CRUD PADRÃO
  ============================== */

  listar(pagina: number = 1, limit: number = 10): Observable<ApiAlunoResponse> {
    return this.http.get<ApiAlunoResponse>(
      `${this.apiUrl}s?page=${pagina}&limit=${limit}`,
      { withCredentials: true }
    );
  }

  buscarPorTermo(termo: string): Observable<ApiAlunoResponse> {
    return this.http.get<ApiAlunoResponse>(
      `${this.apiUrl}s?search=${encodeURIComponent(termo)}`,
      { withCredentials: true }
    );
  }

  buscarPorId(id: number): Observable<{ conteudoJson: any; success: boolean }> {
    return this.http.get<{ conteudoJson: any; success: boolean }>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }

  criar(formData: FormData): Observable<Aluno> {
    return this.http.post<Aluno>(
      `${this.apiUrl}`,
      formData,
      { withCredentials: true }
    );
  }

  atualizar(id: number, formData: FormData): Observable<Aluno> {
    return this.http.put<Aluno>(
      `${this.apiUrl}/${id}`,
      formData,
      { withCredentials: true }
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }

  /* ==============================
      FORMULÁRIO PÚBLICO
  ============================== */

  enviarFormularioAluno(
    formData: FormData
  ): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(
      `${this.apiBase}/alunos`,
      formData
    );
  }

  searchAlunos(search: string, page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get<any>(
      `${this.apiBase}/search-alunos`,
      {
        params: {
          search,
          page,
          limit
        },
        withCredentials: true
      }
    );
  }

  buscarPorNome(nome: string): Observable<any> {
    return this.searchAlunos(nome, 1, 20);
  }


  getAlunoForm(id: number): Observable<{
    conteudoJson: {
      id: number;
      nome: string;
      turma_id: number;
      turma_nome: string;
      foto: string;
    };
    success: boolean;
  }> {
    return this.http.get<{
      conteudoJson: {
        id: number;
        nome: string;
        turma_id: number;
        turma_nome: string;
        foto: string;
      };
      success: boolean;
    }>(
      `${this.apiBase}/aluno-form/${id}`,
      { withCredentials: true }
    );
  }


  baixarPlanilha(search: string = '') {
    return this.http.get(
      `${this.apiUrl}s/download`,
      {
        params: { search },
        responseType: 'blob',
        withCredentials: true
      }
    );
  }

}
